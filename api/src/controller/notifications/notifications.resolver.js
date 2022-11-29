const jwt = require('../auth/jwt.strategy')
const notification = require('./notifications.service')

const apiVersion = process.env.API_VERSION
const apiPath = process.env.API_PATH

module.exports = function (app) {
  app.route(`${apiPath}${apiVersion}/notifications`).get(jwt.require_sign_in, notification.get_notifications_v2)
  app.route(`${apiPath}${apiVersion}/notifications/area`).get(jwt.require_sign_in, notification.get_area_notification)
  app
    .route(`${apiPath}${apiVersion}/notifications/client/:id`)
    .get(jwt.require_sign_in, notification.get_notifications_clients)
  app
    .route(`${apiPath}${apiVersion}/notifications/details/:id`)
    .get(jwt.require_sign_in, notification.get_notification_details)
  app.route(`${apiPath}${apiVersion}/notifications/:id`).patch(jwt.require_sign_in, notification.patch_notification)
  app.route(`${apiPath}${apiVersion}/notifications/:id`).post(jwt.require_sign_in, notification.post_notification_v2)
  app
    .route(`${apiPath}${apiVersion}/notifications/:notificationId/:userId`)
    .put(jwt.require_sign_in, notification.put_notification_addviewer)
}
