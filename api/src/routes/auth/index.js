const auth = require('./../../controller/auth');
const default_uri = '/api/internal/v1/auth';

module.exports = function (app) {
    app.route(`${default_uri}/sign-in`).post(auth.sign_in);
    app.route(`${default_uri}/refresh`).post(auth.verify_refresh_token);
    app.route(`${default_uri}/sign-up`).post(auth.sign_up);
    app.route(`${default_uri}/sign-out`).post(auth.sign_out);
    app.route(`${default_uri}/verify`).post(auth.require_sign_in, auth.verify_code);
    app.route(`${default_uri}/resend-verification`).post(auth.require_sign_in, auth.resend_verification);
    app.route(`${default_uri}/forgot-password`).post(auth.forgot_password);
    app.route(`${default_uri}/set-password`).post(auth.reset_password);
};
