import React, {useState} from 'react'

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

import {Icon} from '@iconify/react'
import closeIcon from '@iconify/icons-eva/close-circle-outline'

const CreateGigDialog = ({open, onConfirm, handleClose}) => {
  const [loading, setLoading] = useState(false)

  const handleConfirmGig = () => {
    setLoading(true)
    onConfirm()
    setLoading(false)
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <Button sx={{ml: 'auto', p: 2}} onClick={handleClose}>
          <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
        </Button>
        <DialogTitle sx={{textAlign: 'center', pb: 0}}>
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
            <LoadingButton
              id="continueGigSubmit"
              color="primary"
              variant="contained"
              onClick={handleConfirmGig}
              loading={loading}
            >
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

CreateGigDialog.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  onConfirm: PropTypes.func,
  handleClose: PropTypes.func
}

export default CreateGigDialog
