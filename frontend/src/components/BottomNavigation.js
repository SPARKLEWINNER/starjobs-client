import React, {useState, useEffect} from 'react'

import {makeStyles} from '@material-ui/styles'
import {Badge, Box} from '@material-ui/core'
import {alpha, styled} from '@material-ui/core/styles'
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core'
import {Link} from 'react-router-dom'

import DescriptionIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/SearchOutlined'
import AddBoxIcon from '@material-ui/icons/Add'
import PersonIcon from '@material-ui/icons/Person'
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtlOutlined'
import NotificationsIcon from '@material-ui/icons/Notifications'

import {useAuth} from 'utils/context/AuthContext'

import user_api from 'api/users'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'auto',
  },
  nav_item: {
    '& svg': {
      padding: '2px 0',
    },
    '@media (max-width: 500px)': {
      minWidth: 'auto',
      padding: '6px 0',
    },
  },
  main_button: {
    borderRadius: 88,
    paddingTop: 60,
    paddingBottom: 16,
    width: 88,
    height: 120,
    marginTop: -60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    boxShadow: '0px -2px 10px 5px rgba(128,125,125,0.25) inset',
    backdropFilter: 'blur(6px)',
    '& svg': {
      marginTop: 50,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.starjobs.main,
      width: 48,
      height: 48,
      borderRadius: 48,
      padding: 12,
    },
    '@media (max-width: 500px)': {
      minWidth: 'auto',
      padding: '6px 0',
    },
  },
  icon: {
    width: 30,
    height: 30,
  },
}))

const DRAWER_WIDTH = 280

const BottomNavigationContainer = styled('div')(({theme}) => ({
  boxShadow: '0px -2px 10px 5px rgba(128,125,125,0.25)',
  backdropFilter: 'blur(6px)',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  position: 'fixed',
  bottom: -4,
  right: 0,
  left: 0,
  margin: '0 auto',
  WebkitBackdropFilter: 'blur(6px)',
  backgroundColor: alpha(theme.palette.background.default, 1),
  zIndex: 99,
  height: '60px',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

export default function SimpleBottomNavigation() {
  const classes = useStyles()
  const {currentUser} = useAuth()
  const [value, setValue] = useState(0)
  const [notification, setNotifications] = useState(0)

  useEffect(() => {
    let componentMounted = true

    const load = async () => {
      let result
      if (currentUser.accountType === 1) {
        result = await user_api.get_user_notifications_client(currentUser._id)
      } else {
        result = await user_api.get_user_notifications(currentUser._id)
      }

      if (!result.ok) return

      const {data} = result.data
      if (data.length === 0) return

      let unread = data.filter((obj) => obj.isRead === false)
      const tab = sessionStorage.getItem('tab')
      if (componentMounted) {
        setNotifications(unread.length)
        setValue(JSON.parse(tab))
      }
    }

    load()
    return () => {
      componentMounted = false
    }

    // eslint-disable-next-line
  }, [currentUser])

  const renderClientNavigation = () => {
    return (
      <>
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
            sessionStorage.setItem('tab', newValue)
          }}
          className={classes.root}
          id="bottom-nav"
        >
          <BottomNavigationAction
            className={classes.nav_item}
            icon={<DescriptionIcon className={classes.icon} />}
            component={Link}
            to={`/client/app`}
            key="client-app"
          />
          <BottomNavigationAction
            className={classes.nav_item}
            icon={<SearchIcon className={classes.icon} />}
            component={Link}
            to={`/gigs`}
            key="client-gigs"
          />
          <Box sx={{overflow: 'hidden'}}>
            <BottomNavigationAction
              className={classes.main_button}
              icon={<AddBoxIcon className={classes.icon} />}
              component={Link}
              to="/client/gig/create"
              key="client-gig-create"
            />
          </Box>
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              <Badge badgeContent={notification} color="error">
                <NotificationsIcon className={classes.icon} />
              </Badge>
            }
            component={Link}
            to={`/client/message`}
            key="client-message"
          />
          <BottomNavigationAction
            className={classes.nav_item}
            icon={<PersonIcon className={classes.icon} />}
            component={Link}
            to={`/client/profile`}
            key="client-profile"
          />
          */}
        </BottomNavigation>
      </>
    )
  }

  const renderFreelancerNavigation = () => {
    return (
      <>
        <BottomNavigation
          value={value === 2 ? '' : value}
          onChange={(event, newValue) => {
            setValue(newValue)
            sessionStorage.setItem('tab', newValue)
          }}
          className={classes.root}
          id="bottom-nav"
        >
          <BottomNavigationAction
            className={classes.nav_item}
            icon={<DescriptionIcon className={classes.icon} />}
            component={Link}
            to={`/freelancer/app`}
            key="freelancer-app"
          />
          <BottomNavigationAction
            className={classes.nav_item}
            icon={<SearchIcon className={classes.icon} />}
            component={Link}
            to={`/gigs`}
            key="freelancer-gigs"
          />
          {/* <BottomNavigationAction
                className={classes.nav_item}
                icon={<AddBoxIcon className={classes.icon} />}
                component={Link}
                to="#"
              /> */}
          <Box sx={{overflow: 'hidden'}}>
            <BottomNavigationAction
              className={classes.main_button}
              icon={<FormatListNumberedRtlIcon className={classes.icon} />}
              component={Link}
              to={`/freelancer/dashboard`}
              key="freelancer-dashboard"
            />
          </Box>
          <BottomNavigationAction
            className={classes.nav_item}
            icon={
              <>
                <Badge badgeContent={notification} color="error">
                  <NotificationsIcon className={classes.icon} />
                </Badge>
              </>
            }
            component={Link}
            to={`/freelancer/message`}
            key="freelancer-message"
          />

          <BottomNavigationAction
            className={classes.nav_item}
            icon={<PersonIcon className={classes.icon} />}
            component={Link}
            to={`/freelancer/profile`}
            key="freelancer-profile"
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
