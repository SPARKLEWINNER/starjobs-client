import {useState, useEffect, useMemo, useContext, createContext} from 'react'
import * as serviceWorker from './../serviceWorkerRegistration'
import PropTypes from 'prop-types'
const ServiceWorkerContext = createContext()

ServiceWorkerProvider.propTypes = {
  children: PropTypes.node
}

export const ServiceWorkerProvider = ({children}) => {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null)
  const [isUpdateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    serviceWorker.register({
      onUpdate: (registration) => {
        setWaitingServiceWorker(registration.waiting)
        setUpdateAvailable(true)
      },
      onWaiting: (waiting) => {
        setWaitingServiceWorker(waiting)
        setUpdateAvailable(true)
      }
    })
  }, [])

  useEffect(() => {
    // We setup an event listener to automatically reload the page
    // after the Service Worker has been updated, this will trigger
    // on all the open tabs of our application, so that we don't leave
    // any tab in an incosistent state
    waitingServiceWorker &&
      waitingServiceWorker.addEventListener('statechange', (event) => {
        if (event.target.state === 'activated') {
          window.location.reload()
        }
      })
  }, [waitingServiceWorker])

  const value = useMemo(
    () => ({
      isUpdateAvailable,
      updateAssets: () => {
        if (waitingServiceWorker) {
          // We send the SKIP_WAITING message to tell the Service Worker
          // to update its cache and flush the old one
          waitingServiceWorker.postMessage({type: 'SKIP_WAITING'})
        }
      }
    }),
    [isUpdateAvailable, waitingServiceWorker]
  )

  return <ServiceWorkerContext.Provider value={value}>{children}</ServiceWorkerContext.Provider>
}

// With this React Hook we'll be able to access `isUpdateAvailable` and `updateAssets`
export const useServiceWorker = () => {
  return useContext(ServiceWorkerContext)
}
