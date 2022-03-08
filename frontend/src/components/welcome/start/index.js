import {Link as RouterLink} from 'react-router-dom'
import {Stack, Typography, Box} from '@material-ui/core'

export default function VerifiedWelcome() {
  return (
    <Stack sx={{mb: 5}}>
      <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}}>
        <RouterLink to="/">
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
