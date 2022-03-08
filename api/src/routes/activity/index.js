const auth = require('./../../controller/auth');
const activity = require('./../../controller/activity');
const default_uri = '/api/internal/v1/activity';

module.exports = function (app) {
    app.route(`${default_uri}/:id`).get(auth.require_sign_in, activity.get_gigs_activity);

    app.route(`${default_uri}/client/:id`).get(auth.require_sign_in, activity.get_gigs_activity_client);
};
