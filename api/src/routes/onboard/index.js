const auth = require('../../controller/auth');
const onboard = require('../../controller/onboard');
const default_uri = '/api/internal/v1/onboard';

module.exports = function (app) {
    app.route(`${default_uri}/jobster/:id`).post(auth.require_sign_in, onboard.update_jobster_profile);
};
