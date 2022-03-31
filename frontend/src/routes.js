import React, {useEffect, useState} from 'react'
import {Navigate, useRoutes, useLocation} from 'react-router-dom'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

// material
import {Stack} from '@material-ui/core'

// layouts
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'
import SignedLayout from './layouts/LogoOnlyLayout'

// account
import SplashScreen from './pages/SplashScreen'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Verification from './pages/Verification'
import Welcome from './pages/Welcome'

// global
import Dashboard from './pages/Dashboard'
import ChangePassword from './pages/ChangePassword'
import BrowseCategory from './pages/BrowseCategory'
import Message from './pages/Message'
import NotificationDetails from './pages/NotificationDetails'
import NotFound from './pages/Page404'

// jobster
import JobsterHome from './pages/jobster/home'
import JobsterDashboard from './pages/jobster/dashboard'
import JobsterOnboard from './pages/jobster/onboard'
import JobsterOnboardSuccess from './pages/jobster/onboard/success'
import JobsterProfile from './pages/jobster/profile'
import JobsterEditProfile from './pages/jobster/profile/editProfile'
// import JobsterHistory from './pages/jobster/history'
import JobsterHistoryDetails from './pages/jobster/history/details'

// client
import ClientHome from './pages/client/home'
import ClientOnboard from './pages/client/onboard'
import ClientOnboardSuccess from './pages/client/onboard/success'
import ClientCreateGig from './pages/client/posting'
import ClientProfile from './pages/client/profile'
import ClientApplicants from './pages/client/applicants'
import ClientApplicantProfile from './pages/client/applicantProfile'
import ClientEditProfile from './pages/client/profile/editProfile'
import ClientEditDocument from './pages/client/profile/editDocument'
import ClientPublicProfile from './pages/client/publicProfile'

// global
import Gigs from './pages/gigs'
import GigDetails from './pages/gigs/details'
import GigsFullDetails from './pages/gigs/fullDetails'
import GigApplySuccess from './pages/gigs/success'
import GigEdit from './pages/gigs/edit'

// components
import LoadingScreen from './components/LoadingScreen'

const UseRoutes = () => {
  return useRoutes([
    // jobster routes
    {
      path: 'freelancer',
      element: <DashboardLayout />,
      children: [
        {path: '/', element: <Navigate to="/freelancer/app" replace />},
        {path: '/app', element: <JobsterHome />},
        {path: '/dashboard', element: <JobsterDashboard />},
        {path: '/onboard', element: <JobsterOnboard />},
        {path: '/onboard/success', element: <JobsterOnboardSuccess />},
        {path: '/profile', element: <JobsterProfile />},
        {path: '/edit', element: <JobsterEditProfile />},
        {path: '/message', element: <Message />},
        {path: '/search', element: <BrowseCategory />},
      ],
    },
    {
      path: 'history',
      element: <DashboardLayout />,
      children: [{path: '/details/:id/:hid', element: <JobsterHistoryDetails />}],
    },
    // client routes
    {
      path: 'client',
      element: <DashboardLayout />,
      children: [
        {path: '/', element: <Navigate to="/client/app" replace />},
        {path: '/app', element: <ClientHome />},
        {path: '/onboard', element: <ClientOnboard />},
        {path: '/onboard/success', element: <ClientOnboardSuccess />},
        {path: '/profile', element: <ClientProfile />},
        {path: '/message', element: <Message />},
        {path: '/edit', element: <ClientEditProfile />},
        {path: '/edit/document', element: <ClientEditDocument />},
        {path: '/gig/create', element: <ClientCreateGig />},
        {path: '/gigs/applicants/:id', element: <ClientApplicants />},
        {path: '/gigs/applicant/profile/:id/:gig_id', element: <ClientApplicantProfile />},
        {path: '/jobster/:id', element: <ClientPublicProfile />},
        {path: '/search', element: <BrowseCategory />},
      ],
    },
    {
      path: 'gigs',
      element: <DashboardLayout />,
      children: [
        {path: '/', element: <Gigs />},
        {path: '/:category', element: <Gigs />},
        {path: '/det/:id', element: <GigsFullDetails />},
        {path: '/details/:id/:category', element: <GigDetails />},
        {path: '/edit/:id', element: <GigEdit />},
        {path: '/apply/success', element: <GigApplySuccess />},
      ],
    },
    // global routes
    {
      path: 'setup',
      element: <SignedLayout />,
      children: [
        {path: '/', element: <Navigate to="/welcome" replace />},
        {path: '/welcome', element: <Welcome />},
      ],
    },
    {
      path: 'account',
      element: <DashboardLayout />,
      children: [{path: '/change-password', element: <ChangePassword />}],
    },
    {
      path: 'notification',
      element: <DashboardLayout />,
      children: [{path: '/details/:id/:hid', element: <NotificationDetails />}],
    },
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [{path: '/', element: <Dashboard />}],
    },
    // non-signed accounts
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        {path: '/', element: <SplashScreen />},
        {path: '/login', element: <Login />},
        {path: '/verification', element: <Verification />},
        {path: '/sign-up', element: <Registration />},
        {path: '404', element: <NotFound />},
      ],
    },
    {
      path: 'undefined',
      element: <LogoOnlyLayout />,
      children: [{path: '/login', element: <Navigate to="/undefined" replace />}],
    },
    {path: '*', element: <Navigate to="/404" replace />},
  ])
}

const AppRoute = () => {
  const [loaded, setLoaded] = useState(false)
  const location = useLocation()

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

  return (
    <>
      {loaded ? (
        <div className="page">
          <TransitionGroup className="transition-group">
            <CSSTransition key={location.key} location={location} classNames="fade" exit={false} timeout={300}>
              <UseRoutes />
            </CSSTransition>
          </TransitionGroup>
        </div>
      ) : (
        <Stack sx={{height: '100vh', zIndex: 9999, position: 'relative'}}>
          <LoadingScreen />
        </Stack>
      )}
    </>
  )
}
export default AppRoute
