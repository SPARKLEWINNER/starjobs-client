import firebase from 'firebase/app'
import 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyBSw7t6iuLJ-IbDhCC7XJ6pf02bI7f_kks',
  authDomain: 'starjobs-313714.firebaseapp.com',
  projectId: 'starjobs-313714',
  storageBucket: 'starjobs-313714.appspot.com',
  messagingSenderId: '426778381453',
  appId: '1:426778381453:web:e06c184c8d7469d40a66c4',
  measurementId: 'G-G9FHBHVZR4'
}

let getToken
let onMessageListener
if (firebase.messaging.isSupported()) {
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  } else {
    firebase.app() // if already initialized, use that one
  }

  const messaging = firebase.messaging()

  const {REACT_APP_VAPID_KEY} = process.env
  const publicKey = REACT_APP_VAPID_KEY

  getToken = async (setTokenFound) => {
    let currentToken = ''
    if (!firebase.messaging.isSupported()) return false
    try {
      currentToken = await messaging.getToken({vapidKey: publicKey})
      if (currentToken) {
        setTokenFound(true)
      } else {
        setTokenFound(false)
      }
    } catch (error) {
      console.log('An error occurred while retrieving token. ', error)
    }

    return currentToken
  }

  onMessageListener = () =>
    new Promise((resolve) => {
      messaging.onMessage((payload) => {
        if (!firebase.messaging.isSupported()) return false
        resolve(payload)
      })
    })
}

export {getToken, onMessageListener}
