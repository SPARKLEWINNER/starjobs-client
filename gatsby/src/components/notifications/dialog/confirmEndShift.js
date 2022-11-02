import React, {useState} from 'react'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Stack,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  TextField
} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {Icon} from '@iconify/react'
import closeIcon from '@iconify/icons-eva/close-circle-outline'

import PropTypes from 'prop-types'

export default function ConfirmEndShiftNotification({open, gig, onCommit, handleClose, loading}) {
  const [hoursLate, setHoursLate] = useState(undefined)
  const [isLate, setLate] = useState(false)
  const [isFinal, setIsFinal] = useState(false)

  const handleCommit = (value) => {
    if (Math.sign(hoursLate) < 0) return alert('Unable to set negative numbers in late hours')
    try {
      let data = {
        timeLate: hoursLate ? parseFloat(hoursLate) : null,
        ...value
      }
      onCommit(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeValue = (event) => {
    setHoursLate(event.target.value)
  }

  const checkProposedTime = (gig) => {
    if (gig?.fees?.proposedWorkTime?.length !== 0) {
      return parseFloat(gig?.fees?.proposedWorkTime).toFixed(2)
    }

    return gig?.hours
  }

  const checkProposedRate = (gig) => {
    if (gig?.fees?.proposedRate?.length !== 0) {
      return parseFloat(gig?.fees?.proposedRate).toFixed(2)
    }

    return gig?.fee
  }

  return (
    <div>
      <Dialog open={open ?? false} onClose={handleClose}>
        <Button sx={{ml: 'auto', p: 2}} onClick={handleClose}>
          <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
        </Button>
        <DialogTitle sx={{textAlign: 'center'}}>
          <Typography variant="h6" component="span" sx={{fontWeight: 'bold'}}>
            Reminder
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{textAlign: 'center'}}>
            <Typography variant="h4" component="span" sx={{textAlign: 'center', fontWeight: 'bold'}} color="#000">
              Confirm End-Shift
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Typography variant="body1" sx={{mb: 3}}>
            The jobster has indicated a successful gig engagement with a rate of <b>P {checkProposedRate(gig)}</b>/ hour
            and an actual number of hours/ minutes of <b>{checkProposedTime(gig)} hr/s.</b> Kindly ensure all tasks has
            been completely, accurately and efficiently done. Also, take note of your inventories, equipment and
            machines for the reporting of damages before confirmation a successful gig. Remember, confirming today’s gig
            as successful means that no untoward incidents or issues occurred during the gig-engagement.” If successful,
            please confirm.
          </Typography>

          {!isLate && (
            <Typography variant="h6" sx={{mb: 3, textAlign: 'center', fontWeight: '400'}}>
              Did the Jobster arrived on-time?
            </Typography>
          )}
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

          <Stack>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={() => setIsFinal(true)}
              disabled={loading}
              loading={loading}
            >
              {!isLate ? 'Yes, Confirm End Shift' : 'Submit and Confirm End Shift'}
            </Button>

            {!isLate ? (
              <LoadingButton
                onClick={() => {
                  setLate(!isLate)
                }}
                variant="outlined"
                size="large"
                color="inherit"
                sx={{mt: 2}}
              >
                No
              </LoadingButton>
            ) : (
              <Button onClick={() => setLate(!isLate)} variant="outlined" size="large" color="inherit" sx={{mt: 2}}>
                Cancel
              </Button>
            )}
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
            Do you confirm to end this shift?
          </Typography>
        </DialogTitle>
        <DialogActions sx={{display: 'block', pb: 5, px: 3}}>
          <Typography variant="h6" sx={{mb: 6, fontWeight: 400, textAlign: 'center', mx: 'auto'}}>
            The jobster indicated P {checkProposedRate(gig)}/ hour for {checkProposedTime(gig)}. Once you processed this
            you won't be able to undo your changes.
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
              Yes, I approved of the gig rate and work hours
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
    </div>
  )
}

ConfirmEndShiftNotification.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  gig: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onCommit: PropTypes.func,
  handleClose: PropTypes.func,
  onReject: PropTypes.func,
  loading: PropTypes.bool
}
