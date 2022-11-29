const AppModule = require('./app.service')
const AdminGigs = require('./controller/gigs/admin-services/gigs.resolver')
const AppSettings = require('./controller/app-settings/app-settings.resolver')
const Auth = require('./controller/auth/auth.resolver')
const Notifications = require('./controller/notifications/notifications.resolver')
const Gigs = require('./controller/gigs/gigs.resolver')
const Users = require('./controller/users/users.resolver')

module.exports = function (app) {
  AppModule(app)
  Auth(app)
  AppSettings(app)
  Notifications(app)
  Gigs(app)
  Users(app)
  AdminGigs(app)
}
