import request from 'src/utils/header'
import storage from 'src/utils/storage'
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Manila')

// const get_users = (_type) =>
//   request
//     .get('/users')
//     .then((users) => {
//       let newUser = []
//       if (!users.data) return newUser

//       users.data.map((v, k) => {
//         if (v.role !== _type) return ''
//         if (v.firstName === null || v.lastName === null) return ''
//         return newUser.push({...v})
//       })

//       return {
//         ok: true,
//         data: newUser,
//       }
//     })
//     .catch((err) => {
//       return {ok: false, data: err}
//     })

const get_user = (_id) => request.get(`/user`)

const get_users = (_id) => request.get(`/store/users/${_id}`)

const get_users_archived = (_id) => request.get(`/store/users/archive/${_id}`)

const post_store_register = (_data) => request.post(`/store/register`, _data)

const post_employee_register = (_data) => request.post(`/employee/register`, _data)

const patch_store_onboard = (_data, _id) => request.patch(`/user/store/${_id}`, _data)

const get_user_status = (_id) => request.get(`/user/status/${_id}`)

const post_user_status = (_status, _location, _id) => {
  const date = dayjs().tz('Asia/Manila').utc().format()
  return request.post(`/user/time/${_id}`, {status: _status, location: _location, logdate: date})
}

const patch_user_onboard = (_data, _id) => request.patch(`/user/${_id}`, _data)

const get_user_records = (_id) => request.get(`/user/records/${_id}`)

const get_user_profile = async () => {
  const current_user = await storage.getUser()
  if (!current_user) return false
  const {_id, email} = JSON.parse(current_user)
  return request.get(`/accounts/${_id}`).then((result) => {
    return {ok: true, data: {...result.data[0], email: email}}
  })
}

const get_user_profile_client = async (client_id) => request.get(`/clients/${client_id}`)

const get_user_profile_freelancer = async (freelancer_id) => request.get(`/applicant/details/${freelancer_id}`)

const get_user_notifications = async (_id) => request.get(`/notifications/${_id}`)

const get_user_notifications_client = async (_id) => request.get(`/notifications/${_id}`)

const get_user_notifications_details = async (_id) => request.get(`/notifications/details/${_id}`)

const patch_user_notification_read = async (_id, uid) =>
  request.patch(`/notifications/${_id}`, {uid: uid, isRead: true})

const put_user_notification_read = async (_id, notifId) => request.put(`/notifications/${notifId}/${_id}`)

const patch_user_password = async (_id, form_data) => request.patch(`/user/change/${_id}`, form_data)

const get_user_list = () => request.get(`/applicant/list`)

const get_user_activity = async (_id) => request.get(`/activity/${_id}`)

const get_user_activity_client = async (_id) => request.get(`/activity/client/${_id}`)

const _expObject = {
  get_user,
  get_users,
  get_users_archived,
  post_store_register,
  post_employee_register,
  patch_store_onboard,
  get_user_status,
  post_user_status,
  patch_user_onboard,
  get_user_list,
  get_user_records,
  get_user_profile,
  get_user_profile_client,
  get_user_profile_freelancer,
  get_user_notifications,
  get_user_notifications_details,
  get_user_notifications_client,
  patch_user_notification_read,
  put_user_notification_read,
  patch_user_password,
  get_user_activity,
  get_user_activity_client
}

export default _expObject
