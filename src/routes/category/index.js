const auth = require('./../../controller/auth');
const category = require('./../../controller/category');
const default_uri = '/api/internal/v1/category';

module.exports = function (app) {
    app.route(`${default_uri}/:id`).get(auth.require_sign_in, category.get_category);
    app.route(`${default_uri}`).get(auth.require_sign_in, category.get_categories);
};
