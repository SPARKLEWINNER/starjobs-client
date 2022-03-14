import React, {useState, useContext, useEffect} from 'react'

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

import {UsersContext} from 'utils/context/users'

import storage from 'utils/storage'
import user_api from 'utils/api/users'

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
    paddingTop: 40,
    paddingBottom: 16,
    width: 88,
    height: 120,
    marginTop: -60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    boxShadow: '0px -2px 10px 5px rgba(128,125,125,0.25) inset',
    backdropFilter: 'blur(6px)',
    '& svg': {
      marginTop: 28,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.starjobs.main,
      width: 48,
      height: 48,
      borderRadius: 48,
      padding: 10,
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
  // overflow: 'hidden',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  margin: '0 auto',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 1),
  zIndex: 99,
  height: '60px',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

export default function SimpleBottomNavigation() {
  const classes = useStyles()
  const {user} = useContext(UsersContext)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(0)
  const [notification, setNotifications] = useState(0)

  const load = async () => {
    setLoading(true)

    const local_user = await storage.getUser()
    if (!local_user) return setLoading(false)

    const users = JSON.parse(local_user)
    if (users.length === 0) {
      return setLoading(false)
    }

    let result
    if (users.accountType === 1) {
      result = await user_api.get_user_notifications_client(users._id)
    } else {
      result = await user_api.get_user_notifications(users._id)
    }

    if (!result.ok) {
      return setLoading(false)
    }

    const {data} = result.data
    if (data.length === 0) return setLoading(false)
    setLoading(false)
    let unread
    if (users.accountType === 1) {
      unread = data.filter((obj) => obj.readAuthor === false)
    } else {
      unread = data.filter((obj) => obj.readUser === false)
    }

    setNotifications(unread.length)
  }

  useEffect(() => {
    load()
    const tab = sessionStorage.getItem('tab')
    setValue(JSON.parse(tab))
  }, [])

  return (
    <>
      {!loading && (
        <BottomNavigationContainer>
          {user.accessType === '/client' ? (
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
              />
              <BottomNavigationAction
                className={classes.nav_item}
                icon={<SearchIcon className={classes.icon} />}
                component={Link}
                to={`/gigs`}
              />

              <Box sx={{overflow: 'hidden'}}>
                <BottomNavigationAction
                  className={[classes.nav_item, classes.main_button]}
                  icon={<AddBoxIcon className={classes.icon} />}
                  component={Link}
                  to="/client/gig/create"
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
              />

              <BottomNavigationAction
                className={classes.nav_item}
                icon={<PersonIcon className={classes.icon} />}
                component={Link}
                to={`/client/profile`}
              />
            </BottomNavigation>
          ) : (
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
              />
              <BottomNavigationAction
                className={classes.nav_item}
                icon={<SearchIcon className={classes.icon} />}
                component={Link}
                to={`/freelancer/search`}
              />
              {/* <BottomNavigationAction
                className={classes.nav_item}
                icon={<AddBoxIcon className={classes.icon} />}
                component={Link}
                to="#"
              /> */}
              <Box sx={{overflow: 'hidden'}}>
                <BottomNavigationAction
                  className={[classes.nav_item, classes.main_button]}
                  icon={<FormatListNumberedRtlIcon className={classes.icon} />}
                  component={Link}
                  to={`/freelancer/dashboard`}
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
              />

              <BottomNavigationAction
                className={classes.nav_item}
                icon={<PersonIcon className={classes.icon} />}
                component={Link}
                to={`/freelancer/profile`}
              />
            </BottomNavigation>
          )}
        </BottomNavigationContainer>
      )}
    </>
  )
}
