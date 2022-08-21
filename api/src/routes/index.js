const Initial = require('./default');
const Auth = require('./auth');
const FCM = require('./fcm');
const User = require('./user');
const Category = require('./category');
const Gigs = require('./gigs');
const Account = require('./account');
const Upload = require('./upload');
const Client = require('./client');
const Applicant = require('./applicant');
const Notifications = require('./notifications');
const Ratings = require('./ratings');
const Activity = require('./activity');
const Logger = require('./logger');
const AppSettings = require('./app-settings');
const Onboard = require('./onboard');

module.exports = function (app) {
    Initial(app);
    Auth(app);
    FCM(app);
    User(app);
    Category(app);
    Gigs(app);
    Account(app);
    Upload(app);
    Client(app);
    Applicant(app);
    Notifications(app);
    Ratings(app);
    Activity(app);
    Logger(app);
    AppSettings(app);
    Onboard(app)
};
