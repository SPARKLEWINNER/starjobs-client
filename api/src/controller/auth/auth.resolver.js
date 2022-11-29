const AuthController = require('./auth.service')
const jwt = require('./jwt.strategy')

const apiVersion = process.env.API_VERSION
const apiPath = process.env.API_PATH

module.exports = function (app) {
  app.route(`${apiPath}${apiVersion}/auth/sign-in`).post(AuthController.sign_in)
  app.route(`${apiPath}${apiVersion}/auth/refresh`).post(AuthController.verify_refresh_token)
  app.route(`${apiPath}${apiVersion}/auth/sign-up`).post(AuthController.sign_up)
  app.route(`${apiPath}${apiVersion}/auth/sign-out`).post(AuthController.sign_out)
  app.route(`${apiPath}${apiVersion}/auth/verify`).post(jwt.require_sign_in, AuthController.verify_code)
  app
    .route(`${apiPath}${apiVersion}/auth/resend-verification`)
    .post(jwt.require_sign_in, AuthController.resend_verification)
  app.route(`${apiPath}${apiVersion}/auth/forgot-password`).post(AuthController.forgot_password)
  app.route(`${apiPath}${apiVersion}/auth/set-password`).post(AuthController.reset_password)
  app.route(`${apiPath}${apiVersion}/auth/social`).post(AuthController.social_sign_in)
  app.route(`${apiPath}${apiVersion}/auth/guest/record`).post(AuthController.survey_guest)
}
