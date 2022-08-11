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
import {ConfirmEndShiftNotification} from 'src/components/notifications'

// api
import gigs_api from 'src/lib/gigs'
import {useAuth} from 'src/contexts/AuthContext'

import {useLocation} from 'react-router-dom'
import useSendNotif from 'src/utils/hooks/useSendNotif'

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
  const [isLoading, setLoading] = useState(false)
  const [value, setValue] = useState('1')
  const {enqueueSnackbar} = useSnackbar()
  const [gigs, setGigs] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [gigConfirm, setConfirmGig] = useState([])
  const {sendGigNotification} = useSendNotif()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
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

      setGigs(data)
    }

    load()

    // eslint-disable-next-line
  }, [])

  const handleEndShift = (value) => {
    setConfirmGig(value)
    setConfirmOpen(true)
  }

  const handleEndShiftClose = () => {
    setConfirmOpen(false)
  }

  const handleConfirmEndShift = async (values) => {
    setLoading(true)
    let form_data = {
      status: 'Confirm-End-Shift',
      uid: gigConfirm.auid,
      late: parseFloat(values.timeLate).toFixed(2) ?? null
    }
    try {
      const result = await gigs_api.patch_gigs_apply(gigConfirm._id, form_data)
      if (!result.ok) {
        enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
        return
      }

      await sendGigNotification({
        title: 'Gig success',
        body: 'To monitor gig fee View gig in progress',
        targetUsers: [gigConfirm.auid],
        additionalData: values
      })

      await sendGigNotification({
        title: 'Gig success',
        body: 'To monitor gig fee View gig in progress',
        targetUsers: [values.uid],
        additionalData: values
      })

      setConfirmOpen(false)
      await toggleDrawer(true, gigConfirm._id)
      enqueueSnackbar('Success confirmed gig has ended', {variant: 'success'})
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(true)
    }
  }

  const renderTab = (type) => {
    if (type === 1) return <IncomingTab gigs={gigs} user={currentUser} key="incoming" />
    if (type === 2) return <PendingTab gigs={gigs} key="pending" />
    if (type === 3) return <BillingTab gigs={gigs} key="billing" />

    return <CurrentTab gigs={gigs} user={currentUser} key="current" onEndShift={handleEndShift} />
  }

  return (
    <>
      <TabContext id="tabs" value={value}>
        <TabList
          id="pending"
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {SIMPLE_TAB.map((tab, index) => (
            <Tab
              id="pendingTabButton"
              className={classes.nav_item}
              key={tab.value}
              label={tab.label}
              value={String(index + 1)}
            />
          ))}
        </TabList>
        {SIMPLE_TAB.map((panel, index) => (
          <TabPanel id="tab" key={panel.value} value={String(index + 1)} sx={{p: '0 !important'}}>
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
        loading={isLoading}
      />
    </>
  )
}
