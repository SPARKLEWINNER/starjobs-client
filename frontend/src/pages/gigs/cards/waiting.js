import {Link as RouterLink} from 'react-router-dom'
import {Box, Card, CardContent, CardMedia, Link, Typography, Stack} from '@mui/material'
import moment from 'moment'
import {Icon} from '@iconify/react'
import arrowRight from '@iconify/icons-eva/arrow-circle-right-outline'
import Label from 'src/components/Label'

import {calculations} from 'src/utils/gigComputation'
export default function WaitingCard({gig, _type, category}) {
  let {position, uid, hours, fee, user, from, time, locationRate} = gig
  const {thumbnail, location} = user[0]

  const type = category === 'parcels' ? 'parcels' : 'hr/s'
  fee = parseFloat(fee)
  let {jobsterTotal} = calculations(hours, fee, locationRate)

  return (
    <Card sx={{p: 0, display: 'flex', my: 2, position: 'relative'}}>
      <Box sx={{py: 1, width: '80px', display: 'flex', alignItems: 'flex-start'}}>
        <CardMedia
          component="img"
          sx={{objectFit: 'cover', objectPosition: 'center', borderRadius: '8px', width: '80px', height: '80px'}}
          image={`${thumbnail}`}
          alt={position}
        />
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <CardContent sx={{flex: '1 0 auto', py: 1, alignItems: 'flex-start', width: '100%'}}>
          <Stack direction="row" sx={{alignItems: 'center', mb: 1}}>
            <Typography variant="overline" sx={{fontWeight: 'bold', width: '140px'}}>
              <Link
                underline="none"
                component={RouterLink}
                to={`/gigs/details/${uid}/${category}`}
                sx={{wordBreak: 'break-all'}}
              >
                {position}
              </Link>
            </Typography>
            <Label sx={{fontSize: 10, ml: 1, position: 'absolute', right: 10}} color="info">
              <span>&#8369;</span>
              {parseFloat(jobsterTotal).toFixed(2)} / {type}
            </Label>
          </Stack>
          <Typography variant="body2" sx={{fontSize: 13, mb: 0}}>
            Location: {location}
          </Typography>

          <Stack direction="column" sx={{my: 1}}>
            <Typography variant="overline" color="default" sx={{fontSize: 10}}>
              Start: {moment(from).format('MMM-DD hh:mm A')}
            </Typography>
            <Typography variant="overline" color="default" sx={{fontSize: 10, mt: 1}}>
              End: {moment(time).format('MMM-DD hh:mm A')}
            </Typography>
          </Stack>

          <Box sx={{my: 1}}>
            <Label color="secondary" sx={{fontSize: 10}}>
              {hours} {category === 'parcels' ? 'parcels' : ' hrs shift'}{' '}
            </Label>
          </Box>

          <Box sx={{position: 'absolute', bottom: 10, right: 16}}>
            <Link
              underline="none"
              variant="caption"
              component={RouterLink}
              sx={{textTransform: 'uppercase', fontWeight: 'bold'}}
              to={`/gigs/details/${uid}/${category}`}
            >
              View {category === 'parcels' ? 'delivery gig' : 'gig'} <Icon icon={arrowRight} />
            </Link>
          </Box>
        </CardContent>
      </Box>
    </Card>
  )
}
