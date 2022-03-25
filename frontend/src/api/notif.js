import request from 'utils/header'

/**
 * @param {string} userId - The id of the user creating the notif
 * @param {string} data - The body of the post request
 */
const create_notification = (userId, data) => request.post(`/notifications/${userId}`, data)

const exp_object = {
  create_notification,
}

export default exp_object
