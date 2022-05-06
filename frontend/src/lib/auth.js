import request from 'src/utils/header'
import storage from 'src/utils/storage'
const sign_in_email = (form_data) => request.post(`/auth/sign-in`, form_data)

const sign_in_phone = (phone) => request.post('/phone', {phone: phone})

const sign_up_phone = (phone, store_id) => request.post('/phone/signup', {phone: phone, company: store_id})

const verify_phone = (_id, code) => request.post(`/phone/verify/${_id}`, {code})

const google_login = () => request.get('/google')

const facebook_login = () => request.get('/facebook')

const sign_out = () => request.post('/signout')

const post_sign_up = (form_data) => request.post(`/auth/sign-up`, form_data)

const post_resend_verification = (form_data, type) => request.post(`/auth/resend-verification?type=${type}`, form_data)

const post_verify = (form_data) => request.post(`/auth/verify`, form_data)

const post_refresh_access = async () => {
  const current_user = await storage.getUser()
  const refreshToken = await storage.getRefreshToken()
  if (!current_user) return false
  const {_id} = JSON.parse(current_user)

  return await request.post(`/auth/refresh`, {id: _id, refreshToken: refreshToken})
}

const post_forgot_password = (form_data) => request.post('/auth/forgot-password', form_data)

const post_reset_password = (form_data) => request.post('/auth/set-password', form_data)

const _expObject = {
  google_login,
  facebook_login,
  sign_in_email,
  sign_in_phone,
  sign_up_phone,
  verify_phone,
  sign_out,
  post_sign_up,
  post_resend_verification,
  post_verify,
  post_refresh_access,
  post_forgot_password,
  post_reset_password
}
export default _expObject
