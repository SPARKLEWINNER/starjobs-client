const auth = require('../../controller/auth');
const client = require('../../controller/client');
const default_uri = '/api/internal/v1/clients';

module.exports = function (app) {
    // app.route(`${default_uri}/:id`).get(auth.require_sign_in, client.get_client);
    app.route(`${default_uri}/:id`).post(auth.require_sign_in, client.post_client_details);
    app.route(`${default_uri}/:id`).patch(auth.require_sign_in, client.patch_client_details);
    app.route(`${default_uri}/documents/:id`).patch(auth.require_sign_in, client.patch_client_documents);
    app.route(`${default_uri}/:id`).get(auth.require_sign_in, client.get_client_gigs);
};
