import request from 'src/utils/header'

const patch_subscriber_token = async (user_id, token) => request.patch(`/subscriber/${user_id}`, {deviceId: token})

const exp_object = {
  patch_subscriber_token
}

export default exp_object
