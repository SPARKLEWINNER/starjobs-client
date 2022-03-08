const auth = require('./../../controller/auth');
const upload = require('./../../controller/upload');
const default_uri = '/api/internal/v1/upload';

module.exports = function (app) {
    app.route(`${default_uri}`).get(auth.require_sign_in, upload.create_url);
};
