import React from 'react'
import {browserName} from 'react-device-detect'

import {makeStyles} from '@mui/styles'
import {Badge, Box} from '@mui/material'
import {alpha, styled} from '@mui/material/styles'
import {BottomNavigation, BottomNavigationAction} from '@mui/material'
import {Link} from 'react-router-dom'

import HomeIcon from '@mui/icons-material/HomeOutlined'
import HomeIconActive from '@mui/icons-material/Home'

import SearchIcon from '@mui/icons-material/SearchOutlined'
import SearchIconActive from '@mui/icons-material/Search'

import PersonIcon from '@mui/icons-material/PersonOutline'
import PersonIconActive from '@mui/icons-material/Person'

import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtlOutlined'

import NotificationsIcon from '@mui/icons-material/NotificationsOutlined'
import NotificationsIconActive from '@mui/icons-material/Notifications'

import {useAuth} from 'src/contexts/AuthContext'
import {useNotifications} from 'src/contexts/NotificationContext'
import {useSession} from 'src/contexts/SessionContext'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'auto'
  },
  nav_item: {
    '& svg': {
      padding: '2px 0'
    },
    '@media (max-width: 500px)': {
      minWidth: 'auto',
      padding: '6px 0'
    }
  },
  main_button: {
    borderTopLeftRadius: 78,
    borderTopRightRadius: 78,
    width: 72,
    height: 130,
    marginTop: -20,
    backgroundColor: theme.palette.common.white,
    boxShadow: '0px -16px 20px 0px rgba(128,125,125,0.25)',
    backdropFilter: 'blur(6px)',
    '& svg': {
      marginTop: -60,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.starjobs.main,
      width: 52,
      height: 52,
      borderRadius: 52,
      padding: 10
    },
    '& .MuiBottomNavigationAction-label': {
      position: 'absolute',
      top: '53%'
    },
    '@media (max-width: 500px)': {
      minWidth: 'auto'
    }
  },
  icon: {
    width: 30,
    height: 30
  }
}))

const DRAWER_WIDTH = 280

const BottomNavigationContainer = styled('div')(({theme}) => ({
  boxShadow: '0px -2px 10px 5px rgba(128,125,125,0.25)',
  backdropFilter: 'blur(6px)',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  position: 'fixed',
  bottom: browserName == 'Mobile Safari' ? -5 : -10,
  right: 0,
  left: 0,
  marginTop: '0 auto',
  WebkitBackdropFilter: 'blur(6px)',
  backgroundColor: alpha(theme.palette.background.default, 1),
  zIndex: 99,
  height: 80,
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

export default function SimpleBottomNavigation() {
  const classes = useStyles()
  const {currentUser} = useAuth()
  const {notification} = useNotifications()
  const {sessionScreen, handleSessionScreen} = useSession()

  const renderClientNavigation = () => {
    return (
      <>
        <BottomNavigation
          value={sessionScreen ? sessionScreen : 0}
          onChange={(event, newValue) => {
            handleSessionScreen(newValue)
          }}
          className={classes.root}
          id="bottom-nav"
        >
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              sessionScreen === 0 ? <HomeIconActive className={classes.icon} /> : <HomeIcon className={classes.icon} />
            }
            component={Link}
            to={`/client/app`}
            key="client-app"
            showLabel={true}
            label="Home"
          />
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              sessionScreen === 1 ? (
                <SearchIconActive className={classes.icon} />
              ) : (
                <SearchIcon className={classes.icon} />
              )
            }
            component={Link}
            to={`/gigs`}
            key="client-gigs"
            showLabel={true}
            label="Search"
          />
          <Box>
            <BottomNavigationAction
              onChange={() => {
                handleSessionScreen(2)
              }}
              className={classes.main_button}
              icon={<FormatListNumberedRtlIcon className={classes.icon} />}
              component={Link}
              to="/client/gig/create"
              key="client-gig-create"
              showLabel={true}
              label="Gigs"
            />
          </Box>
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              <Badge badgeContent={notification} color="error">
                {sessionScreen === 3 ? (
                  <NotificationsIconActive className={classes.icon} />
                ) : (
                  <NotificationsIcon className={classes.icon} />
                )}
              </Badge>
            }
            component={Link}
            to={`/client/message`}
            key="client-message"
            showLabel={true}
            label="Notifications"
          />
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              sessionScreen === 4 ? (
                <PersonIconActive className={classes.icon} />
              ) : (
                <PersonIcon className={classes.icon} />
              )
            }
            component={Link}
            to={`/client/profile`}
            key="client-profile"
            showLabel={true}
            label="Profile"
          />
        </BottomNavigation>
      </>
    )
  }

  const renderFreelancerNavigation = () => {
    return (
      <>
        <BottomNavigation
          value={sessionScreen === 2 ? '' : sessionScreen}
          onChange={(event, newValue) => {
            handleSessionScreen(newValue)
          }}
          className={classes.root}
          id="bottom-nav"
        >
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              sessionScreen === 0 ? <HomeIconActive className={classes.icon} /> : <HomeIcon className={classes.icon} />
            }
            component={Link}
            to={`/freelancer/app`}
            key="freelancer-app"
            showLabel={true}
            label="Home"
          />
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              sessionScreen === 1 ? (
                <SearchIconActive className={classes.icon} />
              ) : (
                <SearchIcon className={classes.icon} />
              )
            }
            component={Link}
            to={`/gigs`}
            key="freelancer-gigs"
            showLabel={true}
            label="Search"
          />

          <Box>
            <BottomNavigationAction
              className={classes.main_button}
              icon={<FormatListNumberedRtlIcon className={classes.icon} />}
              component={Link}
              onChange={() => {
                handleSessionScreen(2)
              }}
              to={`/freelancer/dashboard`}
              key="freelancer-dashboard"
              showLabel={true}
              label="Gigs"
            />
          </Box>
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              <>
                <Badge badgeContent={notification} color="error">
                  {sessionScreen === 3 ? (
                    <NotificationsIconActive className={classes.icon} />
                  ) : (
                    <NotificationsIcon className={classes.icon} />
                  )}
                </Badge>
              </>
            }
            component={Link}
            to={`/freelancer/message`}
            key="freelancer-message"
            showLabel={true}
            label="Notifications"
          />

          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              sessionScreen === 4 ? (
                <PersonIconActive className={classes.icon} />
              ) : (
                <PersonIcon className={classes.icon} />
              )
            }
            component={Link}
            to={`/freelancer/profile`}
            key="freelancer-profile"
            showLabel={true}
            label="Profile"
          />
        </BottomNavigation>
      </>
    )
  }

  return (
    <BottomNavigationContainer>
      {currentUser.accountType === 1 && renderClientNavigation()}
      {currentUser.accountType === 0 && renderFreelancerNavigation()}
    </BottomNavigationContainer>
  )
}
