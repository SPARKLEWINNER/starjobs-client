import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Stack,
} from '@material-ui/core'

const ConfirmDeleteGig = ({open, onConfirm, handleClose}) => {
  const handleConfirmGig = () => {
    onConfirm()
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5, pb: 0}}>
          <Typography variant="h4">Confirm Delete of Gig?</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body2" sx={{textAlign: 'center'}}>
              Are you sure you want to delete this gig?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Stack row>
            <Button color="primary" variant="contained" onClick={handleConfirmGig}>
              Yes, delete it!
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

export default ConfirmDeleteGig
