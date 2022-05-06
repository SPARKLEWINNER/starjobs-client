import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {capitalCase} from 'change-case'
import {useSnackbar} from 'notistack'

// icon
import {Icon} from '@iconify/react'
import checkmark from '@iconify/icons-eva/checkmark-circle-2-fill'
import map from '@iconify/icons-eva/map-outline'
import envelope from '@iconify/icons-eva/email-outline'
import globe from '@iconify/icons-eva/globe-outline'

// material
import {Box, Tab, Stack, Grid, Typography, Card} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {styled} from '@mui/material/styles'
import {makeStyles} from '@mui/styles'

// components
import Page from 'src/components/Page'
import {CredentialsTab, ActivityTab} from 'src/pages/client/profile/tabs'
import MAvatar from 'src/components/@material-extend/MAvatar'

// api
import user_api from 'src/lib/users'

// theme
import color from 'src/theme/palette'
import {useAuth} from 'src/contexts/AuthContext'

// variables
const image_bucket = process.env.REACT_APP_IMAGE_URL
const DRAWER_WIDTH = 280

const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

const ProfileStyle = styled(Stack)(({theme}) => ({
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  },
  [theme.breakpoints.up('sm')]: {
    marginTop: 120
  },
  [theme.breakpoints.up('xs')]: {
    marginTop: 0
  }
}))

const useStyles = makeStyles({
  root: {
    width: 'auto'
  },
  nav_item: {
    // textTransform: 'uppercase',
    fontSize: '0.85rem !important',
    margin: '8px',
    minHeight: '42px',
    color: `${color.common.black}`,
    '@media (max-width: 500px)': {
      maxWidth: 'auto',
      padding: '6px 0',
      margin: '0 3px',
      fontSize: 12
    },
    '@media (max-width: 475px)': {
      fontSize: 11
    },
    '&.Mui-selected': {
      borderBottom: `1px solid ${color.starjobs.main}`,
      border: 'none',
      borderRadius: 0
    }
  },
  icon: {
    width: 27,
    height: 27
  }
})

const STATIC_TAB = [
  {value: 2, label: 'Credentials', disabled: false},
  {value: 3, label: 'Activity History', disabled: false}
]

const Profile = () => {
  const {currentUser} = useAuth()
  const location = useLocation()
  const classes = useStyles()
  const {enqueueSnackbar} = useSnackbar()
  const [value, setValue] = useState('1')
  const [user, setUser] = useState([])
  const [displayName, setDisplayName] = useState(null)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    let componentMounted = true

    const load = async () => {
      if (!currentUser.isActive) {
        setUser(currentUser)
      }

      const result = await user_api.get_user_profile_client(currentUser._id)
      if (!result.ok) return

      let {details} = result.data
      if (details && details.length <= 0) {
        enqueueSnackbar('Kindly complete your account details to in order to proceed', {variant: 'warning'})
        return
      }

      const capitalizeName = capitalCase(`${details?.firstName} ${details.lastName}`)
      setDisplayName(capitalizeName)

      if (componentMounted) {
        setUser(details)
      }
    }
    load()

    return () => {
      componentMounted = false
    }
    // eslint-disable-next-line
  }, [currentUser])

  const renderTab = (type, current_user) => {
    if (type === 1)
      return (
        <Stack>
          <Box sx={{textAlign: 'justify', mb: 2}}>
            <Typography variant="body2">
              "Results-driven professional with repeated success in guiding it projects from start to finish, managing
              technical support operations and introducing new technologies to promote operational efficiency."
            </Typography>
          </Box>
        </Stack>
      )
    switch (type) {
      case 3:
        if (location.pathname === '/client/profile') return <ActivityTab />
        return ''
      case 2:
      default:
        return <CredentialsTab form={current_user} />
    }
  }

  return (
    <Page title="Profile - Starjobs">
      <MainStyle
        alignItems="center"
        justify="center"
        sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}, width: '100%'}}
      >
        <ProfileStyle>
          {/* profile */}
          <Box sx={{mb: 20}} />

          <Stack
            direction={{xs: 'column', sm: 'column', md: 'row'}}
            sx={{
              zIndex: 999,
              mb: {sm: 3, xs: 3},
              mt: {xs: '-140px !important', sm: '0 !important', md: '0 !important'},
              width: '100%',
              alignItems: {md: 'flex-start', sm: 'center', xs: 'center'},
              px: 0
            }}
          >
            {/* image */}
            <Box
              sx={{
                mr: 1,
                display: 'flex',
                alignItems: {md: 'flex-start', sm: 'flex-start', xs: 'center'},
                px: {sm: 0, xs: 0},
                mb: 1
              }}
            >
              <MAvatar
                key={'Profile Picture'}
                alt="Picture"
                src={`${image_bucket}${user?.photo}`}
                sx={{margin: '0 auto', width: 150, height: 150}}
              />
            </Box>

            {/* details */}
            <Box sx={{my: 1, width: '100%', textAlign: 'center'}}>
              <Grid container sx={{alignItems: 'center', mb: 1, width: '100%', justifyContent: 'center'}}>
                <Typography variant="h3" sx={{mr: 1, wordBreak: 'break-all', position: 'relative', width: '200px'}}>
                  {user && displayName}
                  <Box component="span" sx={{position: 'absolute', right: -40, top: 4}}>
                    <Icon icon={checkmark} width={24} height={24} color={`${color.starjobs.main}`} />
                  </Box>
                </Typography>
              </Grid>
            </Box>

            {/* introduction */}
            <Box sx={{textAlign: 'justify', mb: 2}}>
              <Typography variant="body2">
                "Results-driven professional with repeated success in guiding it projects from start to finish, managing
                technical support operations and introducing new technologies to promote operational efficiency."
              </Typography>
            </Box>

            {/* links */}
            <Stack direction="row" sx={{my: 1, width: '100%', textAlign: 'center'}}>
              <Box sx={{textAlign: 'center', mb: 1, width: '100%'}}>
                <Icon icon={map} width={24} height={24} color={`${color.starjobs.main}`} />
                <Typography
                  variant="body2"
                  sx={{wordBreak: 'break-all', width: '100px', margin: '0 auto', fontWeight: '600'}}
                >
                  {user && user.location && capitalCase(user.location)}
                </Typography>
              </Box>
              <Box sx={{textAlign: 'center', mb: 1, width: '100%'}}>
                <Icon icon={globe} width={24} height={24} color={`${color.starjobs.main}`} />
                <Typography
                  variant="body2"
                  sx={{wordBreak: 'break-all', width: '100px', margin: '0 auto', fontWeight: '600'}}
                >
                  {user && user.website}
                </Typography>
              </Box>
              <Box item sx={{textAlign: 'center', mb: 1, width: '100%'}}>
                <Icon icon={envelope} width={24} height={24} color={`${color.starjobs.main}`} />
                <Typography
                  variant="body2"
                  sx={{wordBreak: 'break-all', width: '100px', margin: '0 auto', fontWeight: '600'}}
                >
                  {user && user.email}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack direction={{xs: 'column', md: 'column'}}>
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                TabIndicatorProps={{
                  style: {
                    display: 'none'
                  }
                }}
              >
                {STATIC_TAB.map((tab, index) => (
                  <Tab className={classes.nav_item} key={tab.value} label={tab.label} value={String(index + 1)} />
                ))}
              </TabList>
              <Box sx={{my: 2}} />
              <Card
                sx={{
                  p: 2,
                  mt: 1,
                  width: '100%',
                  borderRadius: 1,
                  ...(location.pathname !== '/client/profile' ? {} : {mb: 20})
                }}
              >
                {STATIC_TAB.map((panel, index) => (
                  <TabPanel key={panel.value} value={String(index + 1)} sx={{p: 0}}>
                    {renderTab(panel.value)}
                  </TabPanel>
                ))}
              </Card>
            </TabContext>
          </Stack>
        </ProfileStyle>
      </MainStyle>
    </Page>
  )
}

export default Profile
