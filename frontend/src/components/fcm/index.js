import React, {useState, useEffect} from 'react'
import {getToken} from './../../firebase'

import fcm_api from 'api/fcm'
import user_api from 'api/users'

export default function Notifications() {
  const [isTokenFound, setTokenFound] = useState(false)
  // To load once

  const checkIfPushIsEnabled = () => {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') > -1) {
      } else {
        return
      }
    }
    //---check if push notification permission has been denied by the user---
    if (Notification.permission === 'denied') {
      console.log('User has blocked push notification.')
      Notification.requestPermission()
      return
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission()

      return
    }

    //---check if push notification is supported or not---
    if (!('PushManager' in window)) {
      alert(`Sorry, Push notification is not supported on this browser.`)
      return
    }
    //---get push notification subscription if serviceWorker is registered and ready---
    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager
        .getSubscription()
        .then(function (subscription) {
          if (subscription) {
            console.log(subscription)
          } else {
          }
        })
        .catch(function (error) {
          console.error('Error occurred enabling push ', error)
        })
    })
  }

  useEffect(() => {
    let token

    async function tokenFunc() {
      checkIfPushIsEnabled()
      if (Notification.permission !== 'denied') {
        if (getToken === undefined) return

        token = await getToken(setTokenFound)
        if (token) {
          const check_user = await user_api.get_user()
          if (!check_user.ok) return

          let user = check_user.data
          if (user.deviceId !== token) {
            await fcm_api.patch_subscriber_token(user._id, token)
          }
        }
        return token
      }
    }

    tokenFunc()
  }, [isTokenFound])

  return <></>
}
