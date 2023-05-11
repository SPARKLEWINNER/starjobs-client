const FCMTOKEN = require('../../users/models/fcm-tokens')
const axios = require('axios')

/**
 *
 * @userIds [List of Strings] list of user ids where you want to send the notification
 * @title String - title of the notification - default is Starjobs
 * @body String - body of the notification - default is A New Gig is Nearby
 * @imageUrl String - image url of the notification - default is https://www.starjobs.com.ph/app-logo.png
 * @sound sound of the notification - default is 1
 * @vibrate vibrate of the notification - default is 1
 * @content_available  Bool - content_available of the notification - default is true
 * @show_in_foreground  Bool - show_in_foreground of the notification - default is true
 * @priority priority of the notification - default is high
 *
 *
 */
const sendFcmNotificationByUserIDs = async ({
  userIds = [],
  title = 'Starjobs',
  body = 'A New Gig is Nearby',
  imageUrl = 'https://www.starjobs.com.ph/app-logo.png',
  sound = 1,
  vibrate = 1,
  content_available = true,
  show_in_foreground = true,
  priority = 'high'
}) => {
  if (userIds.length == 0) return

  let tokens

  //Loop through user id's
  for (let index = 0; index < userIds.length; index++) {
    let tokenDocs = await FCMTOKEN.find({userId: userIds[index]})

    tokens = tokenDocs.flatMap((token) => token.fcmToken)

    await axios('https://fcm.googleapis.com/fcm/send', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.FCM_SERVER_KEY
      },

      data: {
        notification: {
          title: title,
          body: body,
          imageUrl: imageUrl,
          sound: sound,
          vibrate: vibrate,
          content_available: content_available,
          show_in_foreground: show_in_foreground,
          priority: priority
        },
        registration_ids: [...tokens]
      }
    })
  }

  return {
    notification: {
      title: title,
      body: body,
      imageUrl: imageUrl,
      sound: sound,
      vibrate: vibrate,
      content_available: content_available,
      show_in_foreground: show_in_foreground,
      priority: priority
    },
    registration_ids: [...tokens]
  }
}

module.exports = sendFcmNotificationByUserIDs
