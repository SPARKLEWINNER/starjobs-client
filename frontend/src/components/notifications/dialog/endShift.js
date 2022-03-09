import {Dialog, DialogTitle, DialogActions, Button, Typography, Stack} from '@material-ui/core'

export default function EndShiftNotification({open, gig, onCommit, onReject, handleClose}) {
  console.log(gig)
  const handleCommit = (value) => {
    let data = {
      new_status: 'End-Shift',
      ...value,
    }
    onCommit(data)
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h6" sx={{fontWeight: 'normal'}}>
            Confirm End-Shift
          </Typography>
        </DialogTitle>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Typography variant="body1" sx={{mb: 3}}>
            Please ensure that all the assigned tasks has been successfully carried out. Take note of your personal
            belongings before you leave. Talk to the client/principal and indicate your final agreed rate and number of
            hours. P{parseFloat(gig.fee).toFixed(2)} rate actual number of hours and minutes If successful, press
            “end-shift”
          </Typography>
          <Stack row>
            <Button color="primary" variant="contained" onClick={() => handleCommit(gig)}>
              Confirm End Shift
            </Button>
            <Button onClick={handleClose} variant="outlined" color="inherit" sx={{mt: 2}}>
              No
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  )
}
