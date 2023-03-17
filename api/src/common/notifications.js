const Notifications = require('../controller/notifications/models/notifications.model')
const Users = require('../controller/users/models/users.model')
const FcmTokens = require('../controller/users/models/fcm-tokens')
const fetch = require("axios");
const mongoose = require('mongoose')
const {Types} = mongoose

const logger = require('./loggers')

const {FCM_SERVER_KEY} = process.env
var controller = {
  globalNotification: async function (additionalData, location) {
    const jobster = await Users.aggregate([
      {
        $lookup: {
          localField: '_id',
          from: 'users-freelancers',
          foreignField: 'uuid',
          as: 'account'
        }
      },
      {
        $unwind: {
          path: '$account',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'account.presentCity': {$regex: new RegExp(location, 'i')}
        }
      }
    ])
      .match({
        accountType: 0,
        isActive: true,
        isVerified: true
      })
      .exec()
      
    let targetUsers = []
    if (jobster && jobster.length >= 1) {
      await jobster.forEach((item) => {
        targetUsers.push(item._id)
      })
    } else {
      return
    } 
    const users_fcm = await FcmTokens.find({userId: {$in: targetUsers}})
    .lean()
    .exec()
    const fcmTokenArray = users_fcm.map(user => user.fcmToken);
    console.log("user tokens: " + fcmTokenArray)
    if(fcmTokenArray.length != 0 ){
      try {
        console.log("--------TRY--------")
        await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'key=' + process.env.FCM_SERVER_KEY
          },
          data: {
            notification: {
              title: 'Starjobs',
              body: 'A New Gig is Nearby',
              imageUrl: 'https://www.starjobs.com.ph/app-logo.png',
              sound: 1,
              vibrate: 1,
              content_available: true,
              show_in_foreground: true,
              priority: "high",
            },
            data: {
              url: 'http://192.168.1.3:8000/freelancer/message',
              type: "route"
            },
            registration_ids : fcmTokenArray
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
    


    
    const notificationInput = new Notifications({
      title: 'A gig offer nearby is posted',
      body: 'Visit the client to get the gig',
      targetUsers: targetUsers,
      type: 'GigNotif',
      target: 'Selected',
      additionalData: JSON.stringify(additionalData)
    })

    try {
      await Notifications.create(notificationInput)
    } catch (error) {
      await logger.logError(error, 'Notifications.globalNotification', null, additionalData.user[0]._id, 'POST')
    }
  }
}

module.exports = controller
