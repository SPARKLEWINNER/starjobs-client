import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Link as RouterLink, useNavigate} from 'react-router-dom'
import {Box, Stack, Typography, Grid, Link, Card} from '@mui/material'
import {useSnackbar} from 'notistack'
import {ConfirmLateNotification} from 'src/components/notifications'

// components
import {CurrentCard} from '../../../cards'
import CurrentModalPopup from '../modal'

// api
import gigs_api from 'src/lib/gigs'

// theme
import color from 'src/theme/palette'
import useSendNotif from 'src/utils/hooks/useSendNotif'

const Moment = require('moment')
const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(Moment)

// status
const current_status = [
  'Confirm-Gig',
  'On-the-way',
  'Arrived',
  'Confirm-Arrived',
  'On-going',
  'End-Shift',
  'Confirm-End-Shift'
]

const CurrentTab = ({gigs, user, onEndShift}) => {
  const {enqueueSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const [FILTERED_DATA, setData] = useState([])
  const [SELECTED_GIG, setSelectedGig] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [confirmArrive, setConfirmArrive] = useState(false)
  const {sendGigNotification} = useSendNotif()

  const handleAction = async (value) => {
    if (!user) return

    const {auid: jobster_id} = value

    if (value.status === 'Confirm-Gig') {
      await sendGigNotification({
        title: `Client confirmed your arrival`,
        body: 'View gig in progress',
        targetUsers: [jobster_id],
        additionalData: value
      })
    }

    let form_data = {
      status: 'Confirm-Arrived',
      uid: user._id,
      late: parseFloat(value.timeLate).toFixed(2) ?? null
    }

    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }

    enqueueSnackbar('Success informing the jobster', {variant: 'success'})
    navigate('/client/gig/create?tab=1')
  }

  const handleEndShift = (value) => {
    setOpenModal(false)
    onEndShift(value)
  }

  const handleArrived = () => {
    setConfirmArrive(!confirmArrive)
  }

  const handleView = async (gig) => {
    const get_gig_details = await gigs_api.get_gig_details(gig._id)
    if (!get_gig_details.ok) return enqueueSnackbar('Unable to get gig details', {variant: 'error'})
    setSelectedGig(get_gig_details.data)
    if (!get_gig_details.data.isExtended) {
      return setOpenModal(true)
    }
  }

  const handleCloseView = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    const processFilter = () => {
      const filtered_gig = gigs.filter((obj) => current_status.includes(obj.status))
      const data = []
      filtered_gig &&
        filtered_gig.map((value) => {
          const {date} = value

          const previousDays = moment().subtract(3, 'days')
          const aheadDays = moment().add(3, 'days')
          const range = moment().range(previousDays, aheadDays)

          if (!range.contains(moment(date))) return false
          return data.push(value)
        })
      setData(data)
    }

    processFilter()
    // eslint-disable-next-line
  }, [gigs])

  return (
    <Box sx={{my: 2}}>
      <Stack spacing={3}>
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
              Current
            </Typography>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
            <Link
              underline="none"
              component={RouterLink}
              to={`/client/my-activity`}
              sx={{textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem'}}
              color="starjobs.main"
            >
              See all
            </Link>
          </Grid>
        </Grid>
      </Stack>

      {FILTERED_DATA &&
        FILTERED_DATA.map((v, k) => {
          if (v.status === 'Confirm-End-Shift') return ''
          return (
            <CurrentCard
              key={k}
              gig={v}
              onClick={handleAction}
              onView={() => handleView(v)}
              onEndShift={handleEndShift}
            />
          )
        })}

      {(!FILTERED_DATA || FILTERED_DATA.length === 0) && (
        <Card sx={{my: 2, p: 4, borderRadius: 1}}>
          <Typography variant="body2" sx={{fontWeight: 'bold', textAlign: 'center'}}>
            No Current gigs
          </Typography>
        </Card>
      )}

      {SELECTED_GIG.length !== 0 && (
        <CurrentModalPopup
          gig={SELECTED_GIG || []}
          open={openModal}
          onClose={handleCloseView}
          onEndShift={handleEndShift}
          onArrived={handleArrived}
        />
      )}

      <ConfirmLateNotification
        open={confirmArrive}
        gig={SELECTED_GIG}
        handleClose={() => setConfirmArrive(false)}
        onClick={handleAction}
      />
    </Box>
  )
}

CurrentTab.propTypes = {
  gigs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  user: PropTypes.object,
  onEndShift: PropTypes.func
}

export default CurrentTab
