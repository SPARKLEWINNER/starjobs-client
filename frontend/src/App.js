import {useEffect, useState} from 'react'
import ReactPwa from 'react-pwa-app'
import {Box} from '@mui/material'

// firebase
import {onMessageListener} from './firebase'

// routes
import AppRoute from 'src/routes'
// theme
import ThemeConfig from './theme'
// components
import {GenericNotification} from './components/notifications'
import NotistackProvider from './components/NotistackProvider'
import ThemePrimaryColor from './components/ThemePrimaryColor'

import TawktoPageOverlay from 'src/layouts/tawkto/tawkto_page_overlay'

import {AuthProvider} from 'src/contexts/AuthContext'
import {SessionProvider} from 'src/contexts/SessionContext'
import {NotificationsProvider} from 'src/contexts/NotificationContext'
import {RatingsProvider} from 'src/contexts/rating'

import LoadingScreen from 'src/components/LoadingScreen'
import InstallPWA from 'src/components/pwa/install'

export default function App() {
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
    <ReactPwa
      test //is to install in localhost, not required
      suspense={
        <Box sx={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <LoadingScreen />
        </Box>
      }
      config={{
        swUrl: '/service-worker.js' // sw file in public default is service-worker.js
      }}
    >
      <ThemeConfig>
        <ThemePrimaryColor>
          <AuthProvider>
            <SessionProvider>
              <NotificationsProvider>
                <NotistackProvider>
                  <RatingsProvider>
                    <TawktoPageOverlay>
                      <AppRoute />
                      <GenericNotification open={open ?? false} details={payload} handleClose={handleClose} />
                      <InstallPWA />
                    </TawktoPageOverlay>
                  </RatingsProvider>
                </NotistackProvider>
              </NotificationsProvider>
            </SessionProvider>
          </AuthProvider>
        </ThemePrimaryColor>
      </ThemeConfig>
    </ReactPwa>
  )
}
