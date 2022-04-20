import {useState, useEffect} from 'react'
import {useSnackbar} from 'notistack5'
import moment from 'moment'
import {useLocation, useNavigate} from 'react-router-dom'

// material
import {Stack, Tab} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {makeStyles} from '@material-ui/styles'
import {TabContext, TabList, TabPanel} from '@material-ui/lab'

// component
import Page from 'components/Page'
import {PendingTab, IncomingTab, CurrentTab} from './homeTabs'
import {IncomingNotification, EndShiftNotification} from 'components/notifications'

// api
import gigs_api from 'api/gigs'
import storage from 'utils/storage'

// variable
const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
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
      fontSize: 12,
    },
    '@media (max-width: 475px)': {
      fontSize: 11,
    },
  },
})

const SIMPLE_TAB = [
  {value: 0, label: 'Current ', disabled: false},
  {value: 1, label: 'Incoming ', disabled: false},
  {value: 2, label: 'Pending ', disabled: false},
  {value: 3, label: 'For Receive', disabled: false},
]

const Dashboard = () => {
  const navigate = useNavigate()
  const params = useLocation()
  const classes = useStyles()
  const {enqueueSnackbar} = useSnackbar()
  const [gigs, setGigs] = useState([])
  const [gigPop, setGigPop] = useState([])
  const [current_user, setUser] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [gigConfirm, setConfirmGig] = useState([])
  const [value, setValue] = useState('1')

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
    navigate('/freelancer/dashboard?tab=1')
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
    navigate('/freelancer/dashboard?tab=1')
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
    navigate('/freelancer/dashboard?tab=1')
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const renderTab = (type) => {
    if (type === 1) return <IncomingTab gigs={gigs} user={current_user} key="incoming" />
    if (type === 2) return <PendingTab gigs={gigs} key="pending" />
    return <CurrentTab gigs={gigs} user={current_user} key="current" onEndShift={handleEndShift} />
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
