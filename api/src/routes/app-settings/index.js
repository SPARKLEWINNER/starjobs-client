const auth = require('../../controller/auth');
const appSettings = require('../../controller/app-settings');
const default_uri = '/api/internal/v1/settings';

module.exports = function (app) {
    app.route(`${default_uri}/app`).get(appSettings.get_app_settings);
};
