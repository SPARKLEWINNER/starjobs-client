import {last} from 'lodash'

import {Outlet, useLocation} from 'react-router-dom'
// material
import PullToRefresh from 'react-simple-pull-to-refresh'
import {styled} from '@mui/material/styles'
//
import DashboardNavbar from './DashboardNavbar'
import FixedBottomNavigation from 'src/components/BottomNavigation'

import {useAuth} from 'src/contexts/AuthContext'

import {getWindowDimensions} from 'src/utils/dimensions'
// import {SocketContext} from 'src/utils/contexts/socket'

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 92

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  backgroundColor: '#f8fbfb'
})

const MainStyle = styled('div')(({theme}) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: getWindowDimensions().height,
  margin: '0 auto',
  paddingTop: APP_BAR_MOBILE + 24,
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  }
}))

export default function DashboardLayout() {
  const location = useLocation()
  const {currentUser} = useAuth()

  const handleRefresh = () => {
    window.location.reload()
  }

  const renderContainer = (url) => {
    let check_applicant_profile = url.split('/').includes('applicant')
    if (check_applicant_profile) {
      return false
    }
    let check_notification_details = url.split('/').includes('details')
    if (check_notification_details) {
      return false
    }

    switch (url) {
      case '/freelancer/profile':
      case '/client/profile':
        return false
      default:
        return true
    }
  }
  return (
    <>
      <RootStyle>
        <DashboardNavbar location={location.pathname} user={currentUser} />
        {(renderContainer(location.pathname) || !renderContainer(location.pathname)) && (
          <MainStyle sx={{...(last(location.pathname.split('/')) === 'app' ? {paddingTop: 6} : {})}}>
            <PullToRefresh
              onRefresh={handleRefresh}
              pullDownThreshold={getWindowDimensions().height / 1.2}
              maxPullDownDistance={getWindowDimensions().height / 1.2}
            >
              <Outlet />
            </PullToRefresh>
          </MainStyle>
        )}
        <FixedBottomNavigation />
      </RootStyle>
    </>
  )
}
