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
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
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
       // Check if the response status is ok (status code 2xx)
       if (!response.ok) {
        const errorDetails = await response.json();
        console.error('FCM API error:', errorDetails);
        throw new Error(`FCM Error: ${errorDetails.error.message || 'Unknown error'}`);
      }

      // Parse and log successful response (for debugging purposes)
      const data = await response.json();
      console.log('FCM Response:', data);
    }catch(error){
      console.error('Error sending notification to FCM:', error.message || error);
    }
    
  }
}

module.exports = controller
