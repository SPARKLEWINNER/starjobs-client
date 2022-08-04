import {usePwa} from 'react-pwa-app'
import {Dialog, DialogContent, DialogContentText, DialogActions, Button, Typography, Stack, Box} from '@mui/material'
import {useEffect, useState} from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const InstallPWA = () => {
  const pwa = usePwa()
  const [isPWAInstall, setPWAInstall] = useState(pwa.isInstalled ?? false)
  const [notSupported, setNotSupported] = useState(false)
  useEffect(() => {
    if (!pwa.supports) {
      setNotSupported(true)
    }
  }, [pwa])

  return (
    <div>
      <Dialog open={isPWAInstall} handleClose={() => setPWAInstall(false)}>
        <Box sx={{textAlign: 'center', pt: 2}}>
          {/* <Typography variant="h6" sx={{fontWeight: 'normal'}}>
            We  noticed that you open the app from Facebook Messenger
          </Typography> */}
          <Box component="img" src="/favicon/starjobs-whole-text.png" sx={{height: 120, mx: 'auto'}} />
        </Box>
        <DialogContent>
          <DialogContentText>
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h6" sx={{fontWeight: 'bold'}} color="common.black">
                Add Starjobs App to your home screen?
              </Typography>
              <Typography variant="body1" sx={{fontWeight: 400, mt: 2}} color="common.black">
                Install this application on your Home screen for quick and easy access when you're on the go
              </Typography>

              {notSupported && (
                <>
                  <Box sx={{mt: 4, mb: 2}}>
                    <Typography variant="h5" sx={{fontWeight: 'bold'}} color="common.black">
                      Android
                    </Typography>
                    <Typography variant="body1" sx={{fontWeight: 400}} color="common.black">
                      Just tap then <MoreVertIcon /> "Open Google Chrome"
                    </Typography>
                  </Box>
                  <Box sx={{mb: 2}}>
                    <Typography variant="h5" sx={{fontWeight: 'bold'}} color="common.black">
                      iOS
                    </Typography>
                    <Typography variant="body1" sx={{fontWeight: 400}} color="common.black">
                      Just tap <OpenInNewIcon /> then "Safari"
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          {!notSupported && (
            <Stack row>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  pwa.install()
                  setPWAInstall(false)
                }}
              >
                Add to Home Screen
              </Button>
              <Button onClick={() => setPWAInstall(false)} variant="outlined" color="inherit" sx={{mt: 2}}>
                Close
              </Button>
            </Stack>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default InstallPWA
