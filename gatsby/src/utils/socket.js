import io from 'socket.io-client'
import storage from './storage'
import config from 'utils/config'
const {socketUrl} = config
const _socket = () => {
  return io.connect(socketUrl, {
    secure: true,
    rejectUnauthorized: false
  })
}

const connect = async () => {
  const user = await storage.getUser()
  if (!user) return
  return _socket().emit('connected', {...user})
}

const employee_connect = async (data) => {
  if (!data) return
  return _socket().emit('e-connected', {...data})
}

const employee_action = async (data) => {
  if (!data) return
  return _socket().emit('e-action', {...data})
}

const employee_disconnect = () => {
  return _socket().on('employee exit', (data) => {
    return data
  })
}

const store__employee_connect = async () => {
  const user = await storage.getUser()
  if (!user) return
  _socket().on(`e-connected`, (data) => {
    return data
  })
}

const _expObject = {
  _socket,
  connect,
  employee_connect,
  employee_disconnect,
  store__employee_connect,
  employee_action
}
export default _expObject
