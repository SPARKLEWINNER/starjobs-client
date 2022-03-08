const auth = require('./../../controller/auth');
const fcm = require('./../../controller/fcm');
const default_uri = '/api/internal/v1/subscriber';

module.exports = function (app) {
    app.route(`${default_uri}/:id`).get(fcm.get_token);
    app.route(`${default_uri}/:id`).patch(auth.require_sign_in, fcm.patch_token);
};
