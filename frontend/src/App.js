import {useEffect, useState} from 'react'

// firebase
import {onMessageListener} from './firebase'

// routes
import AppRoute from 'src/routes'
// theme
import ThemeConfig from './theme'
// components
import {GenericNotification} from './components/notifications'
import FirebaseToken from './components/fcm'
import NotistackProvider from './components/NotistackProvider'
import ThemePrimaryColor from './components/ThemePrimaryColor'

import TawktoPageOverlay from 'src/layouts/tawkto/tawkto_page_overlay'

import {AuthProvider} from 'src/contexts/AuthContext'
import {SessionProvider} from 'src/contexts/SessionContext'
import {NotificationsProvider} from 'src/contexts/NotificationContext'
import {RatingsProvider} from 'src/contexts/rating'

import {useServiceWorker} from './pwa/pwa-context'

export default function App() {
  const {isUpdateAvailable, updateAssets} = useServiceWorker()
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState([])

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const load = () => {
      if (onMessageListener !== undefined) {
        onMessageListener()
          .then((payload) => {
            setPayload(payload)
            setOpen(true)
          })
          .catch((err) => console.log('failed: ', err))
      }
    }

    load()
  }, [])
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <AuthProvider>
          <SessionProvider>
            <NotificationsProvider>
              <NotistackProvider>
                <RatingsProvider>
                  <TawktoPageOverlay>
                    <AppRoute />
                    <FirebaseToken />
                    <GenericNotification open={open ?? false} details={payload} handleClose={handleClose} />
                  </TawktoPageOverlay>
                </RatingsProvider>
              </NotistackProvider>
            </NotificationsProvider>
          </SessionProvider>
        </AuthProvider>
        {isUpdateAvailable && (
          <div>
            A new version of this app is available!
            <button type="button" onClick={updateAssets}>
              Update now
            </button>
          </div>
        )}
      </ThemePrimaryColor>
    </ThemeConfig>
  )
}
