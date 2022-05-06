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

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [router.pathname])

  return <NotificationsContext.Provider value={{notification}}>{children}</NotificationsContext.Provider>
}

export const useNotifications = () => {
  return useContext(NotificationsContext)
}
