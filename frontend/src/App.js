import {useState} from 'react'
// firebase
import {onMessageListener} from './firebase'

// routes
import AppRoute from 'src/routes'
// theme
import ThemeConfig from './theme'
// components
import {GenericNotification} from './components/notifications'
import FirebaseToken from './components/fcm'
import ScrollToTop from './components/ScrollToTop'
import NotistackProvider from './components/NotistackProvider'
import ThemePrimaryColor from './components/ThemePrimaryColor'

import TawktoPageOverlay from 'src/layouts/tawkto/tawkto_page_overlay'

import {RatingsProvider} from 'src/contexts/rating'
import {AuthProvider} from 'src/contexts/AuthContext'
import {SessionProvider} from 'src/contexts/SessionContext'

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
          </SessionProvider>
        </AuthProvider>
      </ThemePrimaryColor>
    </ThemeConfig>
  )
}
