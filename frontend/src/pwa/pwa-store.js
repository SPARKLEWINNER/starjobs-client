import {createStore} from 'redux'

import rootReducer from './pwa-reducers'

function configureStore() {
  return createStore(rootReducer, {
    serviceWorkerInitialized: false,
    serviceWorkerUpdated: false,
    serviceWorkerRegistration: null
  })
}

export default configureStore
