import Pusher from 'pusher-js'
import {last} from 'lodash'
import PropTypes from 'prop-types'
import {useEffect, useState, createContext, useContext} from 'react'

import {useLocation} from 'react-router-dom'

import user_api from 'src/lib/users'
import {useAuth} from './AuthContext'
import {unauthenticatedPages} from './SessionContext'

NotificationsProvider.propTypes = {
  children: PropTypes.node
}

const NotificationsContext = createContext({})

export function NotificationsProvider({children}) {
  const router = useLocation()
  const {currentUser, sessionUser} = useAuth()
  const [notification, setNotifications] = useState(0)
  const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    encrypted: true
  })
  const channel = pusher.subscribe('notifications')

  const load = async () => {
    const current_page = last(router.pathname.replace('/', '').split('/'))
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
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [router.pathname])

  return (
    <NotificationsContext.Provider value={{notification, pusher, channel}}>{children}</NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  return useContext(NotificationsContext)
}
