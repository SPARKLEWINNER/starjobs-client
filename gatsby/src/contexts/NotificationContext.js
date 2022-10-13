import Pusher from 'pusher-js'
// import * as PusherPushNotifications from '@pusher/push-notifications-web'

import {last} from 'lodash'
import PropTypes from 'prop-types'
import {useEffect, useState, createContext, useContext} from 'react'

import user_api from '../api/endpoints/users'
import {useAuth} from './AuthContext'
import {unauthenticatedPages} from './SessionContext'

NotificationsProvider.propTypes = {
  children: PropTypes.node
}

const NotificationsContext = createContext({})

export function NotificationsProvider({children}) {
  const {currentUser, sessionUser} = useAuth()
  const [notification, setNotifications] = useState(0)
  const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    encrypted: true
  })
  const channel = pusher.subscribe('notifications')

  const load = async () => {
    const current_page = last(window.location.pathname.replace('/', '').split('/'))
    if (unauthenticatedPages.includes(current_page)) {
      return
    }

    await sessionUser()

    if (!currentUser) {
      return
    }

    let result
    if (currentUser.accountType === 1) {
      result = await user_api.get_user_notifications_client(currentUser._id)
    } else {
      result = await user_api.get_user_notifications(currentUser._id)
    }

    if (!result.ok) return

    const {data} = result.data
    if (data.length === 0) return

    let unread = data.filter((obj) => obj.isRead === false)
    setNotifications(unread.length)
  }

  const checkPushNotification = () => {
    // var ua = navigator.userAgent.toLowerCase()
    // if (ua.indexOf('safari') !== -1) {
    //   if (ua.indexOf('chrome') <= -1) return
    // }
    // //---check if push notification permission has been denied by the user---
    // if (Notification.permission === 'denied') {
    //   console.log('User has blocked push notification.')
    //   Notification.requestPermission()
    //   return
    // }
    // if (Notification.permission === 'default') {
    //   Notification.requestPermission()
    //   return
    // }
    // //---check if push notification is supported or not---
    // if (!('PushManager' in window)) {
    //   alert(`Sorry, Push notification is not supported on this browser.`)
    //   return
    // }
    // //---get push notification subscription if serviceWorker is registered and ready---
    // navigator.serviceWorker.ready.then(function (registration) {
    //   registration.pushManager
    //     .getSubscription()
    //     .then(function (subscription) {
    //       if (subscription) {
    //         console.log(subscription)
    //       }
    //     })
    //     .catch(function (error) {
    //       console.error('Error occurred enabling push ', error)
    //     })
    // })
  }

  const loadSocketConnection = () => {
    channel.bind('new_notification', () => {
      load()
    })
    channel.bind('notify_gig', () => {
      load()
    })
  }

  useEffect(() => {
    loadSocketConnection()
    checkPushNotification()
  }, [])

  useEffect(() => {
    load()
    checkPushNotification()
    // eslint-disable-next-line
  }, [window.location.pathname])

  return (
    <NotificationsContext.Provider value={{notification, pusher, channel}}>{children}</NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  return useContext(NotificationsContext)
}
