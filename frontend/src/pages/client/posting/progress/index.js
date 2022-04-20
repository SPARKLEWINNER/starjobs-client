import {useState, useEffect} from 'react'

import moment from 'moment'
import {useSnackbar} from 'notistack5'

// material
import {Stack} from '@material-ui/core'
// import {TabContext, TabList, TabPanel} from '@material-ui/lab'
import {styled} from '@material-ui/core/styles'

// components
// import Page from 'components/Page'
import {
  // JobsterTab,
  ClientTab,
} from './homeTabs'
import {IncomingNotification, ConfirmArrivedNotification} from 'components/notifications'

// api
import gigs_api from 'api/gigs'
import {useAuth} from 'utils/context/AuthContext'

// variables
const DRAWER_WIDTH = 280

// styles
const MainStyle = styled(Stack)(({theme}) => ({
  marginTop: '0',
  marginBottom: '280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const TabStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const Dashboard = () => {
  const {currentUser} = useAuth()
  const {enqueueSnackbar} = useSnackbar()
  const [gigs, setGigs] = useState([])
  const [gigPop, setGigPop] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmArrivedOpen, setConfirmArrivedOpen] = useState(false)

  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      const result = await gigs_api.get_gigs_client()
      if (!result.ok) {
        enqueueSnackbar('Unable to load your Gig History', {variant: 'error'})
        return
      }

      const data = result.data.gigs.sort((a, b) =>
        moment(a.date + ' ' + a.time) > moment(b.date + ' ' + b.time) ? 1 : -1,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  const checkNotice = (data) => {
    const arrived = data.filter((obj) => obj['status'].includes('Arrived'))
    if (!arrived) return
    Object.values(arrived).forEach((value) => {
      if (value.uid !== currentUser._id) return
      if (moment(value.date).isBefore(moment(), 'day')) return
      if (moment(value.date).isSame(moment(), 'day')) {
        handleNotice(value)
        setGigPop(value)
      }
    })
  }

  const handleNotice = (value) => {
    if (value.status === 'Arrived') {
      setConfirmArrivedOpen(true)
    }
  }

  const handleNoticeClose = () => {
    setOpen(false)
  }

  const handleAccepted = async (value) => {
    let form_data = {
      status: value.new_status,
      uid: currentUser._id,
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
      uid: currentUser._id,
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

  return (
    <>
      <MainStyle sx={{my: 2, justifyContent: 'flex-start'}}>
        <TabStyle>
          <ClientTab gigs={gigs} user={currentUser} key="ClientTab" />

          <ConfirmArrivedNotification
            open={confirmArrivedOpen}
            handleClose={handleNoticeClose}
            gig={gigPop}
            onCommit={handleAccepted}
            onReject={handleCancelled}
          />
          <IncomingNotification
            open={open}
            handleClose={handleNoticeClose}
            gig={gigPop}
            onCommit={handleAccepted}
            onReject={handleCancelled}
          />
        </TabStyle>
      </MainStyle>
    </>
  )
}

export default Dashboard
