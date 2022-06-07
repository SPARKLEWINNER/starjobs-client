const auth = require('../../controller/auth');
const notification = require('../../controller/notification');
const default_uri = '/api/internal/v1/notifications';

module.exports = function (app) {
    app.route(`${default_uri}`).get(auth.require_sign_in, notification.get_notifications_v2);
    app.route(`${default_uri}/area`).get(auth.require_sign_in, notification.get_area_notification);
    app.route(`${default_uri}/client/:id`).get(auth.require_sign_in, notification.get_notifications_clients);
    app.route(`${default_uri}/details/:id`).get(auth.require_sign_in, notification.get_notification_details);
    app.route(`${default_uri}/:id`).patch(auth.require_sign_in, notification.patch_notification);
    app.route(`${default_uri}/:id`).post(auth.require_sign_in, notification.post_notification_v2);
    app.route(`${default_uri}/:notificationId/:userId`).put(
        auth.require_sign_in,
        notification.put_notification_addviewer
    );
};
