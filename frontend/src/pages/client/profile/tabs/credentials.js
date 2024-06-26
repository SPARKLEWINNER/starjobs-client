import {Box, Stack, Typography} from '@mui/material'
// theme
import color from 'src/theme/palette'

export default function Credentials() {
  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Credentials
        </Typography>
      </Stack>
      <Stack>
        <Box sx={{backgroundColor: '#E6E6E6', p: 5, my: 1, borderRadius: 1}}>
          <Typography variant="h5" sx={{textAlign: 'center'}}>
            Awards and Achievements 0
          </Typography>
        </Box>
        <Box sx={{backgroundColor: '#E6E6E6', p: 5, my: 1, borderRadius: 1}}>
          <Typography variant="h5" sx={{textAlign: 'center'}}>
            Others 0
          </Typography>
        </Box>
      </Stack>
    </>
  )
}
