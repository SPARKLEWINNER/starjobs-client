import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
} from '@material-ui/core'

export default function GenericNotification({open, details, handleClose}) {
  const handleOk = () => {
    window.location.reload()
  }

  return (
    <div>
      <Dialog open={open} handleClose={handleClose}>
        <DialogTitle sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h6" sx={{fontWeight: 'normal'}}>
            Notification!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="#000">
                {details && details.notification ? details.notification.title : ''}
              </Typography>
              {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="#000">{details ? `${getFormattedDate(new Date(gig.date))} ${tConvert(gig.time)}` : ''} </Typography> */}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Stack row>
            <Button color="primary" variant="contained" onClick={handleOk}>
              Ok
            </Button>
            <Button onClick={handleClose} variant="outlined" color="inherit" sx={{mt: 2}}>
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  )
}
