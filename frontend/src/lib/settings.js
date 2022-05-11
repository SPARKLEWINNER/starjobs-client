import request from 'src/utils/header'

const force_relog = () => request.get('/settings/relog')

const get_settings = () => request.get('/settings/app')

const exp_object = {
  force_relog,
  get_settings
}

export default exp_object
