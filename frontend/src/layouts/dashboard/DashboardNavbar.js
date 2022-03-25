import React from 'react'
import {useNavigate} from 'react-router-dom'
import {styled} from '@material-ui/core/styles'
import {
  // Badge,
  Box,
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core'
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined'

import AccountPopover from './AccountPopover'
const DRAWER_WIDTH = 280
const APPBAR_MOBILE = 48
const APPBAR_DESKTOP = 92

const RootStyle = styled(AppBar)(({theme}) => ({
  boxShadow: 'none',
  backgroundColor: theme.palette.starjobs.main,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  borderBottom: 'solid 1px rgba(0, 0, 0, 0.08)',
  left: 0,
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const ToolbarStyle = styled(Toolbar)(({theme}) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}))

const DashboardNavbar = ({location, user}) => {
  const navigate = useNavigate()

  const pageTitle = (url) => {
    let check_public_profile = url.split('/').includes('jobster')
    if (check_public_profile) {
      return {
        child: true,
        status: false,
        name: '',
      }
    }
    let check_applicant_profile = url.split('/').includes('applicant')
    if (check_applicant_profile) {
      return {
        child: true,
        status: false,
        name: 'Jobster Profile',
      }
    }

    let check_notification_details = url.split('/').includes('details')
    if (check_notification_details) {
      return {
        child: true,
        status: false,
        name: 'Notification Details',
      }
    }

    let check_gigs_search = url.split('/').includes('gigs')
    if (check_gigs_search) {
      return {
        child: true,
        status: false,
        name: 'Browse Gigs',
      }
    }

    switch (url) {
      case '/client/my-activity':
        return {
          status: true,
          name: 'My Activity',
        }
      case '/client/gig/create':
        return {
          status: true,
          name: 'Gigs',
        }
      case '/account/change-password':
        return {
          status: true,
          name: 'Account',
        }
      case '/freelancer/search':
      case '/client/search':
        return {
          status: true,
          name: 'Browse by Category',
        }
      case '/freelancer/message':
      case '/client/message':
        return {
          status: true,
          name: 'Notifications',
        }
      case '/freelancer/history':
      case '/client/history':
        return {
          status: true,
          name: 'My Activity',
        }
      case '/freelancer/dashboard':
        return {
          status: false,
          name: 'Gigs',
        }
      case '/freelancer/app':
      case '/client/app':
        return {
          status: false,
          name: '',
        }
      case '/freelancer/edit':
      case '/client/edit':
        return {
          status: false,
          name: 'Edit Profile',
        }
      case '/freelancer/profile':
      case '/client/profile':
        return {
          child: false,
          status: false,
          name: 'Profile',
        }
      default:
        return {
          status: false,
        }
    }
  }

  return (
    <>
      {!pageTitle(location).child ? (
        <RootStyle sx={{pt: 1, pb: 1}}>
          <ToolbarStyle>
            <>
              <Typography variant="h5" sx={{textAlign: 'center', py: 1}} color="common.white">
                {pageTitle(location).name}
              </Typography>
              <Box sx={{flexGrow: 1}} />
              <Stack direction="row" alignItems="center" spacing={{xs: 0.5, sm: 1.5}}>
                <AccountPopover user={user} />
              </Stack>
            </>
          </ToolbarStyle>
        </RootStyle>
      ) : (
        <RootStyle sx={{pt: 1, pb: 1}}>
          <ToolbarStyle>
            <>
              <Button
                onClick={() => navigate(-1)}
                startIcon={<ChevronLeftOutlinedIcon />}
                variant="text"
                sx={{color: 'common.white'}}
              >
                Go back
              </Button>
              <Box sx={{flexGrow: 1}} />
              <Stack direction="row" alignItems="center" spacing={{xs: 0.5, sm: 1.5}}>
                <AccountPopover user={user} />
              </Stack>
            </>
          </ToolbarStyle>
        </RootStyle>
      )}
    </>
  )
}

export default DashboardNavbar
