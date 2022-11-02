import React, {useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  TextField
} from '@mui/material'

import PropTypes from 'prop-types'

export default function ConfirmArrivedNotification({open, gig, onClick, handleClose}) {
  const [hoursLate, setHoursLate] = useState(undefined)
  const [isLate, setLate] = useState(false)

  const handleCommit = (value) => {
    if (isLate && !hoursLate) return
    let data = {
      new_status: 'Confirm-Arrived',
      timeLate: JSON.parse(hoursLate),
      ...value
    }
    onClick(data)
    handleClose()
  }

  const handleChangeValue = (event) => {
    console.log(event.target.value)
    setHoursLate(event.target.value)
  }

  return (
    <Dialog open={open ?? false} fullWidth={true}>
      <DialogTitle sx={{textAlign: 'center', pt: 5}}>
        <Typography variant="h4" component="span" sx={{fontWeight: 'bold'}}>
          Confirm Arrived
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{mb: 3, textAlign: 'center', fontWeight: '400'}}>
          Did the Jobster arrived on-time?
        </Typography>
        {isLate && (
          <Box>
            <Typography sx={{mt: 2}} variant="h6">
              No. of hour/minutes the jobster is late.{' '}
            </Typography>
            <TextField
              key="gig-rate"
              label="Hours and minutes"
              sx={{width: '100%', mt: 2}}
              onChange={handleChangeValue}
              error={!hoursLate}
              type="number"
            />
            <Typography sx={{my: 2}} variant="caption">
              (ex 1.30 = 1 hour and 30 minutes)
            </Typography>
            {!hoursLate && (
              <Typography sx={{my: 2}} variant="body2" color="red">
                Kindly indicate the number of hours/minute the jobster is late.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
        <Stack>
          <Button color="primary" variant="contained" size="large" onClick={() => handleCommit(gig)}>
            {!isLate ? 'Yes, Arrived on time' : 'Submit and confirm arrived'}
          </Button>

          {!isLate ? (
            <Button onClick={() => setLate(!isLate)} variant="outlined" size="large" color="inherit" sx={{mt: 2}}>
              No
            </Button>
          ) : (
            <Button onClick={() => setLate(!isLate)} variant="outlined" size="large" color="inherit" sx={{mt: 2}}>
              Cancel
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

ConfirmArrivedNotification.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  gig: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onClick: PropTypes.func,
  handleClose: PropTypes.func
}
