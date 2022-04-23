import {useEffect, useState} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {Box, Stack, Typography, Grid, Link, Card} from '@mui/material'
import moment from 'moment'
import {useSnackbar} from 'notistack'

// components
import {CurrentCard} from '../../../cards'
import CurrentModalPopup from '../modal'

// api
import gigs_api from 'src/lib/gigs'
import PropTypes from 'prop-types'

// theme
import color from 'src/theme/palette'

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
  const [FILTERED_DATA, setData] = useState([])
  const [SELECTED_GIG, setSelectedGig] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const handleAction = async (value) => {
    if (!user) return
    let form_data = {
      status: value.new_status,
      uid: user._id
    }

    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }

    enqueueSnackbar('Success informing the client', {variant: 'success'})
    window.location.reload()
  }

  const handleEndShift = (value) => {
    setOpenModal(false)
    onEndShift(value)
  }

  const handleView = async (gig) => {
    const get_gig_details = await gigs_api.get_gig_details(gig._id)
    if (!get_gig_details.ok) return enqueueSnackbar('Unable to get gig details', {variant: 'error'})
    if (!get_gig_details.data.isExtended) {
      setOpenModal(true)
      setSelectedGig(get_gig_details.data)
      return
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
          const {from} = value
          if (moment(from).isBefore(moment(), 'day')) return ''
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
          onClick={handleAction}
          onClose={handleCloseView}
          onEndShift={handleEndShift}
        />
      )}
    </Box>
  )
}

CurrentTab.propTypes = {
  gigs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  user: PropTypes.object,
  onEndShift: PropTypes.func
}

export default CurrentTab
