import {useState, useEffect} from 'react'
import {Box, Stack, Typography, Card} from '@material-ui/core'
import moment from 'moment'
import {useSnackbar} from 'notistack5'
import AliceCarousel from 'react-alice-carousel'
import {CurrentCard} from './../cards'
import CurrentModalPopup from './../modal'

// api
import gigs_api from 'utils/api/gigs'

// theme
import color from 'theme/palette'

const responsive = {
  0: {items: 1},
  568: {items: 1},
  1024: {items: 2},
}

export default function CurrentTab({gigs, user, onEndShift}) {
  const {enqueueSnackbar} = useSnackbar()
  const [FILTERED_GIGS, setFilter] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [SELECTED_GIG, setSelectedGig] = useState([])
  const handleAction = async (value) => {
    setLoading(true)
    if (!user) return
    let form_data = {
      status: value.new_status,
      uid: user._id,
    }

    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return setLoading(false)
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
          const now = moment(new Date())
          const {status, from, date} = value
          if (!moment(date).isSame(moment(), 'day')) return false
          switch (status) {
            case 'Accepted':
            case 'Confirm-Gig':
            case 'On-the-way':
            case 'Arrived':
            case 'Confirm-Arrived':
            case 'On-going':
            case 'End-Shift':
            case 'Confirm-End-Shift':
              if (status === 'Confirm-End-Shift') return false
              const diff = moment(from).diff(now)

              //express as a duration
              const diffDuration = moment.duration(diff)
              if (diffDuration.hours() > 3) return false
              return setFilter((prevState) => [...prevState, ...[value]])
            default:
              return false
          }
        })
    }
    load()
  }, [gigs])
  return (
    <Box sx={{my: 5}}>
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

      <AliceCarousel
        mouseTracking
        responsive={responsive}
        controlsStrategy="alternate"
        disableDotsControls={true}
        disableButtonsControls={true}
      >
        {FILTERED_GIGS.length > 0 &&
          FILTERED_GIGS.map((v, k) => (
            <CurrentCard
              key={k}
              gig={v}
              onClick={handleAction}
              isLoading={isLoading}
              onView={() => handleView(v)}
              onEndShift={handleEndShift}
            />
          ))}
      </AliceCarousel>
      {SELECTED_GIG.length !== 0 && (
        <CurrentModalPopup
          gig={SELECTED_GIG || []}
          open={openModal}
          onClick={handleAction}
          onClose={handleCloseView}
          onEndShift={handleEndShift}
        />
      )}
    </Box>
  )
}
