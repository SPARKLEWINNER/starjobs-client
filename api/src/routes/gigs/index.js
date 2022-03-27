const rateLimit = require('express-rate-limit');

const auth = require('./../../controller/auth');
const gigs = require('./../../controller/gigs');
const apply = require('./../../controller/apply');
const default_uri = '/api/internal/v1/gigs';

const createAccountLimiter = rateLimit({
    windowMs: 1 * 20 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message: 'Too many request',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

module.exports = function (app) {
    app.route(`${default_uri}`).get(auth.require_sign_in, gigs.get_gigs);
    app.route(`${default_uri}/:id`).get(auth.require_sign_in, gigs.get_gig);
    app.route(`${default_uri}/list/:category`).get(auth.require_sign_in, gigs.get_gigs_categorized);
    app.route(`${default_uri}/history/:id`).get(auth.require_sign_in, gigs.get_gigs_history);
    app.route(`${default_uri}/:id`).post(auth.require_sign_in, gigs.post_gig);

    app.route(`${default_uri}/apply/:id`).patch(createAccountLimiter, auth.require_sign_in, apply.gig_apply);
    app.route(`${default_uri}/edit/:id/:uid`).patch(auth.require_sign_in, gigs.patch_gig_details);
    app.route(`${default_uri}/remove/:id/:uid`).patch(auth.require_sign_in, gigs.patch_remove_gig);

    // admin
    app.route(`${default_uri}/admin/list`).get(auth.require_admin_access, gigs.get_admin_gigs);
    app.route(`${default_uri}/admin/:id`).patch(auth.require_admin_access, gigs.patch_admin_status_gig);
    app.route(`${default_uri}/admin/update/:id`).patch(auth.require_admin_access, gigs.patch_admin_gig_details);
    app.route(`${default_uri}/admin/export`).get(auth.require_admin_access, gigs.get_admin_gigs_exports);
    app.route(`${default_uri}/admin/search`).get(auth.require_admin_access, gigs.get_admin_search_users);
};
