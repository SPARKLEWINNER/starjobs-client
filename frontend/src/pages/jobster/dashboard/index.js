import {useState, useEffect} from 'react'
import {useSnackbar} from 'notistack5'
import moment from 'moment'

// material
import {Stack} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'

// component
import Page from 'components/Page'
import {PendingTab, IncomingTab, CurrentTab} from './homeTabs'
import {IncomingNotification, EndShiftNotification} from 'components/notifications'

// api
import gigs_api from 'utils/api/gigs'
import storage from 'utils/storage'

// variable
const DRAWER_WIDTH = 280

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
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkNotice = (data) => {
    const incoming = data.filter((obj) => obj['status'].includes('Accepted'))
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
