import React, {useState, useEffect, createContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import jwt_decode from 'jwt-decode'

import storage from 'utils/storage'
import user_api from 'api/users'
import auth_api from 'api/auth'

const UsersContext = createContext()

const UsersProvider = ({children}) => {
  const {pathname} = useLocation()
  const navigation = useNavigate()
  const [user, setUser] = useState([])
  let whitelist = ['/sign-up', '/verification', '/404', '/login']

  const check_login = async () => {
    let token = await storage.getToken()
    const current_date = new Date()

    if (whitelist.includes(pathname)) {
      return
    }

    if (!token || jwt_decode(token)['exp'] * 1000 < current_date.getTime()) {
      const refresh_access = await auth_api.post_refresh_access()
      if (!refresh_access.ok) {
        return navigation('/login')
      }

      let data = refresh_access.data
      await storage.storeToken(data.token)
      token = data.token
    }

    const result = await user_api.get_user(jwt_decode(token)['id'])
    if (!result.ok) {
      return
    }

    if (result.data === undefined || !result.data) {
      return
    }

    // if (!result.data.isVerified) return navigation('/verification')

    let accessType = result.data.accountType === 1 ? '/client' : '/freelancer'
    setUser({...result.data, accessType: accessType})
    return {...result.data, accessType: accessType}
  }

  const check_active = () => {
    check_login()
    return user.isActive ? true : false
  }

  const check_user = () => {
    check_login()
    return user.isActive ? user : false
  }

  useEffect(() => {
    check_login()
    // eslint-disable-next-line
  }, [pathname])

  return (
    <UsersContext.Provider value={{user, setUser, check_login, check_active, check_user}}>
      {children}
    </UsersContext.Provider>
  )
}

const UserConsumer = UsersContext.Consumer

export {UsersContext, UsersProvider, UserConsumer}
