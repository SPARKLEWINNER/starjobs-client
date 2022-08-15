import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'
import {useSnackbar} from 'notistack'
import {Box, Stack, Typography, Card} from '@mui/material'
import moment from 'moment'

import {IncomingCard} from './cards'
import CurrentModalPopup from './modal'

// theme
import color from 'src/theme/palette'

import gigs_api from 'src/lib/gigs'
import useSendNotif from 'src/utils/hooks/useSendNotif'

const IncomingTab = ({gigs, user}) => {
  const navigate = useNavigate()
  const {sendGigNotification} = useSendNotif()

  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const [SELECTED_GIG, setSelectedGig] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const handleAction = async (value) => {
    setLoading(true)
    if (!user) return
    const {new_status, uid: client_id} = value

    if (new_status === 'Confirm-Gig') {
      await sendGigNotification({
        title: `${user.name} is pushing through`,
        body: 'Check gig in progress',
        targetUsers: [client_id],
        additionalData: value
      })
    }

    if (new_status === 'Confirm-Arrived') {
      await sendGigNotification({
        title: 'The Jobster has arrived.',
        body: 'Check gig in progress',
        targetUsers: [client_id],
        additionalData: value
      })
    }

    let form_data = {
      status: value.new_status,
      uid: user._id
    }
    try {
      const result = await gigs_api.patch_gigs_apply(value._id, form_data)
      if (!result.ok) return enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})

      enqueueSnackbar('Success informing the client', {variant: 'success'})
      navigate('/freelancer/dashboard?tab=1')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (gig) => {
    setOpenModal(true)
    const get_gig_details = await gigs_api.get_gig_details(gig._id)
    if (!get_gig_details.ok) return enqueueSnackbar('Unable to get gig details', {variant: 'error'})
    setSelectedGig(get_gig_details.data)
  }

  const handleCloseView = () => {
    setOpenModal(false)
  }

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Incoming
        </Typography>
      </Stack>
      {gigs.length === 0 && (
        <Card sx={{px: 2, py: 3, textAlign: 'center'}}>
          <Typography variant="overline">No Incoming Gigs yet.</Typography>
        </Card>
      )}
      {gigs &&
        gigs.map((value, k) => {
          const {status, from, auid} = value
          if (status === 'Accepted') {
            if (moment(from).isBefore(moment(), 'day')) return ''
            if (auid !== user._id) return ''
            return (
              <Box sx={{my: 1}} key={`box - ${k}`}>
                <IncomingCard gig={value} onView={() => handleView(value)} />
              </Box>
            )
          }
        })}

      {SELECTED_GIG.length !== 0 && (
        <CurrentModalPopup
          gig={SELECTED_GIG || []}
          open={openModal}
          onClick={handleAction}
          onClose={handleCloseView}
          loading={isLoading}
        />
      )}
    </Box>
  )
}

IncomingTab.propTypes = {
  gigs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  user: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
}

export default IncomingTab
