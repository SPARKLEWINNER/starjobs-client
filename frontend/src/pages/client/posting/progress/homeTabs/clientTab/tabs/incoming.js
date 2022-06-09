import {useState, useEffect} from 'react'
import {Box, Stack, Typography, Card} from '@mui/material'
import moment from 'moment'
import {IncomingCard} from '../../../cards'
import CurrentModalPopup from '../modal'
import {ConfirmLateNotification} from 'src/components/notifications'

// theme
import color from 'src/theme/palette'
import PropTypes from 'prop-types'
import {useSnackbar} from 'notistack'
import gigs_api from 'src/lib/gigs'
import useSendNotif from 'src/utils/hooks/useSendNotif'
import {useNavigate} from 'react-router-dom'

IncomingTab.propTypes = {
  gigs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  user: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selected: PropTypes.string
}

const incoming_status = ['Accepted']

export default function IncomingTab({gigs, user, selected}) {
  const {enqueueSnackbar} = useSnackbar()
  const [confirmArrive, setConfirmArrive] = useState(false)
  const navigate = useNavigate()
  const [FILTERED_DATA, setData] = useState([])
  const [SELECTED_GIG, setSelectedGig] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const {sendGigNotification} = useSendNotif()

  const handleAction = async (value) => {
    if (!user) return
    const {auid: jobster_id} = value

    await sendGigNotification({
      title: `Client confirmed your arrival`,
      body: 'View gig in progress',
      targetUsers: [jobster_id],
      additionalData: value
    })

    let form_data = {
      status: 'Confirm-Arrived',
      uid: user._id,
      late: value.late ?? null
    }

    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }

    enqueueSnackbar('Success informing the jobster', {variant: 'success'})
    navigate('/client/gig/create?tab=1')
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

  const handleArrived = () => {
    setConfirmArrive(!confirmArrive)
  }

  useEffect(() => {
    const processFilter = () => {
      const filtered_gig = gigs.filter((obj) => incoming_status.includes(obj.status))
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
  }, [gigs, selected])

  return (
    <Box sx={{my: 2}}>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Incoming
        </Typography>
      </Stack>
      <Box sx={{px: 1}}>
        {FILTERED_DATA &&
          FILTERED_DATA.map((v, k) => {
            return <IncomingCard gig={v} key={k} onView={() => handleView(v)} />
          })}

        {(!FILTERED_DATA || FILTERED_DATA.length === 0) && (
          <Card sx={{my: 2, p: 4, borderRadius: 1}}>
            <Typography variant="body2" sx={{fontWeight: 'bold', textAlign: 'center'}}>
              No Incoming gigs
            </Typography>
          </Card>
        )}
      </Box>

      {SELECTED_GIG.length !== 0 && (
        <CurrentModalPopup
          gig={SELECTED_GIG || []}
          open={openModal}
          onClick={handleAction}
          onClose={handleCloseView}
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
