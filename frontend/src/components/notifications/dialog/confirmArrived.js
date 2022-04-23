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

import PropTypes from 'prop-types'

export default function ConfirmArrivedNotification({open, gig, onCommit, onReject}) {
  const getFormattedDate = (date) => {
    if (!date) return
    let year = date.getFullYear()
    let month = (1 + date.getMonth()).toString().padStart(2, '0')
    let day = date.getDate().toString().padStart(2, '0')

    return month + '/' + day + '/' + year
  }

  const tConvert = (time) => {
    if (!time) return
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1) // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM' // Set AM/PM
      time[0] = +time[0] % 12 || 12 // Adjust hours
    }
    return time.join('') // return adjusted time or original string
  }

  const handleCommit = (value) => {
    let data = {
      new_status: 'Confirm-Arrived',
      ...value
    }
    onCommit(data)
  }

  const handleReject = (value) => {
    let data = {
      new_status: 'Cancelled',
      ...value
    }
    onReject(data)
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h6" sx={{fontWeight: 'normal'}}>
            Gig Notification!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="#000">
                {gig ? gig.position : ''}
              </Typography>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="#000">
                {gig ? `${getFormattedDate(new Date(gig.date))} ${tConvert(gig.time)}` : ''}{' '}
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Typography variant="body1" sx={{mb: 3, textAlign: 'center'}}>
            Jobster has arrived, confirm arrived?
          </Typography>
          <Stack row>
            <Button color="primary" variant="contained" onClick={() => handleCommit(gig)}>
              Confirm Arrived
            </Button>
            <Button onClick={() => handleReject(gig)} variant="outlined" color="inherit" sx={{mt: 2}}>
              No
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ConfirmArrivedNotification.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  gig: PropTypes.array,
  onCommit: PropTypes.func,
  handleClose: PropTypes.func,
  onReject: PropTypes.func
}
