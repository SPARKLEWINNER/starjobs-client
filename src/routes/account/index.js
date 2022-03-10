const auth = require('../../controller/auth');
const account = require('../../controller/account');
const default_uri = '/api/internal/v1/accounts';

module.exports = function (app) {
    app.route(`${default_uri}/:id`).get(auth.require_sign_in, account.get_account_details);
    app.route(`${default_uri}/:id`).post(auth.require_sign_in, account.post_account_details);
    app.route(`${default_uri}/:id`).patch(auth.require_sign_in, account.patch_account_details);
};
