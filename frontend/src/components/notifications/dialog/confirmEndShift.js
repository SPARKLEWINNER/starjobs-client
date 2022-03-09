import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Stack,
  DialogContent,
  DialogContentText,
  Box,
} from '@material-ui/core'

export default function ConfirmEndShiftNotification({open, gig, onCommit, onReject, handleClose}) {
  const handleCommit = (value) => {
    let data = {
      new_status: 'Confirm-End-Shift',
      ...value,
    }
    onCommit(data)
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h6" sx={{fontWeight: 'bold'}}>
            Reminder
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="#000">
                Confirm End-Shift
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Typography variant="body1" sx={{mb: 3}}>
            The jobster has indicated a successful gig engagement with a rate of P{parseFloat(gig.fee).toFixed(2)}/ hour
            and an actual number of hours/ minutes of {parseFloat(gig.hours).toFixed(0)} hr/s. Kindly ensure all tasks
            has been completely, accurately and efficiently done. Also, take note of your inventories, equipment and
            machines for the reporting of damages before confirmation a successful gig. Remember, confirming today’s gig
            as successful means that no untoward incidents or issues occurred during the gig-engagement.” If successful,
            please confirm.
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
