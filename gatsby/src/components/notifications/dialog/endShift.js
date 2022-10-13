import {Dialog, DialogTitle, DialogActions, Typography, Stack, Button, TextField} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import PropTypes from 'prop-types'
import React, {useState} from 'react'

// icons
import {Icon} from '@iconify/react'
import closeIcon from '@iconify/icons-eva/close-circle-outline'

const EndShiftNotification = ({open, gig, onCommit, handleClose, loading}) => {
  const [workTime, setWorkTime] = useState(gig?.hours || '')
  const [rate, setRate] = useState(undefined)
  const [isFinal, setIsFinal] = useState(false)
  const handleCommit = (value) => {
    if (workTime === null || workTime === undefined) {
      return alert('Kindly set the number of worked hours')
    }

    if (Math.sign(workTime) < 0) {
      return alert('Cannot set negative work hours')
    }

    try {
      let data = {
        new_status: 'End-Shift',
        actualTime: workTime,
        actualRate: rate ?? gig.fee,
        ...value
      }
      onCommit(data)
    } catch (error) {
      console.log(error)
    }
  }

  const formatDecimal = (value, type) => {
    if (!value) return
    if (type === 'hours') {
      setWorkTime(parseFloat(value).toFixed(2))
    }
    if (type === 'rate') {
      setRate(parseFloat(value).toFixed(2))
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Button sx={{ml: 'auto', pt: 2}} onClick={handleClose}>
          <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
        </Button>
        <DialogTitle sx={{textAlign: 'center'}}>
          <Typography variant="h4" component="span">
            Confirm End-Shift
          </Typography>
        </DialogTitle>
        <DialogActions sx={{display: 'block', pb: 5, px: 3}}>
          <Typography variant="body2" sx={{mb: 3}} component="span">
            Please ensure that all the assigned tasks has been successfully carried out. Take note of your personal
            belongings before you leave. Talk to the client/principal and indicate your final agreed rate and number of
            hours. Gig posted rates and hour is P{parseFloat(gig.fee).toFixed(2)} per hour for {gig.hours}{' '}
            {gig.hours && JSON.parse(gig.hours).length > 1 ? 'hour' : 'hours'} If successful, press “end-shift”
          </Typography>
          <Stack direction="column" alignItems="center" sx={{mt: 4, mb: 2}}>
            <TextField
              label="No. of hours "
              fullWidth
              type="number"
              defaultValue={gig.hours || ''}
              sx={{width: '100%'}}
              onChange={(e) => formatDecimal(e.target.value, 'hours')}
            />
            <Typography
              component="p"
              sx={{py: 1, textAlign: 'left', display: 'block', width: '100%'}}
              variant="caption"
            >
              (ex. <b>6.30</b> = 6 hours and 30 minutes)
            </Typography>
            <TextField
              key="gig-rate"
              label="Rate per hour"
              defaultValue={parseFloat(gig.fee).toFixed(2)}
              sx={{width: '100%', mt: 2}}
              onChange={(e) => formatDecimal(e.target.value, 'rate')}
            />
          </Stack>

          <Stack sx={{my: 2}}>
            <LoadingButton
              color="primary"
              size="large"
              variant="contained"
              onClick={() => setIsFinal(true)}
              loading={loading}
              disabled={loading}
            >
              Confirm End Shift
            </LoadingButton>
            <LoadingButton onClick={handleClose} size="large" variant="outlined" color="inherit" sx={{mt: 2}}>
              No
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Final confirm dialog */}
      <Dialog open={isFinal} onClick={() => setIsFinal(false)}>
        <Button sx={{ml: 'auto', pt: 2}} onClick={() => setIsFinal(false)}>
          <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
        </Button>
        <DialogTitle sx={{textAlign: 'center'}}>
          <Typography variant="h4" sx={{maxWidth: '75%', mx: 'auto'}}>
            Are you sure you want to end this shift?
          </Typography>
        </DialogTitle>
        <DialogActions sx={{display: 'block', pb: 5, px: 3}}>
          <Typography variant="h6" sx={{mb: 6, fontWeight: 400, textAlign: 'center', mx: 'auto'}}>
            Please ensure that you have informed your supervisor. Once you processed this you won't be able to undo your
            changes.
          </Typography>

          <Stack sx={{my: 2}}>
            <LoadingButton
              color="primary"
              size="large"
              variant="contained"
              onClick={() => handleCommit(gig)}
              loading={loading}
              disabled={loading}
              sx={{textTransform: 'initial !important'}}
            >
              Yes, I have informed the supervisor
            </LoadingButton>
            <LoadingButton
              onClick={() => setIsFinal(false)}
              size="large"
              variant="outlined"
              color="inherit"
              sx={{mt: 2}}
            >
              Cancel
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  )
}

EndShiftNotification.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  gig: PropTypes.array,
  onCommit: PropTypes.func,
  handleClose: PropTypes.func,
  onReject: PropTypes.func,
  loading: PropTypes.bool
}

export default EndShiftNotification
