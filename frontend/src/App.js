import {useState, useEffect} from 'react'
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

import {useServiceWorker} from './useServiceWorker'

import {Snackbar, Button} from '@material-ui/core'

export default function App() {
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState([])
  const {waitingWorker, showReload, reloadPage} = useServiceWorker()

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

  useEffect(() => {
    if (showReload && waitingWorker) {
      return (
        <Snackbar
          open={showReload}
          message="A new version is available!"
          onClick={reloadPage}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          action={
            <Button color="inherit" size="small" onClick={reloadPage}>
              Reload
            </Button>
          }
        />
      )
    }
  }, [waitingWorker, showReload, reloadPage])

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
