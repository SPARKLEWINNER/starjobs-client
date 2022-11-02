import {last} from 'lodash'
import React, {useEffect, useState, createContext, useContext} from 'react'
import PropTypes from 'prop-types'

import {navigate} from 'gatsby'

import {useAuth} from './AuthContext'
import storage from 'utils/storage'

import jwt_decode from 'jwt-decode'
import settings_api from 'libs/endpoints/settings'
SessionProvider.propTypes = {
  children: PropTypes.node
}

const SessionContext = createContext({})

export const unauthenticatedPages = ['login', 'sign-up', 'forgot-password', 'reset-password']

export function SessionProvider({children}) {
  const router = window.location
  const [sessionScreen, setSessionScreen] = useState(undefined)
  const {sessionToken, sessionUser} = useAuth()

  const check_token = async () => {
    const token = await storage.getToken()
    // assume user have a token or signed in
    if (!token) return false

    const decode = jwt_decode(token).exp

    // check user token  is expired
    if (decode * 1000 < new Date().getTime()) return false

    await sessionToken(token)
    await sessionUser()

    check_app_version()
    return true
  }

  const check_route = async () => {
    const current_page = last(router.pathname.replace('/', '').split('/'))
    const isToken = await check_token()

    const activeTab = sessionStorage.getItem('tab')
    if (activeTab) {
      setSessionScreen(JSON.parse(activeTab))
    }

    if (unauthenticatedPages.includes(current_page)) {
      return
    }

    if (!current_page) {
      if (isToken) return navigate('/dashboard')
    }

    if (!isToken) return navigate('/')
  }

  const check_app_version = async () => {
    const check_settings = await settings_api.get_settings()
    if (!check_settings.ok) return
    const current_version = localStorage.getItem('appversion')
    if (!current_version || current_version === 'undefined' || current_version === undefined) {
      localStorage.setItem('appversion', check_settings.data.appVersion)
    } else {
      if (check_settings.data.appVersion !== current_version) {
        localStorage.setItem('appversion', check_settings.data.appVersion)
        return window.location.reload(false)
      }
    }
  }

  const handleSessionScreen = (tab) => {
    setSessionScreen(tab)
    sessionStorage.setItem('tab', tab)
  }

  useEffect(() => {
    check_route()

    // eslint-disable-next-line
  }, [router.pathname])

  return (
    <SessionContext.Provider value={{sessionScreen, check_token, handleSessionScreen}}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  return useContext(SessionContext)
}
