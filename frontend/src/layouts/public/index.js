import {useState, useEffect} from 'react'
import {useParams, useLocation} from 'react-router-dom'
import {Box, Tab, Stack, Grid, Divider, Typography, Card} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {styled} from '@mui/material/styles'
import {makeStyles} from '@mui/styles'
import {Icon} from '@iconify/react'
import checkmark from '@iconify/icons-eva/checkmark-circle-outline'
import map from '@iconify/icons-eva/map-outline'
import envelope from '@iconify/icons-eva/email-outline'

// component
import {AboutTab, ReviewTab, CredentialsTab} from './tabs'
import MAvatar from 'src/components/@material-extend/MAvatar'

// api
import user_api from 'src/lib/users'
import storage from 'src/utils/storage'

// theme
import color from 'src/theme/palette'

// variables
const DRAWER_WIDTH = 280
const APPBAR_DESKTOP = 200
const image_bucket = process.env.REACT_APP_IMAGE_URL

const MainStyle = styled(Stack)(({theme}) => ({
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: APPBAR_DESKTOP,
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
    width: '32%',
    maxWidth: '32%',
    textTransform: 'uppercase',
    margin: '0 4px',
    border: '1px solid #727272',
    borderRadius: '8px',
    minHeight: '42px',
    '@media (max-width: 500px)': {
      width: '31.33%',
      maxWidth: 'auto',
      padding: '6px 0',
      margin: '0 3px',
      fontSize: 12
    },
    '@media (max-width: 475px)': {
      fontSize: 11
    },
    '&.Mui-selected': {
      backgroundColor: `${color.starjobs.main}`,
      border: 'none',
      color: `${color.common.white}`
    }
  },
  icon: {
    width: 27,
    height: 27
  }
})

export default function TabsComponent() {
  const classes = useStyles()
  const location = useLocation()
  const params = useParams()
  const [value, setValue] = useState('1')
  const [user, setUser] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [isNotVerified, setNotVerified] = useState(true)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const load = async () => {
    setLoading(true)
    const local_user = await storage.getUser()
    if (!local_user) return setLoading(false)
    const user = JSON.parse(local_user)
    if (!user.isActive) {
      setUser(user)

      return
    }
    let result
    if (location.pathname === '/freelancer/profile') {
      result = await user_api.get_user_profile()
    } else {
      result = await user_api.get_user_profile_freelancer(params.id)
      result = {data: {...result.data[0]}, ok: result.ok}
    }
    setNotVerified(false)
    if (!result.ok) return setLoading(false)
    setUser(result.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [])

  const renderTab = (type, current_user) => {
    switch (type) {
      case '1':
        return <AboutTab form={current_user} />
      case '2':
        return <ReviewTab />
      case '3':
        return <CredentialsTab />
      default:
    }
  }

  const SIMPLE_TAB = [
    {value: '1', label: 'About', disabled: false},
    {value: '2', label: 'Reviews', disabled: false},
    {value: '3', label: 'Credentials', disabled: false}
  ]

  return (
    <>
      <Box sx={{mb: 20}}></Box>
      <MainStyle>
        {isLoading || isNotVerified ? (
          <Box sx={{sm: {height: '50vh'}, xs: {height: '300px'}}} />
        ) : (
          <>
            <Stack
              direction={{xs: 'column', sm: 'column', md: 'row'}}
              sx={{
                zIndex: 999,
                mb: {sm: 3, xs: 3},
                mt: {xs: '-140px !important', sm: '0 !important', md: '0 !important'},
                width: '100%',
                alignItems: {md: 'flex-start', sm: 'center', xs: 'center'},
                px: '0 !important'
              }}
            >
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
                  src={`${image_bucket}${user.photo}`}
                  sx={{margin: '0 auto', width: 150, height: 150}}
                />
              </Box>

              <Box sx={{my: 1, width: '100%', textAlign: 'center'}}>
                <Grid container sx={{alignItems: 'center', mb: 1, width: '100%', justifyContent: 'center'}}>
                  <Typography variant="h3" sx={{mr: 1, wordBreak: 'break-all', position: 'relative', width: '240px'}}>
                    {user.firstName} {user.middleInitial} {user.lastName}
                    <Box component="span" sx={{position: 'absolute', right: -40, top: 4}}>
                      <Icon icon={checkmark} width={24} height={24} color={`${color.starjobs.main}`} />
                    </Box>
                  </Typography>
                </Grid>
              </Box>
              {location.pathname === '/freelancer/profile' && (
                <Box sx={{textAlign: 'justify', mb: 2}}>
                  <Typography variant="body2">
                    "Results-driven professional with repeated success in guiding it projects from start to finish,
                    managing technical support operations and introducing new technologies to promote operational
                    efficiency."
                  </Typography>
                </Box>
              )}
              <Divider sx={{mb: 3}} />
              <Stack direction="row" sx={{my: 1, width: '100%', textAlign: 'center'}}>
                <Box sx={{textAlign: 'center', mb: 1, width: '100%'}}>
                  <Icon icon={map} width={24} height={24} color={`${color.starjobs.main}`} />
                  <Typography
                    variant="body2"
                    sx={{wordBreak: 'break-all', width: '100px', margin: '0 auto', fontWeight: '600'}}
                  >
                    {!user.permanentCity ? (
                      <Typography variant="body2" sx={{mb: 3}}>
                        {user.presentCity}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ml: 1}}>
                        {user.permanentCity}
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <Box item sx={{textAlign: 'center', mb: 1, width: '100%'}}>
                  <Icon icon={envelope} width={24} height={24} color={`${color.starjobs.main}`} />
                  <Typography
                    variant="body2"
                    sx={{wordBreak: 'break-all', width: '100px', margin: '0 auto', fontWeight: '600'}}
                  >
                    {user.email}
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
                  {SIMPLE_TAB.map((tab, index) => (
                    <Tab className={classes.nav_item} key={tab.value} label={tab.label} value={String(index + 1)} />
                  ))}
                </TabList>
                <Box
                  sx={{
                    mt: 2,
                    width: '100%',
                    borderRadius: 1
                  }}
                >
                  <Card
                    sx={{
                      p: 2,
                      mt: 1,
                      mb: 20,
                      width: '100%',
                      borderRadius: 1
                    }}
                  >
                    {SIMPLE_TAB.map((panel, index) => (
                      <TabPanel key={panel.value} value={String(index + 1)} sx={{p: 0}}>
                        {renderTab(panel.value, user)}
                      </TabPanel>
                    ))}
                  </Card>
                </Box>
              </TabContext>
            </Stack>
          </>
        )}
      </MainStyle>
    </>
  )
}
