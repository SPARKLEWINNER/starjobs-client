import {useState, useEffect, useContext} from 'react'
import {useSnackbar} from 'notistack'
import moment from 'moment'

// material
import {Stack, Tab} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {TabContext, TabList, TabPanel} from '@mui/lab'

// context
import {RatingsContext} from 'src/contexts/rating'

// component
import {PendingTab, IncomingTab, CurrentTab, BillingTab} from './tabs'
import {IncomingNotification, ConfirmEndShiftNotification} from 'src/components/notifications'

// api
import gigs_api from 'src/lib/gigs'
import {useAuth} from 'src/contexts/AuthContext'

import {useLocation} from 'react-router-dom'

const useStyles = makeStyles({
  nav_item: {
    textTransform: 'uppercase',
    margin: '0 4px',
    borderRadius: '8px',
    minHeight: '42px',
    '@media (max-width: 500px)': {
      padding: '6px 0',
      margin: '0 3px',
      fontSize: 12
    },
    '@media (max-width: 475px)': {
      fontSize: 11
    }
  }
})

const SIMPLE_TAB = [
  {value: 0, label: 'Current ', disabled: false},
  {value: 1, label: 'Incoming ', disabled: false},
  {value: 2, label: 'Pending ', disabled: false},
  {value: 3, label: 'For Billing', disabled: false}
]

export default function TabsComponent() {
  const {currentUser} = useAuth()
  const params = useLocation()
  const classes = useStyles()
  const {toggleDrawer} = useContext(RatingsContext)
  const [value, setValue] = useState('1')
  const {enqueueSnackbar} = useSnackbar()
  const [gigs, setGigs] = useState([])
  const [gigPop, setGigPop] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [gigConfirm, setConfirmGig] = useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      if (params?.search) {
        setValue(params?.search?.split('?tab=')[1])
      }
      const result = await gigs_api.get_gigs_client()
      if (!result.ok) {
        enqueueSnackbar('Unable to load your Gig History', {variant: 'error'})
        return
      }

      const data = result.data.gigs.sort((a, b) =>
        moment(a.date + ' ' + a.time) > moment(b.date + ' ' + b.time) ? 1 : -1
      )
      if (componentMounted) {
        checkNotice(data)
        setGigs(data)
      }
    }

    load()
    return () => {
      componentMounted = false
    }
    // eslint-disable-next-line
  }, [])

  const checkNotice = (data) => {
    if (!data) return
    const arrived = data.filter((obj) => obj['status'] && obj['status'].includes('Arrived'))
    if (!arrived) return
    Object.values(arrived).forEach((value) => {
      if (value.auid !== currentUser._id) return
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
      uid: currentUser._id
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
      uid: currentUser._id
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

  const handleConfirmEndShift = async () => {
    let form_data = {
      status: 'Confirm-End-Shift',
      uid: gigConfirm.auid
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

  const renderTab = (type) => {
    if (type === 1) return <IncomingTab gigs={gigs} user={currentUser} key="incoming" />
    if (type === 2) return <PendingTab gigs={gigs} key="pending" />
    if (type === 3) return <BillingTab gigs={gigs} key="billing" />

    return <CurrentTab gigs={gigs} user={currentUser} key="current" onEndShift={handleEndShift} />
  }

  return (
    <>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {SIMPLE_TAB.map((tab, index) => (
            <Tab className={classes.nav_item} key={tab.value} label={tab.label} value={String(index + 1)} />
          ))}
        </TabList>
        {SIMPLE_TAB.map((panel, index) => (
          <TabPanel key={panel.value} value={String(index + 1)} sx={{p: '0 !important'}}>
            {renderTab(panel.value)}
          </TabPanel>
        ))}
      </TabContext>

      <Stack spacing={3} sx={{width: '100%', mb: 20}} direction="column"></Stack>

      <ConfirmEndShiftNotification
        open={confirmOpen}
        handleClose={handleEndShiftClose}
        gig={gigConfirm}
        onCommit={handleConfirmEndShift}
      />

      <IncomingNotification
        open={open ?? false}
        handleClose={handleNoticeClose}
        gig={gigPop}
        onCommit={handleAccepted}
        onReject={handleCancelled}
      />
    </>
  )
}
