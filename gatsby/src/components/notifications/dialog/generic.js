import PropTypes from 'prop-types'

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material'
import {navigate} from 'gatsby'
import {useState} from 'react'
import {useAuth} from 'contexts/AuthContext'

const GenericNotification = ({open = false, details = {}, handleClose = () => {}}) => {
  const {currentUser} = useAuth()
  const [show, setShow] = useState(open ?? false)

  const handleOk = () => {
    setShow(false)
    if (currentUser.accountType === 1) {
      navigate(`/client/gig/create?tab=${details.click_action}`)
    } else {
      navigate(`/freelancer/dashboard?tab=${details.click_action}`)
    }
  }

  return (
    <div>
      <Dialog open={show} handleClose={handleClose}>
        <DialogTitle sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h6" sx={{fontWeight: 'normal'}}>
            Notification!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="common.black">
                {details && details.notification ? details.notification.title : ''}
              </Typography>
              {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="#000">{details ? `${getFormattedDate(new Date(gig.date))} ${tConvert(gig.time)}` : ''} </Typography> */}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Stack row>
            <Button color="primary" variant="contained" onClick={handleOk}>
              Ok
            </Button>
            <Button onClick={handleClose} variant="outlined" color="inherit" sx={{mt: 2}}>
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  )
}

GenericNotification.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  details: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleClose: PropTypes.func
}

export default GenericNotification
