import {Link as RouterLink} from 'react-router-dom'
import moment from 'moment'
import {Box, Card, CardContent, Link, Typography, Stack} from '@material-ui/core'
import {Icon} from '@iconify/react'
import arrowRight from '@iconify/icons-eva/arrow-circle-right-outline'
import Label from 'components/Label'
import {calculations} from 'utils/gigComputation'

function numberOfApplicants(gig) {
  if (gig.isExtended) {
    if (gig && gig.numberofApplicants > 0)
      return `${gig.numberofApplicants} ${
        gig && gig.numberofApplicants && gig.numberofApplicants.length > 1 ? 'applicants' : 'applicant'
      }`

    return '0 Applicant'
  } else {
    if (gig && Object.keys(gig.applicants).length > 0)
      return `${Object.keys(gig.applicants).length} ${
        gig && gig.applicants && Object.keys(gig.applicants).length > 1 ? 'applicants' : 'applicant'
      }`

    return '0 Applicant'
  }
}

export default function PendingCard({gig}) {
  const {position, _id, hours, fee, from, date, status, time, locationRate} = gig
  const hrShift = parseInt(hours) > 1 ? hours + ' hrs' : hours + ' hr'
  let {serviceCost} = calculations(hours, fee, locationRate)

  return (
    <Card sx={{p: 1, display: 'flex', mb: 2}}>
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
              <Typography variant="overline" sx={{fontSize: 10}} color="default">
                {numberOfApplicants(gig)}
              </Typography>
            </Box>
            {(status === 'Waiting' || status === 'Applying') && (
              <Link to={`/client/gigs/applicants/${_id}`} component={RouterLink} underline="none">
                <Typography variant="overline" sx={{fontSize: 10, alignItems: 'center', display: 'flex'}}>
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
