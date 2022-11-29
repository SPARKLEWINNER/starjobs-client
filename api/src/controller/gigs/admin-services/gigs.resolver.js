const jwt = require('../../auth/jwt.strategy')

const GigsController = require('./gigs.service')

const apiVersion = process.env.API_VERSION
const apiPath = process.env.API_PATH

module.exports = function (app) {
  app.route(`${apiPath}${apiVersion}/gigs/admin/list`).get(jwt.require_admin_access, GigsController.get_admin_gigs)
  app
    .route(`${apiPath}${apiVersion}/gigs/admin/:id`)
    .patch(jwt.require_admin_access, GigsController.patch_admin_status_gig)
  app
    .route(`${apiPath}${apiVersion}/gigs/admin/update/:id`)
    .patch(jwt.require_admin_access, GigsController.patch_admin_gig_details)
  app
    .route(`${apiPath}${apiVersion}/gigs/admin/export`)
    .get(jwt.require_admin_access, GigsController.get_admin_gigs_exports)
  app
    .route(`${apiPath}${apiVersion}/gigs/admin/search`)
    .get(jwt.require_admin_access, GigsController.get_admin_search_users)
}
