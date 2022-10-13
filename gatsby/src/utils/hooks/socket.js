import io from 'socket.io-client'
import {socketUrl} from 'utils/config'
const socket = () => {
  return io.connect(socketUrl)
}

export default socket
