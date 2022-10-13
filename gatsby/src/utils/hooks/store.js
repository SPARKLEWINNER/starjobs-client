const SecureLS = require('secure-ls')
const ls = new SecureLS({encodingType: 'aes'})

export const isBrowser = () => typeof window !== 'undefined'

export const getStore = () => {
  isBrowser()
  return ls.get('store') ? ls.get('store') : {}
}

export const setStore = async (user) => {
  isBrowser()
  await ls.set('store', user)
  await ls.set('sid', user._id)
}

export const removeStore = async () => {
  isBrowser()
  await ls.remove('store')
  await ls.remove('sid')
}
