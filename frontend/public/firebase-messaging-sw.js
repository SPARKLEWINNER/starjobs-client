// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");

// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
const firebaseConfig = {
    apiKey: "AIzaSyBSw7t6iuLJ-IbDhCC7XJ6pf02bI7f_kks",
    authDomain: "starjobs-313714.firebaseapp.com",
    projectId: "starjobs-313714",
    storageBucket: "starjobs-313714.appspot.com",
    messagingSenderId: "426778381453",
    appId: "1:426778381453:web:e06c184c8d7469d40a66c4",
    measurementId: "G-G9FHBHVZR4"
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);


// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
    const notificationTitle = `${payload.title}`
    const notificationOptions = {
        body: `${payload.body}`,
        icon: './static/favicon/starjobs.png',
        sound: 'default',
        vibrate: [300, 100, 400, 100, 400, 100, 400],
    }

    // eslint-disable-next-line no-undef
    return self.registration.showNotification(notificationTitle, notificationOptions)
})
