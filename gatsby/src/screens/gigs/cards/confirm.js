import {useState} from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Stack
} from '@mui/material'

const ConfirmGig = ({open, onConfirm, handleClose}) => {
  const [isLoading, setLoading] = useState(false)

  const handleConfirmGig = () => {
    setLoading(true)
    onConfirm()

    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5, pb: 0}}>
          <Typography variant="text">Confirm Proposal?</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="text" sx={{textAlign: 'center'}}>
              Are you sure you want to apply to this gig?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Stack>
            <Button id="confirm" color="primary" variant="contained" onClick={handleConfirmGig} disabled={isLoading}>
              Confirm
            </Button>
            <Button onClick={handleClose} variant="outlined" color="inherit" sx={{mt: 2}}>
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ConfirmGig.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  onConfirm: PropTypes.func,
  handleClose: PropTypes.func
}

export default ConfirmGig
