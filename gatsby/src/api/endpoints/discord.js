import request from 'utils/header'
const {REACT_APP_DISCORD_URL, REACT_APP_DISCORD_KEY} = process.env

const send_message = (params) => request.post(`${REACT_APP_DISCORD_URL}/${REACT_APP_DISCORD_KEY}`, params)

const _expObject = {
  send_message
}
export default _expObject
