import SecureLS from 'secure-ls'
const ls = new SecureLS({encodingType: 'aes'})

const key = 'token'
const location = 'geolocation'
const user = 'user'
const store = 'store'
const refreshToken = 'refreshToken'

const storeToken = (token) => {
  try {
    ls.set(key, token)
  } catch (error) {
    console.log('Error storing the auth token', error)
  }
}

const storeRefreshToken = (token) => {
  try {
    ls.set(refreshToken, token)
  } catch (error) {
    console.log('Error storing the auth token', error)
  }
}

const storeUser = (data) => {
  console.log(data)
  try {
    ls.set(user, JSON.stringify(data))
  } catch (error) {
    console.log('Error storing the user', error)
  }
}

const getToken = () => {
  try {
    return ls.get(key)
  } catch (error) {
    console.log('Error getting the auth token', error)
  }
}

const getUser = () => {
  try {
    return ls.get(user)
  } catch (error) {
    console.log('Error getting the user', error)
    return false
  }
}

const remove = () => {
  try {
    ls.remove('user')
    ls.remove('uid')
    ls.remove('token')
    ls.remove('sid')
  } catch (error) {
    console.log('Error removing the token', error)
  }
}

const storeLocation = (geolocation) => {
  try {
    ls.set(location, geolocation)
  } catch (error) {
    console.log('Error storing the location', error)
  }
}

const getLocation = () => {
  try {
    return ls.get(location)
  } catch (error) {
    console.log('Error getting the location', error)
  }
}

const setStore = (user) => {
  ls.set('sid', user)
}

const removeStore = async () => {
  ls.remove(store)
  ls.remove('sid')
}

const getStore = () => {
  try {
    return ls.get(store)
  } catch (error) {
    console.log('Error getting the store', error)
  }
}

const getRefreshToken = () => {
  try {
    return ls.get(refreshToken)
  } catch (error) {
    console.log('Error getting the store', error)
  }
}

const _expObject = {
  getToken,
  getUser,
  getLocation,
  remove,
  storeToken,
  storeUser,
  storeLocation,
  setStore,
  getStore,
  removeStore,
  storeRefreshToken,
  getRefreshToken,
}

export default _expObject
