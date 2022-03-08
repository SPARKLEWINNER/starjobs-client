const auth = require('./../../controller/auth');
const ratings = require('./../../controller/ratings');
const default_uri = '/api/internal/v1/rating';

module.exports = function (app) {
    app.route(`${default_uri}/new/:id`).post(auth.require_sign_in, ratings.post_rating_gig);
};
