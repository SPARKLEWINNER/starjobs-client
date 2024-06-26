import {Link as RouterLink} from 'react-router-dom'
import {Box, Card, CardContent, Typography, Stack, Link} from '@mui/material'
import {calculations} from 'src/utils/gigComputation'
import {Icon} from '@iconify/react'
import arrowRight from '@iconify/icons-eva/arrow-circle-right-outline'
import moment from 'moment'
import Label from 'src/components/Label'

import PropTypes from 'prop-types'

IncomingCard.propTypes = {
  gig: PropTypes.object,
  onView: PropTypes.func
}

export default function IncomingCard({gig, onView}) {
  const {position, _id, hours, fee, from, date, status, time, locationRate} = gig
  const hrShift = parseInt(hours) > 1 ? hours + ' hrs' : hours + ' hr'
  let {serviceCost} = calculations(hours, fee, locationRate)

  return (
    <Card sx={{p: 1, display: 'flex', mb: 2}} onClick={() => onView()}>
      <Box sx={{display: 'flex', flexDirection: 'column', width: {sm: '100%', xs: '100%'}, p: 1}}>
        <CardContent sx={{p: '0 !important'}}>
          <Stack direction="row" sx={{width: '100%', alignItems: 'center'}}>
            <Stack direction="row" sx={{alignItems: 'center'}}>
              <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                {position}{' '}
              </Typography>
              <Typography variant="overline" color="info" sx={{fontWeight: 'bold', fontSize: 10, mx: 1}}>
                {' '}
                - {status}
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="body1">
            {gig?.account[0].firstName} {gig?.account[0].lastName}
          </Typography>
          <Stack direction="row" sx={{my: 1}}>
            <Typography variant="overline" color="default" sx={{fontSize: 10}}>
              Start: {moment(from).format('MMM-DD hh:mm A')}
            </Typography>
            <Typography variant="overline" color="default" sx={{fontSize: 10, ml: 2}}>
              End: {moment(time).format('MMM-DD hh:mm A')}
            </Typography>
          </Stack>

          <Box sx={{my: 1}}>
            <Label sx={{fontSize: 10}} color="secondary">
              <span>&#8369;</span>
              {parseFloat(serviceCost).toFixed(2)}
            </Label>
            <Label color="secondary" sx={{fontSize: 10, mx: 1}}>
              {hrShift}
            </Label>
            <Label color="success" sx={{fontSize: 10}}>
              Posted: {moment(date).format('MMM-DD-YYYY')}
            </Label>
          </Box>
          <Stack direction="row" sx={{justifyContent: 'flex-end', alignItems: 'center'}}>
            <Box sx={{mr: 2}}>
              <Typography variant="overline" sx={{fontSize: 10, textTransform: 'uppercase'}} color="default">
                {status === 'Accepted' && 'for pushing through'}
              </Typography>
            </Box>
            {(status === 'Waiting' || status === 'Applying') && (
              <Link to={`/client/gigs/applicants/${_id}`} component={RouterLink} underline="none">
                <Typography id="viewBtn" variant="overline" sx={{fontSize: 10, alignItems: 'center', display: 'flex'}}>
                  View &nbsp; <Icon icon={arrowRight} />
                </Typography>
              </Link>
            )}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}
