import {last} from 'lodash'
import {useEffect, createContext, useContext} from 'react'

import {useNavigate, useLocation} from 'react-router-dom'

import {useAuth} from './AuthContext'
import storage from '../../utils/storage'

import jwt_decode from 'jwt-decode'
const SessionContext = createContext({})

const unauthenticatedPages = [' ', 'login', 'register', 'forgot-password', 'reset-password']

export function SessionProvider({children}) {
  const navigation = useNavigate()
  const router = useLocation()
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

    if (unauthenticatedPages.includes(current_page)) {
      return
    }

    if (!current_page) {
      if (isToken) return navigation('/dashboard')
    }

    if (!isToken) return navigation('/')
  }

  useEffect(() => {
    check_route()

    // eslint-disable-next-line
  }, [router.pathname])

  return <SessionContext.Provider value={{check_token}}>{children}</SessionContext.Provider>
}

export const useSession = () => {
  return useContext(SessionContext)
}
