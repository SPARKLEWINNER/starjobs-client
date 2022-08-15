import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useSnackbar} from 'notistack'

// components
import {Box, Stack, Typography, Card} from '@mui/material'

// component
import {CurrentCard} from './cards'
import CurrentModalPopup from './modal'

// api
import gigs_api from 'src/lib/gigs'
import useSendNotif from 'src/utils/hooks/useSendNotif'

// theme
import color from 'src/theme/palette'

const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)

const CurrentTab = ({gigs, user, onEndShift}) => {
  const {enqueueSnackbar} = useSnackbar()
  const [FILTERED_GIGS, setFilter] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [SELECTED_GIG, setSelectedGig] = useState([])
  const {sendGigNotification} = useSendNotif()

  const handleAction = async (value) => {
    setLoading(true)
    if (!user) return
    let form_data = {
      status: value.new_status,
      uid: user._id
    }
    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return setLoading(false)
    }

    if (value.new_status === 'Confirm-Arrived') {
      await sendGigNotification({
        title: 'The jobster has arrived.',
        body: 'Check gig in progress',
        targetUsers: [SELECTED_GIG.uid],
        additionalData: SELECTED_GIG
      })
    }

    enqueueSnackbar('Success informing the client', {variant: 'success'})
    setLoading(false)
    window.location.reload()
  }

  const handleEndShift = (value) => {
    onEndShift(value)
  }

  const handleView = (gig) => {
    setOpenModal(true)
    setSelectedGig(gig)
  }

  const handleCloseView = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    const load = () => {
      gigs &&
        gigs.map((value) => {
          const {status, date} = value
          const previousDays = moment().subtract(3, 'days')
          const aheadDays = moment().add(3, 'days')
          const range = moment().range(previousDays, aheadDays)

          if (!range.contains(moment(date))) return false

          switch (status) {
            case 'Confirm-Gig':
            case 'On-the-way':
            case 'Arrived':
            case 'Confirm-Arrived':
            case 'On-going':
            case 'End-Shift':
              return setFilter((prevState) => [...prevState, ...[value]])
            default:
              return false
          }
        })
    }
    load()
  }, [gigs])
  return (
    <Box sx={{mb: 5}}>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Current
        </Typography>
      </Stack>

      {gigs.length === 0 && (
        <Card sx={{px: 2, py: 3, textAlign: 'center'}}>
          <Typography variant="overline">No Current gigs yet.</Typography>
        </Card>
      )}

      {FILTERED_GIGS.length > 0 &&
        FILTERED_GIGS.map((v, k) => (
          <CurrentCard
            key={k}
            gig={v}
            onClick={handleAction}
            isLoading={isLoading}
            onView={handleView}
            onEndShift={handleEndShift}
          />
        ))}
      {SELECTED_GIG.length !== 0 && (
        <CurrentModalPopup
          gig={SELECTED_GIG || []}
          open={openModal}
          onClick={handleAction}
          onClose={handleCloseView}
          onEndShift={handleEndShift}
          loading={isLoading}
        />
      )}
    </Box>
  )
}

CurrentTab.propTypes = {
  gigs: PropTypes.array,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onEndShift: PropTypes.func
}

export default CurrentTab
