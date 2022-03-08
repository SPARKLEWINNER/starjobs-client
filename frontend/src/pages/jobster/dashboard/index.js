import {useState, useEffect, useContext} from 'react'
import {useSnackbar} from 'notistack5'
import moment from 'moment'

// material
import {Box, Typography, Stack, Avatar, Card, Link} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'

// icons
import {Icon} from '@iconify/react'
import arrowRight from '@iconify/icons-eva/arrow-forward-outline'

// component
import Page from 'components/Page'
import {PendingTab, IncomingTab, CurrentTab} from './homeTabs'
import {IncomingNotification, EndShiftNotification} from 'components/notifications'

// api
import gigs_api from 'utils/api/gigs'
import storage from 'utils/storage'
import {UsersContext} from 'utils/context/users'

// variable
const DRAWER_WIDTH = 280
const image_bucket = process.env.REACT_APP_IMAGE_URL

const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const Dashboard = () => {
  const {enqueueSnackbar} = useSnackbar()
  const [gigs, setGigs] = useState([])
  const [gigPop, setGigPop] = useState([])
  const [current_user, setUser] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [gigConfirm, setConfirmGig] = useState([])
  const [reports, setReports] = useState([])
  const {user} = useContext(UsersContext)

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return

      const user = JSON.parse(local_user)
      setUser(user)

      const result = await gigs_api.get_gigs_history()
      if (!result.ok) {
        enqueueSnackbar('Unable to load your Gig History', {variant: 'error'})
        return
      }

      const data = result.data.gigs.sort((a, b) =>
        moment(a.date + ' ' + a.time) > moment(b.date + ' ' + b.time) ? 1 : -1,
      )
      checkNotice(data)
      setGigs(data)
      setReports(result.data.reports)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkNotice = (data) => {
    const incoming = data.filter((obj) => obj['status'].includes('Accepted'))
    console.log('incoming')
    if (!incoming) return
    Object.values(incoming).forEach((value) => {
      if (value.auid !== current_user._id) return
      if (moment(value.date).isBefore(moment(), 'day')) return
      if (moment(value.date).isSame(moment(), 'day')) {
        handleNotice(value)
      }
    })
  }

  const handleNotice = (value) => {
    setOpen(true)
    setGigPop(value)
  }

  const handleNoticeClose = () => {
    setOpen(false)
  }

  const handleAccepted = async (value) => {
    let form_data = {
      status: value.new_status,
      uid: current_user._id,
    }

    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }

    enqueueSnackbar('Success informing the client you are pushing through', {variant: 'success'})
    setOpen(false)
    window.location.reload()
  }

  const handleCancelled = async (value) => {
    let form_data = {
      status: value.new_status,
      uid: current_user._id,
    }

    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }

    enqueueSnackbar('Success informing the client that you are not pushing through', {variant: 'success'})
    setOpen(false)
    window.location.reload()
  }

  const handleEndShift = (value) => {
    setConfirmGig(value)
    setConfirmOpen(true)
  }

  const handleEndShiftClose = () => {
    setConfirmOpen(false)
  }

  const handleConfirmEndShift = async (value) => {
    let form_data = {
      status: 'End-Shift',
      uid: gigConfirm.auid,
    }

    const result = await gigs_api.patch_gigs_apply(gigConfirm._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }

    enqueueSnackbar('Success informing the client you are pushing through', {variant: 'success'})
    setOpen(false)
    window.location.reload()
  }

  return (
    <Page title="Dashboard | Starjobs">
      <MainStyle sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}, justifyContent: 'flex-start'}}>
        <Stack direction={{xs: 'column', md: 'column'}} sx={{mb: 10}}>
          <Stack direction="row">
            <Box sx={{flexGrow: 1}}>
              <Typography variant="body1" sx={{letterSpacing: 'initial'}}>
                Hello
              </Typography>
              <Typography variant="h5" sx={{fontWeight: 'bold', letterSpacing: 'initial'}}>
                {user.name}
              </Typography>
            </Box>
            <Box>
              {user['photo'] && (
                <Avatar
                  key={'Profile Picture'}
                  alt="Picture"
                  src={`${image_bucket}${user.photo}`}
                  sx={{margin: '0 auto', width: 60, height: 60, objectFit: 'cover', objectPosition: 'center'}}
                />
              )}
              {!user['photo'] && (
                <Avatar
                  key={'Profile Picture'}
                  alt="Picture"
                  src="/static/mock-images/avatars/avatar_24.jpg"
                  sx={{margin: '0 auto', width: 60, height: 60, objectFit: 'cover', objectPosition: 'center'}}
                />
              )}
            </Box>
          </Stack>

          <Stack direction="row" sx={{alignItems: 'center', my: 3}}>
            <Card
              sx={{
                px: 2,
                py: 1,
                height: 100,
                width: '49%',
                mr: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 1,
                borderRight: '4px solid',
                borderColor: 'info.light',
                transition: 'all 0.8s ease',
                cursor: 'pointer',
                '& .icons': {
                  transition: 'all 0.4s ease',
                },
                '&:hover': {
                  '& .icons': {
                    transition: 'all 0.4s ease',
                    transform: 'translateX(6px)',
                  },
                },
              }}
            >
              <Box>
                <Typography variant="h4">{reports ? reports.numberOfApplied : 0}</Typography>
                <Typography variant="body2" sx={{fontWeight: '400', width: '12s0px', wordBreak: 'break-all'}}>
                  Total Gigs Applied
                </Typography>
                <Box sx={{position: 'absolute', bottom: 16, right: 10}} className="icons">
                  <Icon width={24} height={24} icon={arrowRight} />
                </Box>
              </Box>
            </Card>
            <Card
              sx={{
                px: 2,
                py: 1,
                height: 100,
                width: '49%',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 1,
                borderRight: '4px solid',
                borderColor: 'success.main',
                transition: 'all 0.8s ease',
                cursor: 'pointer',
                '& .icons': {
                  transition: 'all 0.4s ease',
                },
                '&:hover': {
                  '& .icons': {
                    transition: 'all 0.4s ease',
                    transform: 'translateX(6px)',
                  },
                },
              }}
            >
              <Box>
                <Link
                  href="/freelancer/history"
                  sx={{
                    color: 'common.black',
                    textDecoration: 'none',
                  }}
                >
                  <Typography variant="h4">{reports ? reports.numberOfCompleted : 0}</Typography>
                  <Typography variant="body2" sx={{fontWeight: '400', width: '120px', wordBreak: 'break-all'}}>
                    Gigs Completed
                  </Typography>
                  <Box sx={{position: 'absolute', bottom: 16, right: 10}} className="icons">
                    <Icon width={24} height={24} icon={arrowRight} />
                  </Box>
                </Link>
              </Box>
            </Card>
          </Stack>

          <CurrentTab gigs={gigs} user={current_user} key="CurrentTabs" onEndShift={handleEndShift} />
          <IncomingTab gigs={gigs} user={current_user} key="IncomingTabs" />
          <PendingTab gigs={gigs} key="PendingTabs" />
        </Stack>

        <EndShiftNotification
          open={confirmOpen}
          handleClose={handleEndShiftClose}
          gig={gigConfirm}
          onCommit={handleConfirmEndShift}
        />

        <IncomingNotification
          open={open}
          handleClose={handleNoticeClose}
          gig={gigPop}
          onCommit={handleAccepted}
          onReject={handleCancelled}
        />
      </MainStyle>
    </Page>
  )
}

export default Dashboard
