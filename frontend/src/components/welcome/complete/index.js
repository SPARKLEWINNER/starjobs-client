import {Link as RouterLink} from 'react-router-dom'
import {Stack, Typography, Box, Button, Link} from '@mui/material'

import {LoadingButtonInvertedStyle} from 'src/theme/style'
import PropTypes from 'prop-types'

export default function VerifiedWelcome({user}) {
  return (
    <Stack sx={{mb: 5}}>
      <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}}>
        <RouterLink to="/">
          <Box component="img" src="/static/illustrations/complete.png" sx={{width: '100%', objectFit: 'contain'}} />
        </RouterLink>
      </Box>

      <Box sx={{textAlign: 'center'}}>
        <Typography variant="h4" color="common.white" gutterBottom>
          Complete your account information
        </Typography>
        <Typography color="common.white">
          Fill-up required details upon clicking the "Complete my details" button.
        </Typography>
        <Link
          component={RouterLink}
          to={`/${user && user.accessType === 0 ? 'freelancer' : 'client'}/onboard`}
          sx={{textDecoration: 'none'}}
        >
          <Button variant="contained" sx={{mt: 5, mb: 1, ...LoadingButtonInvertedStyle}} size="large" fullWidth>
            Complete my details
          </Button>
        </Link>
      </Box>
    </Stack>
  )
}

VerifiedWelcome.propTypes = {
  user: PropTypes.object
}
