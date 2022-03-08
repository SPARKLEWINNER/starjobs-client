const auth = require('../../controller/auth');
const applicant = require('../../controller/applicant');
const default_uri = '/api/internal/v1/applicant';

module.exports = function (app) {
    app.route(`${default_uri}s/:id`).get(auth.require_sign_in, applicant.get_applicants);
    app.route(`${default_uri}/details/:id`).get(auth.require_sign_in, applicant.get_applicant_details);
    app.route(`${default_uri}/list`).get(auth.require_sign_in, applicant.get_freelancer_list);
};
