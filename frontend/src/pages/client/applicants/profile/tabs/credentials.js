import {Box, Grid, Stack, Typography} from '@mui/material'
import {Icon} from '@iconify/react'
import checkmark from '@iconify/icons-eva/checkmark-circle-2-fill'

// theme
import color from 'src/theme/palette'

const reviews = [{name: 'DTI'}, {name: 'BIR'}, {name: 'NBI clearance'}]

export default function Credentials() {
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Reviews
        </Typography>
      </Stack>
      <Grid container direction="row" sx={{mb: 4, mt: 2}}>
        {reviews &&
          reviews.map((v, k) => {
            return (
              <Grid key={k} item xs={12} sx={{my: 1}}>
                <Stack direction="row">
                  <Box>
                    <Grid container>
                      <Icon icon={checkmark} width={20} height={20} color="#00ace8" />
                      <Typography variant="body1" sx={{pl: 1}}>
                        {v.name}
                      </Typography>
                    </Grid>
                  </Box>
                </Stack>
              </Grid>
            )
          })}
      </Grid>
    </Box>
  )
}
