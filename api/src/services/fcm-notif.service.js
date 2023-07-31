const fetch = require('axios')
const mongoose = require('mongoose')
const {ENV} = process.env

var controller = {
  send_notif: async function (fcmTokenArray, message, url) {
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'key=' + process.env.FCM_SERVER_KEY
      },
      data: {
        notification: {
          title: 'Starjobs',
          body: message,
          icon: 'https://www.starjobs.com.ph/app-logo.png',
          sound: 1,
          vibrate: 1,
          content_available: true,
          show_in_foreground: true,
          priority: 'high'
        },
        data: {
          // status:  message[0].status,
          // gig_status: message[0].type,
          url: url,
          type: 'route'
        },
        registration_ids: fcmTokenArray
      }
    })
  }
}

module.exports = controller
