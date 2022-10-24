import dayjs from 'dayjs'

const prefix = 'cache'
const expiryInMinutes = 5

const store = (key, value) => {
  try {
    const item = {
      value,
      timestamp: Date.now()
    }
    window.localStorage.setItem(prefix + key, JSON.stringify(item))
  } catch (error) {
    console.log(error)
  }
}

const isExpired = (item) => {
  const now = dayjs()
  const storedTime = dayjs(item.timestamp)
  return now.diff(storedTime, 'minute') > expiryInMinutes
}

const get = (key) => {
  try {
    const value = window.localStorage.getItem(prefix + key)
    const item = JSON.parse(value)

    if (!item) return null

    if (isExpired(item)) {
      // Command Query Separation (CQS)
      window.localStorage.removeItem(prefix + key)
      return null
    }

    return item.value
  } catch (error) {
    console.log(error)
  }
}

const _expObject = {
  store,
  get
}
export default _expObject
