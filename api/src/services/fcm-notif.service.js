const fetch = require('axios')
const fetch2 = (...args) => import('node-fetch').then(({default: fetch2}) => fetch2(...args))
const mongoose = require('mongoose')
const {ENV} = process.env
const {GoogleAuth} = require('google-auth-library')
const FcmTokens = require('../controller/users/models/fcm-tokens')

const projectId = 'starjobs-313714'

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
        const errorDetails = await response.json()
        console.error('FCM API error:', errorDetails)
        throw new Error(`FCM Error: ${errorDetails.error.message || 'Unknown error'}`)
      }

      // Parse and log successful response (for debugging purposes)
      const data = await response.json()
      console.log('FCM Response:', data)
    } catch (error) {
      console.error('Error sending notification to FCM:', error.message || error)
    }
  },

  sendFCMNotifications: async function (fcmTokens, title, body, status) {
    const sendFCMNotificationToToken = async (accessToken, token, title, body) => {
      console.log('token:', token)
      console.log('projectId:', projectId)
      console.log('accessToken:', accessToken)
      console.log('title:', title)

      try {
        console.log('rest:')

        const response = await fetch2(`https://fcm.googleapis.com/v1/projects/starjobs-313714/messages:send`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: {
              notification: {
                title: title,
                body: body,
                image: 'https://www.starjobs.com.ph/app-logo.png' // ✅ Optional image (big picture in expanded view)
              },
              token: token,
              android: {
                priority: 'high',
                notification: {
                  sound: 'notification_sound', // ✅ Correct placement
                  vibrateTimings: ['0.5s', '1s', '1.5s'] // ✅ Correct format
                  // defaultVibrateTimings: true
                }
              },
              apns: {
                payload: {
                  aps: {
                    sound: 'notification_sound.wav', // ✅ Correct format for iOS
                    badge: 0
                  }
                }
              },
              data: {
                status: status, // 📝 Extra data (e.g., status)
                url: body
              }
            }
          })
        })

        console.log('response:', response)
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error Response:', errorText)
          const errorDetails = JSON.parse(errorText)
          if (
            response.status === 404 &&
            errorDetails.error &&
            errorDetails.error.details &&
            errorDetails.error.details[0] &&
            errorDetails.error.details[0].errorCode === 'UNREGISTERED'
          ) {
            console.log(`Token ${token} is no longer registered.`)
            // Handle the unregistered token (e.g., remove from your database)
            await handleFCMError(token)
          }
        }

        const responseData = await response.json()
        console.log('Response Data:', responseData)

        return responseData
      } catch (error) {
        console.error('Error sending FCM notification:', error)
        throw error
      }
    }

    const handleFCMError = async (token) => {
      try {
        // Remove the invalid token from the database
        await FcmTokens.deleteOne({fcmToken: token})
        console.log(`Token ${token} has been removed from the database XXXX.`)
      } catch (dbError) {
        console.error('Error removing token from database:', dbError)
      }
    }

    const getAccessToken = (() => {
      let cachedToken = null
      return async () => {
        if (cachedToken) return cachedToken

        const keyFileContent = process.env.GOOGLE_CREDENTIALS
        const keyFile = JSON.parse(keyFileContent)
        const auth = new GoogleAuth({
          credentials: keyFile,
          scopes: ['https://www.googleapis.com/auth/firebase.messaging']
        })

        // console.log('Fetching access token...', auth)
        const client = await auth.getClient()
        const tokenResponse = await client.getAccessToken()
        cachedToken = tokenResponse.token

        // console.log('Client:', client)
        // Expire the token after 45 minutes (typical token expiration time is 1 hour)
        setTimeout(() => {
          cachedToken = null
        }, 45 * 60 * 1000)

        return cachedToken
      }
    })()

    const results = []
    const accessToken = await getAccessToken()
    console.log('🚀 accessToken:', accessToken)

    console.log('🚀 Sending notification to this fcmTokens:', fcmTokens)

    for (const token of fcmTokens) {
      console.log('🚀 token:', token)

      try {
        const result = await sendFCMNotificationToToken(accessToken, token, title, body)
        results.push({token, result})
        console.log(`Notification sent to token ${token}:`, result)
      } catch (error) {
        // Continue sending to other tokens even if 404 error occurs
        if (error.response && error.response.status === 404) {
          const errorDetails = error.response.data
          if (
            errorDetails &&
            errorDetails.error &&
            errorDetails.error.details &&
            errorDetails.error.details[0] &&
            errorDetails.error.details[0].errorCode === 'UNREGISTERED'
          ) {
            console.log(`Token ${token} is unregistered and will be removed.`)
            await handleFCMError(token) // Handle the invalid token
          } else {
            console.error('Error sending FCM notification:', error.message)
          }
        }
      }
    }

    return results
  }
}

module.exports = controller
