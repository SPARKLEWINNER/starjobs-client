const key = 'token'
const user = 'user'
const refreshToken = 'refreshToken'

const storeToken = (token) => {
  try {
    window.localStorage.setItem(key, token)
  } catch (error) {
    console.log('Error storing the auth token', error)
  }
}

const storeRefreshToken = (token) => {
  try {
    window.localStorage.setItem(refreshToken, token)
  } catch (error) {
    console.log('Error storing the auth token', error)
  }
}

const storeUser = (data) => {
  try {
    window.localStorage.setItem(user, JSON.stringify(data))
  } catch (error) {
    console.log('Error storing the user', error)
  }
}

const getToken = () => {
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.log('Error getting the auth token', error)
  }
}

const getUser = () => {
  try {
    return window.localStorage.getItem(user)
  } catch (error) {
    console.log('Error getting the user', error)
    return false
  }
}

const remove = () => {
  try {
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('uid')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('sid')
  } catch (error) {
    console.log('Error removing the token', error)
  }
}

const getRefreshToken = () => {
  try {
    return window.localStorage.getItem(refreshToken)
  } catch (error) {
    console.log('Error getting the store', error)
  }
}

const _expObject = {
  getToken,
  getUser,
  remove,
  storeToken,
  storeUser,
  storeRefreshToken,
  getRefreshToken
}

export default _expObject
