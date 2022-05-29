import {Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography, Stack} from '@mui/material'
import {useState} from 'react'
import PropTypes from 'prop-types'
import {Icon} from '@iconify/react'
import closeIcon from '@iconify/icons-eva/close-circle-outline'

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
        <Button sx={{ml: 'auto', p: 2}} onClick={handleClose}>
          <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
        </Button>
        <DialogTitle sx={{textAlign: 'center', pb: 0}}>
          <Typography variant="h4" component="span">
            Confirm Gig Posting
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
