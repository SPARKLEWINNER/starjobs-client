const admin= require('firebase-admin');
const serviceAccount = require('./config/private-key.json');
require('dotenv').config()

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://test-database-b93e0.asia-east1.firebaseio.com"
});
const firestore = admin.firestore();
const messaging = admin.messaging();

module.exports = { firestore, messaging};