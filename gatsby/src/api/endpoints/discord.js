import request from 'utils/header'
import config from 'utils/config'
const {discord} = config

const send_message = (params) => request.post(`${discord.url}/${discord.key}`, params)

const _expObject = {
  send_message
}
export default _expObject
