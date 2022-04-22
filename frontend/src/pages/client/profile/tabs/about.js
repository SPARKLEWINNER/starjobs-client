import {Box, Grid, Stack, Typography} from '@mui/material'
import {Icon} from '@iconify/react'
import starIcon from '@iconify/icons-eva/star-fill'

// theme
import color from 'src/theme/palette'

const ratings = [
  {label: 'Payment Rate', value: '100%'},
  {label: 'Cancellation Rate', value: '95%'},
  {label: 'Completion', value: '100%'}
]

export default function About() {
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Ratings
        </Typography>
      </Stack>
      <Grid container direction="row" sx={{mb: 4, mt: 2}}>
        {ratings &&
          ratings.map((v, k) => {
            return (
              <Grid item xs={6} md={6} sx={{my: 1}}>
                <Stack direction="row">
                  <Box sx={{mr: 1}}>
                    <Icon icon={starIcon} color="#ffc107" width={25} height={25} />
                  </Box>
                  <Grid container direction="row">
                    <Grid item xs={8} md={8}>
                      <Typography variant="body2">{v.label}</Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                        {v.value}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            )
          })}
      </Grid>
    </Box>
  )
}
