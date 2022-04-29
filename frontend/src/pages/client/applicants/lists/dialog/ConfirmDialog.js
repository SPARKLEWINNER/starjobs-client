import {Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography, Stack} from '@mui/material'
import {useState} from 'react'
import PropTypes from 'prop-types'

const ConfirmDialog = ({open, onConfirm, handleClose}) => {
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
            Confirm Application
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{textAlign: 'center'}}>
            Are you sure you want to accept this jobster?
          </Typography>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Stack>
            <Button color="primary" variant="contained" onClick={handleConfirmGig} disabled={loading}>
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
ConfirmDialog.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  onConfirm: PropTypes.func,
  handleClose: PropTypes.func
}
export default ConfirmDialog
