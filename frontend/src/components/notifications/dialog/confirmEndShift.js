import {
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Stack,
  DialogContent,
  DialogContentText,
  Button
} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {Icon} from '@iconify/react'
import closeIcon from '@iconify/icons-eva/close-circle-outline'

import PropTypes from 'prop-types'

export default function ConfirmEndShiftNotification({open, gig, onCommit, handleClose, loading}) {
  const handleCommit = (value) => {
    try {
      onCommit(value)
    } catch (error) {
      console.log(error)
    }
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
            The jobster has indicated a successful gig engagement with a rate of{' '}
            <b>P{gig.fees && gig.fees.proposedRate && parseFloat(gig.fees.proposedRate).toFixed(2)}</b>/ hour and an
            actual number of hours/ minutes of{' '}
            <b>{gig.fees && gig.fees.proposedWorkTime && parseFloat(gig.fees.proposedWorkTime).toFixed(2)} hr/s.</b>{' '}
            Kindly ensure all tasks has been completely, accurately and efficiently done. Also, take note of your
            inventories, equipment and machines for the reporting of damages before confirmation a successful gig.
            Remember, confirming today’s gig as successful means that no untoward incidents or issues occurred during
            the gig-engagement.” If successful, please confirm.
          </Typography>
          <Stack>
            <LoadingButton
              color="primary"
              variant="contained"
              onClick={() => handleCommit(gig)}
              disabled={loading}
              loading={loading}
              size="large"
            >
              Confirm End Shift
            </LoadingButton>
            <LoadingButton size="large" onClick={handleClose} variant="outlined" color="inherit" sx={{mt: 2}}>
              No
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
