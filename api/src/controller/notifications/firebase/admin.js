const admin = require('firebase-admin');
// const serviceAccount = require('./config/private-key.json');
require('dotenv').config()

admin.initializeApp({
    credential: admin.credential.cert({
     type: process.env.TYPE,
     project_id: process.env.PROJECTID,
     private_key_id: process.env.PRIVATEKEYID,
     private_key: process.env.PRIVATEKEY.replace(/\\n/g, '\n'),
     client_email: process.env.CLIENTEMAIL,
     client_id: process.env.CLIENTID,
     auth_uri: process.env.AUTHURI,   
     token_uri: process.env.TOKENURI,
     auth_provider_x509_cert_url: process.env.AUTHPROVIDER,
     client_x509_cert_url: process.env.CLIENTCERTURL,
     universe_domain: process.env.UNIVERSEDOMAIN
    }),
    databaseURL: "https://test-database-b93e0.asia-east1.firebaseio.com"
});
const firestore = admin.firestore();
const messaging = admin.messaging();

module.exports = { firestore, messaging };