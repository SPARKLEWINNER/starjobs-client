import {useState} from 'react'
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
import moment from 'moment'

export default function IncomingNotification({open, gig, onCommit, onReject}) {
  const [loading, setLoading] = useState(false)
  const getFormattedDate = (date) => {
    if (!date) return
    let year = date.getFullYear()
    let month = (1 + date.getMonth()).toString().padStart(2, '0')
    let day = date.getDate().toString().padStart(2, '0')

    return month + '/' + day + '/' + year
  }

  const handleCommit = (value) => {
    setLoading(true)
    try {
      let data = {
        new_status: 'Confirm-Gig',
        ...value,
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

  const handleReject = (value) => {
    setLoading(true)
    let data = {
      new_status: 'Cancelled',
      ...value,
    }
    onReject(data)
    setLoading(false)
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h6" sx={{fontWeight: 'normal'}}>
            Incoming Gig Notification!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="#000">
                {gig ? gig.position : ''}
              </Typography>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="#000">
                {gig
                  ? `${getFormattedDate(new Date(gig.date))} ${moment(gig.time).format('DD MMM  YYYY hh:mm A')}`
                  : ''}{' '}
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <Typography variant="body1" sx={{mb: 3}}>
            Are you pushing through the gig today?
          </Typography>
          <Stack row>
            <Button color="primary" variant="contained" onClick={() => handleCommit(gig)} disabled={loading}>
              Pushing through
            </Button>
            <Button
              onClick={() => handleReject(gig)}
              variant="outlined"
              color="inherit"
              sx={{mt: 2}}
              disabled={loading}
            >
              Not Pushing through
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  )
}
