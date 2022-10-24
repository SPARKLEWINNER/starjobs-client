
const properties = require('../../../package.json');
module.exports = function (app) {
    app.route('/').get(async function (request, response) {
        response.json({
            name: properties.name,
            version: properties.version
        });
    });
};
