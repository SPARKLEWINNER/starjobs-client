const Notifications = require('../controller/notifications/models/notifications.model')
const Users = require('../controller/users/models/users.model')

const logger = require('./loggers')

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
