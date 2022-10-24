export const isBrowser = () => typeof window !== 'undefined'

export const getUser = () => {
  isBrowser()
  return window.localStorage.getItem('user') ? window.localStorage.getItem('user') : false
}

export const getStore = () => {
  isBrowser()
  return window.localStorage.getItem('sid') ? window.localStorage.getItem('sid') : false
}

export const setUser = (user) => {
  isBrowser()
  window.localStorage.setItem('user', user)
  window.localStorage.setItem('uid', user._id)
  window.localStorage.setItem('sid', user.sid)
  window.localStorage.setItem('token', user.token)
}

export const getToken = () => {
  isBrowser()
  return window.localStorage.getItem('token') ? window.localStorage.getItem('token') : false
}

export const setStore = (user) => {
  isBrowser()
  window.localStorage.setItem('user', user)
  window.localStorage.setItem('uid', user._id)
  window.localStorage.setItem('token', user.token)
}

export const set_sid = (sid) => {
  isBrowser()
  window.localStorage.setItem('sid', sid)
}

export const remove_store_user = async () => {
  isBrowser()
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('uid')
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('sid')
}

export const remove_user = async () => {
  isBrowser()
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('uid')
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('sid')
}

export const isLoggedIn = () => {
  const user = getUser()
  return !!user.phone || !!user.email
}
