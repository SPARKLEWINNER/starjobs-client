import React, {useEffect, useState} from 'react'
import {Box} from '@mui/material'
import {Router, Location} from '@reach/router'

// import 'utils/highlight'
// import {TransitionGroup, CSSTransition} from 'react-transition-group'

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

// components
// import PrivateRoute from 'components/PrivateRoute'

// screens
import LoginPage from 'screens/Login'
import ForgotPassword from 'screens/ForgotPassword'
import ResetPassword from 'screens/ResetPassword'
import DashboardPage from 'screens/Dashboard'

import JobsterHome from 'screens/jobster/home'
import JobsterDashboard from 'screens/jobster/dashboard'
import JobsterProfile from 'screens/jobster/profile'
import JobsterEditProfile from 'screens/jobster/profile/editProfile'

import ChangePassword from 'screens/ChangePassword'
import Message from 'screens/Message'
import MessageDetails from 'screens/MessageDetails'

import Gigs from 'screens/gigs'
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
              {() => (
                <AuthProvider>
                  {/* // <TransitionGroup className="transition-group"> */}
                  {/* <CSSTransition key={location.key} classNames="fade" timeout={300}> */}
                  <SessionProvider>
                    <NotificationsProvider>
                      <NotistackProvider>
                        <RatingsProvider>
                          <Router>
                            {/* add page routes here */}
                            <LoginPage path="/login" />
                            <LoginPage path="/" />
                            <ForgotPassword path="/forgot-password" />
                            <ResetPassword path="/reset-password" />

                            <DashboardPage path="/dashboard" />

                            {/* jobsters */}
                            <JobsterDashboard path="/freelancer/dashboard" />
                            <JobsterHome path="/freelancer/app" />
                            <JobsterProfile path="/freelancer/profile" />
                            <JobsterEditProfile path="/freelancer/edit" />

                            <JobsterEditProfile path="/freelancer/edit" />

                            {/* accounts */}
                            <Message path="/freelancer/message" />
                            <MessageDetails path="/notification/details/:id/:hid" />
                            <ChangePassword path="/account/change-password" />

                            {/* gigs */}
                            <Gigs path="/gigs" />
                            <Gigs path="/gigs/:category" />
                          </Router>
                        </RatingsProvider>
                        <GenericNotification />
                      </NotistackProvider>
                    </NotificationsProvider>
                  </SessionProvider>
                  {/* // </CSSTransition> */}
                  {/* // </TransitionGroup> */}
                </AuthProvider>
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
  // return <Application />
}

export default App
