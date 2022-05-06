const SecureLS = require('secure-ls')
const ls = new SecureLS({encodingType: 'aes'})
export const isBrowser = () => typeof window !== 'undefined'

export const getUser = () => {
  isBrowser()
  return ls.get('user') ? ls.get('user') : false
}

export const getStore = () => {
  isBrowser()
  return ls.get('sid') ? ls.get('sid') : false
}

export const setUser = (user) => {
  isBrowser()
  ls.set('user', user)
  ls.set('uid', user._id)
  ls.set('sid', user.sid)
  ls.set('token', user.token)
}

export const getToken = () => {
  isBrowser()
  return ls.get('token') ? ls.get('token') : false
}

export const setStore = (user) => {
  isBrowser()
  ls.set('user', user)
  ls.set('uid', user._id)
  ls.set('token', user.token)
}

export const set_sid = (sid) => {
  isBrowser()
  ls.set('sid', sid)
}

export const remove_store_user = async () => {
  isBrowser()
  ls.remove('user')
  ls.remove('uid')
  ls.remove('token')
  ls.remove('sid')
}

export const remove_user = async () => {
  isBrowser()
  ls.remove('user')
  ls.remove('uid')
  ls.remove('token')
  ls.remove('sid')
}

export const isLoggedIn = () => {
  const user = getUser()
  return !!user.phone || !!user.email
}
