import React, {useState} from 'react'
import {useNavigate} from '@reach/router'
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
import PropTypes from 'prop-types'

const OnboardDialog = ({open, handleClose}) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleConfirmGig = () => {
    setLoading(true)
    navigate('/client/onboard')
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5, pb: 0}}>
          <Typography variant="h4" component="span">
            Howwwdy!!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body2" sx={{textAlign: 'center'}} component="span">
              To Experience the full Gig posting. Kindly complete your Company/Business details
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Stack row>
            <LoadingButton color="primary" variant="contained" onClick={handleConfirmGig} loading={loading}>
              Complete my details
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

OnboardDialog.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  handleClose: PropTypes.func
}

export default OnboardDialog
