const jwt = require('../auth/jwt.strategy')
const AppSettingsController = require('./app-settings.service')

const apiVersion = process.env.API_VERSION
const apiPath = process.env.API_PATH

module.exports = function (app) {
  // Settings
  app.route(`${apiPath}${apiVersion}/settings/app`).get(AppSettingsController.get_app_settings)

  // Categories
  app.route(`${apiPath}${apiVersion}/category/:id`).get(jwt.require_sign_in, AppSettingsController.get_category)
  app.route(`${apiPath}${apiVersion}/category`).get(jwt.require_sign_in, AppSettingsController.get_categories)

  // Logs
  app.route(`${apiPath}${apiVersion}/logs/list`).get(jwt.require_admin_access, AppSettingsController.get_logs)
}
