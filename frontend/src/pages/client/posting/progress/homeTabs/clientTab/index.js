import {useState, useEffect, useContext} from 'react'
import {useSnackbar} from 'notistack5'
import moment from 'moment'

// material
import {Stack} from '@material-ui/core'

// context
import {RatingsContext} from 'utils/context/rating'

// component
import {PendingTab, IncomingTab, CurrentTab} from './tabs'
import {IncomingNotification, ConfirmEndShiftNotification} from 'components/notifications'

// api
import gigs_api from 'utils/api/gigs'
import storage from 'utils/storage'

export default function TabsComponent() {
  const {toggleDrawer} = useContext(RatingsContext)
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

      const result = await gigs_api.get_gigs_client()
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
    if (!data) return
    const arrived = data.filter((obj) => obj['status'] && obj['status'].includes('Arrived'))
    if (!arrived) return
    Object.values(arrived).forEach((value) => {
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
      status: 'Confirm-End-Shift',
      uid: gigConfirm.auid,
    }

    const result = await gigs_api.patch_gigs_apply(gigConfirm._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }
    setConfirmOpen(false)
    await toggleDrawer(true, gigConfirm._id)
    enqueueSnackbar('Success informing the client you are pushing through', {variant: 'success'})
    setOpen(false)
  }

  return (
    <>
      <Stack spacing={3} sx={{width: '100%', mb: 20}} direction="column">
        <CurrentTab gigs={gigs} user={current_user} key="current" onEndShift={handleEndShift} />
        <IncomingTab gigs={gigs} user={current_user} key="incoming" />
        <PendingTab gigs={gigs} key="pending" />
      </Stack>

      <ConfirmEndShiftNotification
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
    </>
  )
}
