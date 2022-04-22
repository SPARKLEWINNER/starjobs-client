import {useState} from 'react'
import {Dialog, DialogTitle, DialogActions, Typography, Stack} from '@mui/material'
import {LoadingButton} from '@mui/lab'
export default function EndShiftNotification({open, gig, onCommit, onReject, handleClose}) {
  const [loading, setLoading] = useState(false)
  const handleCommit = (value) => {
    setLoading(true)
    try {
      let data = {
        new_status: 'End-Shift',
        ...value
      }
      onCommit(data)
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h6" component="span" sx={{fontWeight: 'normal'}}>
            Confirm End-Shift
          </Typography>
        </DialogTitle>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Typography variant="body1" sx={{mb: 3}} component="span">
            Please ensure that all the assigned tasks has been successfully carried out. Take note of your personal
            belongings before you leave. Talk to the client/principal and indicate your final agreed rate and number of
            hours. P{parseFloat(gig.fee).toFixed(2)} rate actual number of hours and minutes If successful, press
            “end-shift”
          </Typography>
          <Stack sx={{my: 2}}>
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
