import React, {useEffect, useState} from 'react'
import {Box} from '@mui/material'
import {Router, Location} from '@reach/router'

import 'utils/highlight'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

import {SettingsProvider} from 'contexts/SettingsContext'
import {CollapseDrawerProvider} from 'contexts/DrawerContext'

// routes
// import AppRoute from 'src/routes'

// theme
import ThemeConfig from 'theme/themeConfig'
// components
import Logo from 'components/Logo'
import {GenericNotification} from 'components/notifications'
import NotistackProvider from 'components/NotistackProvider'
import ThemePrimaryColor from 'components/ThemePrimaryColor'

import {AuthProvider} from 'contexts/AuthContext'
import {SessionProvider} from 'contexts/SessionContext'
import {NotificationsProvider} from 'contexts/NotificationContext'
import {RatingsProvider} from 'contexts/RatingContext'

// screens
import LoginPage from 'screens/Login'
import DashboardPage from 'screens/Dashboard'

import JobsterHome from 'screens/jobster/home'
import ForgotPassword from 'screens/ForgotPassword'
import ResetPassword from 'screens/ResetPassword'

const SplashScreen = () => {
  return (
    <Box sx={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Logo />
    </Box>
  )
}

const Application = () => {
  return (
    <SettingsProvider>
      <CollapseDrawerProvider>
        <ThemeConfig>
          <ThemePrimaryColor>
            <Location>
              {({location}) => (
                <TransitionGroup className="transition-group">
                  <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <AuthProvider>
                      <SessionProvider>
                        <NotificationsProvider>
                          <NotistackProvider>
                            <RatingsProvider>
                              <Router>
                                {/* add page routes here */}
                                <LoginPage path="/" />
                                <ForgotPassword path="/forgot-password" />
                                <ResetPassword path="/reset-password" />
                                <DashboardPage path="/dashboard" />
                                <JobsterHome path="/freelancer/app" />
                              </Router>
                              <GenericNotification />
                            </RatingsProvider>
                          </NotistackProvider>
                        </NotificationsProvider>
                      </SessionProvider>
                    </AuthProvider>
                  </CSSTransition>
                </TransitionGroup>
              )}
            </Location>
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
