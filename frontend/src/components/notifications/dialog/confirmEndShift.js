import {
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Stack,
  DialogContent,
  DialogContentText,
  Box,
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
      <Dialog open={open} onClose={handleClose}>
        <Button sx={{ml: 'auto', p: 2}} onClick={handleClose}>
          <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
        </Button>
        <DialogTitle sx={{textAlign: 'center'}}>
          <Typography variant="h6" sx={{fontWeight: 'bold'}}>
            Reminder
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="#000">
                Confirm End-Shift
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Typography variant="body1" sx={{mb: 3}}>
            The jobster has indicated a successful gig engagement with a rate of P
            {gig.fees && gig.fees.proposedRate && parseFloat(gig.fees.proposedRate).toFixed(2)}/ hour and an actual
            number of hours/ minutes of{' '}
            {gig.fees && gig.fees.proposedWorkTime && parseFloat(gig.fees.proposedWorkTime).toFixed(0)} hr/s. Kindly
            ensure all tasks has been completely, accurately and efficiently done. Also, take note of your inventories,
            equipment and machines for the reporting of damages before confirmation a successful gig. Remember,
            confirming today’s gig as successful means that no untoward incidents or issues occurred during the
            gig-engagement.” If successful, please confirm.
          </Typography>
          <Stack row>
            <LoadingButton color="primary" variant="contained" onClick={() => handleCommit(gig)} loading={loading}>
              Confirm End Shift
            </LoadingButton>
            <LoadingButton onClick={handleClose} variant="outlined" color="inherit" sx={{mt: 2}} loading={loading}>
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
