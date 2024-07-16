const rateLimit = require('express-rate-limit')

const jwt = require('../auth/jwt.strategy')

const ActivitiesController = require('./child-services/activities.service')
const ApplicantsController = require('./child-services/applicants.service')
const RatingsController = require('./child-services/ratings.service')
const GigApplyController = require('./child-services/gigs-apply.service')
const GigsController = require('./gigs.service')

const AdminGigsController = require('./admin-services/gigs.service')

const apiVersion = process.env.API_VERSION
const apiPath = process.env.API_PATH

const createAccountLimiter = rateLimit({
  windowMs: 1 * 20 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: 'Too many request',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

module.exports = function (app) {
  // ==== Gigs controller ====
  app.route(`${apiPath}${apiVersion}/gigs`).get(jwt.require_sign_in, GigsController.get_gigs)
  app.route(`${apiPath}${apiVersion}/gigs/:id`).get(jwt.require_sign_in, GigsController.get_gig)
  app.route(`${apiPath}${apiVersion}/gigs/contract/:id`).get(jwt.require_sign_in, GigsController.get_contract)
  app.route(`${apiPath}${apiVersion}/gigs/list/:category`).get(jwt.require_sign_in, GigsController.get_gigs_categorized)
  app.route(`${apiPath}${apiVersion}/gigs/history/:id`).get(jwt.require_sign_in, GigsController.get_gigs_history)
  app
    .route(`${apiPath}${apiVersion}/gigs/history/:id/:status`)
    .get(jwt.require_sign_in, GigsController.get_gigs_history_status)

  app.route(`${apiPath}${apiVersion}/gigs/:id`).post(jwt.require_sign_in, GigsController.post_gig)

  app.route(`${apiPath}${apiVersion}/gigs/edit/:id/:uid`).patch(jwt.require_sign_in, GigsController.patch_gig_details)
  app.route(`${apiPath}${apiVersion}/gigs/remove/:id/:uid`).patch(jwt.require_sign_in, GigsController.patch_remove_gig)
  app
    .route(`${apiPath}${apiVersion}/gigs/sales/record/:id`)
    .patch(jwt.require_sign_in, GigsController.patch_record_sale)
  app
    .route(`${apiPath}${apiVersion}/gigs/sales/record/confirm/:id`)
    .patch(jwt.require_sign_in, GigsController.patch_record_confirm_sale)

  // ==== Apply controller ====
  app
    .route(`${apiPath}${apiVersion}/gigs/apply/:id`)
    .patch(createAccountLimiter, jwt.require_sign_in, GigApplyController.gig_apply)

  // ==== Application controller ====
  app.route(`${apiPath}${apiVersion}/applicants/:id`).get(jwt.require_sign_in, ApplicantsController.get_applicants)
  app
    .route(`${apiPath}${apiVersion}/applicant/details/:id`)
    .get(jwt.require_sign_in, ApplicantsController.get_applicant_details)
  app.route(`${apiPath}${apiVersion}/applicant/list`).get(jwt.require_sign_in, ApplicantsController.get_freelancer_list)

  app
    .route(`${apiPath}${apiVersion}/applicant/list/search`)
    .post(jwt.require_sign_in, ApplicantsController.post_freelancer_list_search)

  // ==== Activities controller ====
  app.route(`${apiPath}${apiVersion}/activity/:id`).get(jwt.require_sign_in, ActivitiesController.get_gigs_activity)
  app
    .route(`${apiPath}${apiVersion}/activity/client/:id`)
    .get(jwt.require_sign_in, ActivitiesController.get_gigs_activity_client)
  app
    .route(`${apiPath}${apiVersion}/activity/request/client/:id`)
    .post(jwt.require_sign_in, ActivitiesController.get_request_gigs_activity_client)

  // ==== Ratings controller ====
  app.route(`${apiPath}${apiVersion}/rating/new/:id`).post(jwt.require_sign_in, RatingsController.post_rating_gig)

  // ADMIN
  app.route(`${apiPath}${apiVersion}/gigs/admin/list`).get(jwt.require_admin_access, AdminGigsController.get_admin_gigs)
  app
    .route(`${apiPath}${apiVersion}/gigs/admin/:id`)
    .patch(jwt.require_admin_access, AdminGigsController.patch_admin_status_gig)
  app
    .route(`${apiPath}${apiVersion}/gigs/admin/update/:id`)
    .patch(jwt.require_admin_access, AdminGigsController.patch_admin_gig_details)
  app
    .route(`${apiPath}${apiVersion}/gigs/admin/export`)
    .get(jwt.require_admin_access, AdminGigsController.get_admin_gigs_exports)
  app
    .route(`${apiPath}${apiVersion}/gigs/admin/search`)
    .get(jwt.require_admin_access, AdminGigsController.get_admin_search_users)
}
