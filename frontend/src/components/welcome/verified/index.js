import {Link as RouterLink} from 'react-router-dom'
import {Stack, Typography, Box} from '@mui/material'

export default function VerifiedWelcome() {
  return (
    <Stack sx={{mb: 5, backgroundColor: 'starjobs.main'}}>
      <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}}>
        <RouterLink to="/">
          <Box component="img" src="/static/illustrations/verified.png" sx={{width: '100%', objectFit: 'contain'}} />
        </RouterLink>
      </Box>

      <Box sx={{textAlign: 'center'}}>
        <Typography variant="h4" color="common.white" gutterBottom>
          <div id="verified">Awesome! Registration is Verified</div>
        </Typography>
        <Typography color="common.white">Let's setup your settings, Click the Next button.</Typography>
      </Box>
    </Stack>
  )
}
