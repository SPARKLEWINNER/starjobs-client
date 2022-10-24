import {Box, Grid, Stack, Typography, Avatar} from '@mui/material'
import {Icon} from '@iconify/react'
import checkmark from '@iconify/icons-eva/checkmark-circle-2-fill'
// theme
import color from 'theme/palette'

const reviews = [
  {
    name: 'Anonymous_5592',
    comment: 'Shows initiative with developing new ways of thinking to improve projects or company performance.',
    image: '/static/mock-images/avatars/avatar_1.jpg'
  },
  {
    name: 'Yellow Fin ',
    comment: 'Willingly adjust their schedule to be available when needed.',
    image: '/static/mock-images/avatars/avatar_24.jpg'
  },
  {
    name: 'Diego Sy ',
    comment: "Has good attendance and doesn't violate the standard attendance policy.",
    image: '/static/mock-images/avatars/avatar_19.jpg'
  }
]

export default function Reviews() {
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
              <Grid item xs={12} md={12} sx={{my: 2}} key={k}>
                <Stack direction="row">
                  <Box sx={{mr: 1, display: 'flex', alignItems: 'center', px: 1}}>
                    <Avatar alt={v.name} src={v.image} />
                  </Box>
                  <Box>
                    <Grid container>
                      <Typography variant="body1" sx={{pr: 1}}>
                        {v.name}
                      </Typography>
                      <Icon icon={checkmark} width={20} height={20} color={`${color.starjobs.main}`} />
                    </Grid>
                    <Typography variant="body2" sx={{textDecoration: 'italic'}}>
                      "{v.comment}"
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            )
          })}
      </Grid>
    </Box>
  )
}
