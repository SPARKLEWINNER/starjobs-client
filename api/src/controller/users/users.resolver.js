const jwt = require('../auth/jwt.strategy')
const ClientsController = require('./child-services/clients.service')
const FreelancersController = require('./child-services/freelancers.service')
const FCMController = require('./child-services/fcm.service')
const OnboardController = require('./child-services/onboard.service')
const UsersController = require('./users.service')
const UserDevicesController = require('./child-services/users-device.service')
const UploadController = require('./child-services/upload.service')

const apiVersion = process.env.API_VERSION
const apiPath = process.env.API_PATH

module.exports = function (app) {
  // ==== Users controller ====
  app.route(`${apiPath}${apiVersion}/user`).get(jwt.require_sign_in, UsersController.get_user)
  app.route(`${apiPath}${apiVersion}/user/change/:id`).patch(jwt.require_sign_in, UsersController.patch_change_password)

  app.route(`${apiPath}${apiVersion}/user/notifications/read/all`).patch(jwt.require_sign_in, UsersController.patch_read_all_notification)

  app.route(`${apiPath}${apiVersion}/user/devices`).get(jwt.require_sign_in, UserDevicesController.get_user_device)
  app.route(`${apiPath}${apiVersion}/user/devices`).patch(jwt.require_sign_in, UserDevicesController.patch_device_id)

  app.route(`${apiPath}${apiVersion}/user/account`).patch(jwt.require_sign_in, UsersController.patch_user_token)

  app.route(`${apiPath}${apiVersion}/user/list`).get(jwt.require_admin_access, UsersController.get_users)
  app.route(`${apiPath}${apiVersion}/user/search`).get(jwt.require_admin_access, UsersController.get_search_users)
  app.route(`${apiPath}${apiVersion}/user/export`).get(jwt.require_admin_access, UsersController.get_user_exports)
  app.route(`${apiPath}${apiVersion}/user/:id/:type`).get(jwt.require_admin_access, UsersController.get_users_specific)

  app.route(`${apiPath}${apiVersion}/user/update/account`).patch(jwt.require_sign_in, UsersController.patch_user)

  // ==== Freelancer controller ====
  app.route(`${apiPath}${apiVersion}/accounts/:id`).get(jwt.require_sign_in, FreelancersController.get_account_details)
  app
    .route(`${apiPath}${apiVersion}/accounts/:id`)
    .post(jwt.require_sign_in, FreelancersController.post_account_details)
  app
    .route(`${apiPath}${apiVersion}/accounts/:id`)
    .patch(jwt.require_sign_in, FreelancersController.patch_account_details)

  // ==== Clients controller ====
  app.route(`${apiPath}${apiVersion}/clients/:id`).post(jwt.require_sign_in, ClientsController.post_client_details)
  app.route(`${apiPath}${apiVersion}/clients/:id`).patch(jwt.require_sign_in, ClientsController.patch_client_details)
  app
    .route(`${apiPath}${apiVersion}/clients/documents/:id`)
    .patch(jwt.require_sign_in, ClientsController.patch_client_documents)
  app.route(`${apiPath}${apiVersion}/clients/:id`).get(jwt.require_sign_in, ClientsController.get_client_gigs)
  app
    .route(`${apiPath}${apiVersion}/clients/edit/:id`)
    .get(jwt.require_sign_in, ClientsController.get_client_edit_profile)

  // ==== FCM controller ====
  app.route(`${apiPath}${apiVersion}/subscriber/:id`).get(FCMController.get_token)
  app.route(`${apiPath}${apiVersion}/subscriber/:id`).patch(jwt.require_sign_in, FCMController.patch_token)

  // ==== Upload controller ====
  app.route(`${apiPath}${apiVersion}/upload`).get(jwt.require_sign_in, UploadController.create_url)

  // ==== Onboard controller ====
  app
    .route(`${apiPath}${apiVersion}/onboard/jobster/:id`)
    .post(jwt.require_sign_in, OnboardController.update_jobster_profile)
  app
    .route(`${apiPath}${apiVersion}/onboard/client/:id`)
    .post(jwt.require_sign_in, OnboardController.update_client_profile)
}
