import {useState, useEffect} from 'react'
import {useNavigate, useParams, useLocation, Link as RouterLink} from 'react-router-dom'

import {capitalCase} from 'change-case'
import {useSnackbar} from 'notistack5'
import moment from 'moment'

// icon
import {Icon} from '@iconify/react'
import checkmark from '@iconify/icons-eva/checkmark-circle-2-fill'
import map from '@iconify/icons-eva/map-outline'
import envelope from '@iconify/icons-eva/email-outline'
import globe from '@iconify/icons-eva/globe-outline'

// material
import {Box, Tab, Stack, Grid, Typography, Divider, Button, Link, Card} from '@material-ui/core'
import {TabContext, TabList, TabPanel} from '@material-ui/lab'
import {styled} from '@material-ui/core/styles'
import {makeStyles} from '@material-ui/styles'

// components
import Page from 'components/Page'
import {CredentialsTab} from 'pages/client/profile/tabs'
import {ApplyCard, ConfirmGig} from 'pages/gigs/cards'
import MAvatar from 'components/@material-extend/MAvatar'

// api
import user_api from 'utils/api/users'
import gigs_api from 'utils/api/gigs'
import storage from 'utils/storage'
import useSendNotif from 'utils/hooks/useSendNotif'

// variables
const image_bucket = process.env.REACT_APP_IMAGE_URL
const DRAWER_WIDTH = 280

const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const ProfileStyle = styled(Stack)(({theme}) => ({
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
  [theme.breakpoints.up('sm')]: {
    marginTop: 120,
  },
  [theme.breakpoints.up('xs')]: {
    marginTop: 0,
  },
}))

const useStyles = makeStyles({
  root: {
    width: 'auto',
  },
  nav_item: {
    // textTransform: 'uppercase',
    fontSize: '1rem !important',
    margin: '0 8px',
    border: '1px solid #727272',
    borderRadius: '8px',
    minHeight: '42px',
    '@media (max-width: 500px)': {
      maxWidth: 'auto',
      padding: '6px 0',
      margin: '0 3px',
      fontSize: 12,
    },
    '@media (max-width: 475px)': {
      fontSize: 11,
    },
    '&.Mui-selected': {
      // backgroundColor: '#FF3030',
      border: 'none',
      borderRadius: 0,
      borderBottom: '1px solid #000',
      color: '#000',
    },
  },
  icon: {
    width: 27,
    height: 27,
  },
})

const Profile = () => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const classes = useStyles()
  const [isNotVerified, setNotVerified] = useState(true)
  const {enqueueSnackbar} = useSnackbar()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('1')
  const [user, setUser] = useState([])
  const [gigs, setGigs] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [current_user, setCurrentUser] = useState([])
  const [applyDetails, setApplyDetails] = useState(null)

  const {sendGigNotification} = useSendNotif()
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
    setNotVerified(false)

    const current_user = JSON.parse(local_user)
    const client_id = location.pathname === '/client/profile' ? current_user._id : params.id

    const result = await user_api.get_user_profile_client(client_id)

    if (!result.ok) return setLoading(false)

    let {details, gigs} = result.data
    if (details.length <= 0) {
      enqueueSnackbar('Kindly complete your account details to in order to proceed', {variant: 'warning'})
      return
    }

    setCurrentUser(current_user)
    setUser(details)
    setGigs(gigs)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const SIMPLE_TAB = [{value: 2, label: 'Credentials', disabled: false}]

  const handleClose = () => {
    setOpen(false)
  }

  const handleClick = (values) => {
    setOpen(true)
    setApplyDetails(values)
  }

  const handleApply = async () => {
    setLoading(true)
    let data = {
      status: 'Applying',
      uid: current_user._id,
    }
    const result = await gigs_api.patch_gigs_apply(applyDetails._id, data)

    if (!result.ok) {
      enqueueSnackbar('Something went wrong in applying for this gig', {variant: 'error'})
      setOpen(false)
      return setLoading(false)
    }

    //Create a notification to the client
    await sendGigNotification({
      title: `Gig application`,
      body: `${current_user.name} is applying`,
      targetUsers: [`${applyDetails.uid}`],
      additionalData: result,
      userId: current_user._id,
    })

    //todo
    //Fixed implementation for gig updates
    enqueueSnackbar('Your application has been submitted!', {variant: 'success'})
    setLoading(false)
    setOpen(false)
    navigate(`/gigs/apply/success`, {replace: true})
  }

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

    return <CredentialsTab form={current_user} />
  }

  return (
    <Page title="Profile - Starjobs">
      <MainStyle
        alignItems="center"
        justify="center"
        sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}, width: '100%'}}
      >
        <ProfileStyle>
          {isLoading || isNotVerified ? (
            <Box sx={{sm: {height: '50vh'}, xs: {height: '300px'}}}>
              {isNotVerified && (
                <Box
                  sx={{
                    height: {sm: '50vh', xs: '65vh'},
                    width: {sm: '50%', xs: '100%'},
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{padding: {xs: 3}}}>
                    <Typography variant="h4" sx={{textAlign: 'center'}}>
                      You haven't completed your profile details.
                    </Typography>
                    <Box
                      component="img"
                      src="/static/illustrations/profile-not-active.png"
                      sx={{height: 'auto', width: {xs: '100%'}, mx: 'auto', my: {xs: 5, sm: 5}}}
                    />
                    <Link
                      component={RouterLink}
                      sx={{textDecoration: 'none', width: '100%', display: 'block'}}
                      to={user.accountType === 1 ? '/client/onboard' : '/freelancer/onboard'}
                    >
                      <Button variant="contained" sx={{width: '100%'}} size="large">
                        Complete my details
                      </Button>
                    </Link>
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <>
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
                  px: 0,
                }}
              >
                {/* image */}
                <Box
                  sx={{
                    mr: 1,
                    display: 'flex',
                    alignItems: {md: 'flex-start', sm: 'flex-start', xs: 'center'},
                    px: {sm: 0, xs: 0},
                    mb: 1,
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
                      {capitalCase(`${user.firstName} ${user.middleInitial} ${user.lastName}`)}

                      <Box component="span" sx={{position: 'absolute', right: -40, top: 4}}>
                        <Icon icon={checkmark} width={24} height={24} color="#FF3030" />
                      </Box>
                    </Typography>
                  </Grid>
                </Box>

                {/* introduction */}
                <Box sx={{textAlign: 'justify', mb: 2}}>
                  <Typography variant="body2">
                    "Results-driven professional with repeated success in guiding it projects from start to finish,
                    managing technical support operations and introducing new technologies to promote operational
                    efficiency."
                  </Typography>
                </Box>

                {/* links */}
                <Stack direction="row" sx={{my: 1, width: '100%', textAlign: 'center'}}>
                  <Box sx={{textAlign: 'center', mb: 1, width: '100%'}}>
                    <Icon icon={map} width={24} height={24} color="#FF3030" />
                    <Typography
                      variant="body2"
                      sx={{wordBreak: 'break-all', width: '100px', margin: '0 auto', fontWeight: '600'}}
                    >
                      {user.location}
                    </Typography>
                  </Box>
                  <Box sx={{textAlign: 'center', mb: 1, width: '100%'}}>
                    <Icon icon={globe} width={24} height={24} color="#FF3030" />
                    <Typography
                      variant="body2"
                      sx={{wordBreak: 'break-all', width: '100px', margin: '0 auto', fontWeight: '600'}}
                    >
                      {user.website}
                    </Typography>
                  </Box>
                  <Box item sx={{textAlign: 'center', mb: 1, width: '100%'}}>
                    <Icon icon={envelope} width={24} height={24} color="#FF3030" />
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
                        display: 'none',
                      },
                    }}
                  >
                    {SIMPLE_TAB.map((tab, index) => (
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
                      ...(location.pathname !== '/client/profile' ? {} : {mb: 20}),
                    }}
                  >
                    {SIMPLE_TAB.map((panel, index) => (
                      <TabPanel key={panel.value} value={String(index + 1)} sx={{p: 0}}>
                        {renderTab(panel.value)}
                      </TabPanel>
                    ))}
                  </Card>
                </TabContext>
              </Stack>

              {location.pathname !== '/client/profile' && (
                <>
                  <Divider sx={{mb: 3}} />
                  {/* gigs list */}
                  <Box sx={{mb: 10, padding: {xs: 0}}}>
                    {gigs &&
                      gigs.map((v, k) => {
                        if (v.numberofApplicants >= 5) return ''
                        if (params.category === 'all') {
                          if (v.status === 'Waiting' || v.status === 'Applying') {
                            if (moment(v.time).isBefore(moment(), 'day')) return ''
                            if (!moment(v.from).isValid()) return ''
                            return (
                              <ApplyCard
                                path={location.pathname}
                                key={k}
                                gig={v}
                                accountType={current_user.accountType}
                                isActive={current_user.isActive}
                                onClick={handleClick}
                              />
                            )
                          } else {
                            return ''
                          }
                        } else {
                          if ((v.status === 'Waiting' || v.status === 'Applying') && v.category === params.category) {
                            if (moment(v.time).isBefore(moment(), 'day')) return ''
                            if (!moment(v.from).isValid()) return ''
                            return (
                              <ApplyCard
                                path={location.pathname}
                                key={k}
                                gig={v}
                                accountType={current_user.accountType}
                                isActive={current_user.isActive}
                                onClick={handleClick}
                              />
                            )
                          } else {
                            return ''
                          }
                        }
                      })}
                  </Box>
                </>
              )}
            </>
          )}

          <ConfirmGig open={open} onConfirm={handleApply} handleClose={handleClose} />
        </ProfileStyle>
      </MainStyle>
    </Page>
  )
}

export default Profile
