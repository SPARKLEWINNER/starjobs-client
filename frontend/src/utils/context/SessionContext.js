import {last} from 'lodash'
import {useEffect, useState, createContext, useContext} from 'react'

import {useNavigate, useLocation} from 'react-router-dom'

import {useAuth} from './AuthContext'
import storage from '../../utils/storage'

import jwt_decode from 'jwt-decode'
const SessionContext = createContext({})

export const unauthenticatedPages = [' ', 'login', 'sign-up', 'forgot-password', 'reset-password']

export function SessionProvider({children}) {
  const navigation = useNavigate()
  const router = useLocation()
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
      if (isToken) return navigation('/dashboard')
    }

    if (!isToken) return navigation('/')
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
