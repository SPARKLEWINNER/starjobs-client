import {useState, useContext, createContext} from 'react'
import storage from '../storage'
import auth_api from '../../api/auth'

const authContext = createContext({})

export function AuthProvider({children}) {
  const auth = useProvideAuth()

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [authToken, setAuthToken] = useState(null)
  const [currentUser, setCurrentUser] = useState({})

  const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setAuthToken(null)
  }

  const signIn = async ({email, password}) => {
    if (!email || !password)
      return {
        msg: 'Missing fields',
        status: false,
      }

    const result = await auth_api.sign_in_email({email: email, password: password})
    if (!result.ok) {
      return {
        msg: 'Invalid credentials',
        status: false,
      }
    }

    let data = result.data
    if (data) {
      let user = {
        accountType: data?.accountType,
        createdAt: data?.createdAt,
        dateCreated: data?.dateCreated,
        deviceId: data?.deviceId,
        email: data?.email,
        isActive: data?.isActive,
        isAvailable: data?.isAvailable,
        isVerified: data?.isVerified,
        photo: data?.photo,
        phone: data?.phone,
        verificationCode: data?.verificationCode,
        name: data?.name,
        _id: data?._id,
      }

      setCurrentUser(user)
      setAuthToken(data.token)

      storage.storeUser(user)
      storage.storeRefreshToken(data.refreshToken)
      storage.storeToken(data.token)

      return {
        msg: 'Success Login',
        status: true,
      }
    }
    return {
      msg: 'Invalid credentials',
      status: false,
    }
  }

  const isSignedIn = () => {
    if (authToken) {
      return true
    } else {
      return false
    }
  }

  const sessionToken = (token) => {
    setAuthToken(token)
  }

  const sessionUser = () => {
    setCurrentUser(JSON.parse(storage.getUser()))
  }

  return {
    signIn,
    signOut,
    isSignedIn,
    currentUser,
    sessionToken,
    sessionUser,
  }
}
