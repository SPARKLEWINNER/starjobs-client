import React, {useState, useEffect} from 'react'
import {useSnackbar} from 'notistack'
import moment from 'moment'
import {navigate} from '@reach/router'

// material
import {Stack, Tab} from '@mui/material'
import {styled} from '@mui/material/styles'
import {makeStyles} from '@mui/styles'
import {TabContext, TabList, TabPanel} from '@mui/lab'

// component
import Page from 'components/Page'
import CurrentTab from './homeTabs/current'
import IncomingTab from './homeTabs/incoming'
import PendingTab from './homeTabs/pending'
import ReceiveTab from './homeTabs/receive'
import {EndShiftNotification} from 'components/notifications'

// api
import gigs_api from 'libs/endpoints/gigs'
import {useAuth} from 'contexts/AuthContext'
import useSendNotif from 'utils/hooks/useSendNotif'

// variable
const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

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
  {value: 3, label: 'For Payment', disabled: false}
]

const Dashboard = () => {
  const {currentUser} = useAuth()
  const params = window.location
  const classes = useStyles()
  const {enqueueSnackbar} = useSnackbar()
  const [gigs, setGigs] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [gigConfirm, setConfirmGig] = useState([])
  const [value, setValue] = useState('1')
  const {sendGigNotification} = useSendNotif()

  useEffect(() => {
    const load = async () => {
      if (params?.search) {
        const get_tab = params?.search?.split('?tab=')[1]
        if (get_tab === 'undefined') {
          setValue('1')
        } else {
          setValue(get_tab)
        }
      }

      const result = await gigs_api.get_gigs_history()
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
      status: 'End-Shift',
      uid: gigConfirm.auid,
      actualTime: values.actualTime,
      actualRate: values.actualRate
    }

    try {
      const result = await gigs_api.patch_gigs_apply(gigConfirm._id, form_data)
      if (!result.ok) {
        enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
        return
      }
      await sendGigNotification({
        title: `${currentUser.name} has indicated end-shift`,
        body: 'Check gig in progress',
        targetUsers: [values.uid],
        additionalData: values
      })
      enqueueSnackbar('Success informing the client you have ended your shift', {variant: 'success'})
      navigate('/freelancer/dashboard?tab=1')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const renderTab = (type) => {
    if (type === 1) return <IncomingTab gigs={gigs} user={currentUser} key="incoming" />
    if (type === 2) return <PendingTab gigs={gigs} key="pending" />
    if (type === 3) return <ReceiveTab gigs={gigs} key="receive" />
    return <CurrentTab gigs={gigs} user={currentUser} key="current" onEndShift={handleEndShift} />
  }

  return (
    <Page title="Dashboard | Starjobs">
      <MainStyle sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}, justifyContent: 'flex-start'}}>
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
            <TabPanel key={panel.value} value={String(index + 1)} sx={{p: '0 !important', my: 4}}>
              {renderTab(panel.value)}
            </TabPanel>
          ))}
        </TabContext>

        <EndShiftNotification
          open={confirmOpen}
          handleClose={handleEndShiftClose}
          gig={gigConfirm}
          onCommit={handleConfirmEndShift}
          loading={isLoading}
        />
      </MainStyle>
    </Page>
  )
}

export default Dashboard
