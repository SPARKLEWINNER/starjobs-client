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
import ThemeLocalization from './components/ThemeLocalization'
import {MainProvider} from './utils/context/main'
import {UsersProvider} from './utils/context/users'
import {PusherProvider} from './utils/context/pusher'
// import {SocketProvider} from './utils/context/socket'
import {RatingsProvider} from './utils/context/rating'

import TawktoPageOverlay from 'layouts/tawkto/tawkto_page_overlay'

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
        <ThemeLocalization>
          <MainProvider>
            <UsersProvider>
              {/* <SocketProvider> */}
              <PusherProvider>
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
              </PusherProvider>
              {/* </SocketProvider> */}
            </UsersProvider>
          </MainProvider>
        </ThemeLocalization>
      </ThemePrimaryColor>
    </ThemeConfig>
  )
}
