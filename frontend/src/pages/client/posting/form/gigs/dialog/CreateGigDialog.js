import {useState} from 'react'

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
import {LoadingButton} from '@mui/lab'

const CreateGigDialog = ({open, onConfirm, handleClose}) => {
  const [loading, setLoading] = useState(false)

  const handleConfirmGig = () => {
    setLoading(true)
    onConfirm()
    setLoading(false)
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5, pb: 0}}>
          <Typography variant="h4" component="span">
            Confirm Gig Posting
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body2" sx={{textAlign: 'center'}} component="span">
              Are you sure you want to post this gig?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Stack row>
            <LoadingButton color="primary" variant="contained" onClick={handleConfirmGig} loading={loading}>
              Confirm
            </LoadingButton>
            <Button onClick={handleClose} variant="outlined" color="inherit" sx={{mt: 2}}>
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CreateGigDialog
