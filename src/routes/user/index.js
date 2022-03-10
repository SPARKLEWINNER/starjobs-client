const auth = require('./../../controller/auth');
const user = require('./../../controller/user');
const default_uri = '/api/internal/v1/user';

module.exports = function (app) {
    app.route(`${default_uri}`).get(auth.require_sign_in, user.get_user);
    app.route(`${default_uri}/change/:id`).patch(auth.require_sign_in, user.patch_change_password);

    app.route(`${default_uri}/list`).get(auth.require_admin_access, user.get_users);
    app.route(`${default_uri}/search`).get(auth.require_admin_access, user.get_search_users);
    app.route(`${default_uri}/export`).get(auth.require_admin_access, user.get_user_exports);
    app.route(`${default_uri}/:id/:type`).get(auth.require_admin_access, user.get_users_specific);
};
