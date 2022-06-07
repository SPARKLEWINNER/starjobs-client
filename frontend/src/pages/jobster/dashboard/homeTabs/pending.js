import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSnackbar} from 'notistack'
import PropTypes from 'prop-types'

import {Box, Stack, Typography, Link, Card} from '@mui/material'
import moment from 'moment'
import {PendingCard} from './cards'
import CurrentModalPopup from './modal'

// api
import gigs_api from 'src/lib/gigs'
import useSendNotif from 'src/utils/hooks/useSendNotif'

// theme
import color from 'src/theme/palette'

const PendingTab = ({gigs, user}) => {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const {sendGigNotification} = useSendNotif()

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
        <Stack direction="row" sx={{alignItems: 'center', mb: 2}}>
          <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, flexGrow: 1}}>
            Pending{' '}
          </Typography>
          {gigs.filter(
            (obj) =>
              !moment(obj.date).isBefore(moment(), 'day') && (obj.status === 'Waiting' || obj.status === 'Applying')
          ).length > 5 && (
            <Link href="/pending" sx={{textDecoration: 'none', fontWeight: 400, mb: 0, mr: 2}}>
              More
            </Link>
          )}
        </Stack>
      </Stack>
      {gigs.length === 0 && gigs.filter((obj) => obj.status !== 'Applying' || obj.status !== 'Waiting') && (
        <Card sx={{px: 2, py: 3, textAlign: 'center'}}>
          <Typography variant="overline">No Pending gigs yet.</Typography>
        </Card>
      )}

      <Stack sx={{}}>
        {gigs &&
          gigs.map((v, key) => {
            const {status} = v
            if (status === 'Waiting' || status === 'Applying') {
              return (
                <Box sx={{mb: 1}} key={key}>
                  <PendingCard gig={v} onView={() => handleView(v)} isLoading={isLoading} />
                </Box>
              )
            }
          })}
      </Stack>

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

PendingTab.propTypes = {
  gigs: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  user: PropTypes.object
}

export default PendingTab
