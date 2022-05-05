import {useState} from 'react'
// firebase
import {onMessageListener} from './firebase'

// routes
import AppRoute from './routes'
// theme
import ThemeConfig from './theme'
// components
import {GenericNotification} from './components/notifications'
import FirebaseToken from './components/fcm'
import ScrollToTop from './components/ScrollToTop'
import NotistackProvider from './components/NotistackProvider'
import ThemePrimaryColor from './components/ThemePrimaryColor'
import {RatingsProvider} from './utils/context/rating'

import TawktoPageOverlay from 'layouts/tawkto/tawkto_page_overlay'

import {AuthProvider} from 'utils/context/AuthContext'
import {SessionProvider} from 'utils/context/SessionContext'
import {NotificationsProvider} from 'utils/context/NotificationContext'

export default function App() {
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState([])

  const handleClose = () => {
    setOpen(false)
  }

  if (onMessageListener !== undefined) {
    onMessageListener()
      .then((payload) => {
        setPayload(payload)
        setOpen(true)
      })
      .catch((err) => console.log('failed: ', err))
  }

  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <AuthProvider>
          <SessionProvider>
            <NotificationsProvider>
            <NotistackProvider>
              <RatingsProvider>
                <TawktoPageOverlay>
                  <ScrollToTop />
                  <AppRoute />
                  <FirebaseToken />
                  <GenericNotification open={open} details={payload} handleClose={handleClose} />
                </TawktoPageOverlay>
              </RatingsProvider>
            </NotistackProvider>
            </NotificationsProvider>
          </SessionProvider>
        </AuthProvider>
      </ThemePrimaryColor>
    </ThemeConfig>
  )
}
