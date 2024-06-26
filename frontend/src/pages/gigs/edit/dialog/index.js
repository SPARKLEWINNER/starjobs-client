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
import PropTypes from 'prop-types'

const EditDialog = ({open, onConfirm, handleClose}) => {
  const handleConfirmGig = () => {
    onConfirm()
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5, pb: 0}}>
          <Typography variant="h4">Confirm Gig Changes?</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body2" sx={{textAlign: 'center'}}>
              Are you sure you want to save gig details?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Stack row>
            <Button color="primary" variant="contained" onClick={handleConfirmGig}>
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

EditDialog.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  onConfirm: PropTypes.func,
  handleClose: PropTypes.func
}

export default EditDialog
