import {Link as RouterLink} from '@reach/router'
import {Stack, Typography, Box} from '@mui/material'

export default function VerifiedWelcome() {
  return (
    <Stack sx={{mb: 5}}>
      <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}}>
        <RouterLink to="/dashboard">
          <Box component="img" src="/static/illustrations/start.png" sx={{width: '100%', objectFit: 'contain'}} />
        </RouterLink>
      </Box>

      <Box sx={{textAlign: 'center'}}>
        <Typography variant="h4" color="common.white" gutterBottom>
          Great! You have completed the setup
        </Typography>
        <Typography color="common.white">
          Start connecting to thousands of companies & millions of independent professionals today
        </Typography>
      </Box>
    </Stack>
  )
}
