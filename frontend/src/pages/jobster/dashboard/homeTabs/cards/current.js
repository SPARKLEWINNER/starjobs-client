import PropTypes from 'prop-types'

import {Box, Card, CardContent, Typography, Stack} from '@mui/material'
import moment from 'moment'
import Label from 'src/components/Label'

function change_label_by_status(status) {
  switch (status) {
    case 'Applying':
      return 'Waiting for client approval'
    case 'Confirm-Gig':
      return 'Client will confirm your arrival'
    case 'Confirm-Arrived':
      return 'Client confirmed your arrival'
    case 'End-Shift':
      return "You've ended your shift"
    default:
      return status
  }
}

const CurrentCard = ({gig, onView}) => {
  let {position, hours, fee, time, from, status, category} = gig
  fee = parseFloat(fee)
  let computedGigFee = parseFloat(fee * hours)
  let voluntaryFee = parseFloat(computedGigFee * 0.112421) / hours
  let _total = parseFloat(fee + voluntaryFee)

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 1,
        cursor: 'pointer'
      }}
      onClick={() => onView()}
    >
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', p: 2, mx: 2}}>
        <CardContent sx={{flex: '1 0 auto', px: 0, py: 1, alignItems: 'flex-start'}}>
          <Box sx={{width: '100%', alignItems: 'center', mb: '0 !important'}}>
            <Typography variant="overline" sx={{fontWeight: 'bold', mb: '0 !important', mt: '0 !important'}}>
              {position}
            </Typography>
          </Box>
          <Stack direction="column" sx={{my: 0}}>
            <Typography variant="overline" color="default" sx={{fontSize: 10}}>
              Start: {moment(from).format('MMM-DD hh:mm A')}
            </Typography>
            <Typography variant="overline" color="default" sx={{fontSize: 10}}>
              End: {moment(time).format('MMM-DD hh:mm A')}
            </Typography>
          </Stack>

          <Box sx={{my: 1}}>
            <Label sx={{fontSize: 10}} color="secondary">
              <span>&#8369;</span>
              {parseFloat(_total).toFixed(2)} / {category === 'parcels' ? 'parcels' : 'hr'}
            </Label>
            <Label color="secondary" sx={{fontSize: 10, mx: 1}}>
              {hours} {category === 'parcels' ? 'parcels' : 'hr shift'}
            </Label>
          </Box>

          <Box sx={{position: 'absolute', bottom: 15, right: 20}}>
            <Typography variant="overline" sx={{fontWeight: 'bold', fontSize: 8}}>
              {change_label_by_status(status)}
            </Typography>
          </Box>
        </CardContent>
      </Box>
    </Card>
  )
}

CurrentCard.propTypes = {
  gig: PropTypes.object,
  onView: PropTypes.func
}

export default CurrentCard
