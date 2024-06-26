const fetch = require('axios')
const mongoose = require('mongoose')
const {ENV} = process.env

var controller = {
  send_notif: async function (fcmTokenArray, message, url, status) {
    console.log(status, 'status')
    let notifSound
    let channel
    if (status === 'Applying' || status === 'Accepted' || status === 'End-Shift') {
      notifSound = 'notification_sound.wav'
      channel = 'sound_channel'
    } else {
      notifSound = 'default'
      channel = 'default'
    }
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
          sound: notifSound,
          android_channel_id: channel,
          vibrate: 1,
          content_available: true,
          show_in_foreground: true,
          priority: 'high',
          status: status
        },
        data: {
          // status:  message[0].status,
          // gig_status: message[0].type,
          url: url,
          type: 'route',
          status: status
        },
        registration_ids: fcmTokenArray
      }
    })
  }
}

module.exports = controller
