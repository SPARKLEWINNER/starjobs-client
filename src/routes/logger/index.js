const auth = require('../../controller/auth');
const logs = require('./../../controller/logger');
const default_uri = '/api/internal/v1/logs';

module.exports = function (app) {
    app.route(`${default_uri}/list`).get(auth.require_admin_access, logs.get_logs);
};
