import request from 'utils/header'
const get_categories = () => request.get('/category')

const get_notification_area = () => request.get('/notifications/area')

const exp_object = {
  get_categories,
  get_notification_area
}

export default exp_object
