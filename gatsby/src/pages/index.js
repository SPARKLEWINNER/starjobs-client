import React, {useEffect, useState} from 'react'

// highlight
import 'utils/highlight'

// // scroll bar
// import 'simplebar/src/simplebar.css'

// // lightbox
// import 'react-image-lightbox/style.css'

// import 'react-quill/dist/quill.snow.css'

// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'

// // alice carousel
// import 'react-alice-carousel/lib/alice-carousel.css'

// import 'style.css'

// import 'react-datepicker/dist/react-datepicker.css'

import {SettingsProvider} from 'contexts/SettingsContext'
import {CollapseDrawerProvider} from 'contexts/DrawerContext'

// routes
// import AppRoute from 'src/routes'

// theme
import ThemeConfig from 'theme/themeConfig'
// components
import {GenericNotification} from 'components/notifications'
import Logo from 'components/Logo'
import NotistackProvider from 'components/NotistackProvider'
import ThemePrimaryColor from 'components/ThemePrimaryColor'

import {AuthProvider} from 'contexts/AuthContext'
import {SessionProvider} from 'contexts/SessionContext'
import {NotificationsProvider} from 'contexts/NotificationContext'
import {RatingsProvider} from 'contexts/RatingContext'

const SplashScreen = () => {
  return <Logo />
}

const Application = () => {
  return (
    <SettingsProvider>
      <CollapseDrawerProvider>
        <ThemeConfig>
          <ThemePrimaryColor>
            <AuthProvider>
              <SessionProvider>
                <NotificationsProvider>
                  <NotistackProvider>
                    <RatingsProvider>
                      {/* <AppRoute /> */}
                      <GenericNotification />
                    </RatingsProvider>
                  </NotistackProvider>
                </NotificationsProvider>
              </SessionProvider>
            </AuthProvider>
          </ThemePrimaryColor>
        </ThemeConfig>
      </CollapseDrawerProvider>
    </SettingsProvider>
  )
}

const App = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    if (mounted)
      setTimeout(() => {
        setLoaded(true)
      }, 2000)

    return () => {
      mounted = false
    }
  }, [])

  return <>{loaded ? <Application /> : <SplashScreen />}</>
}

export default App
