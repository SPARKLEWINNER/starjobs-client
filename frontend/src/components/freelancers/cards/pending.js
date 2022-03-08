import {Box, Card, CardContent, CardMedia, Typography, Stack} from '@material-ui/core'
import moment from 'moment'
import Label from 'components/Label'
export default function PendingCard({gig}) {
  let {user, position, hours, fee, from, category, time} = gig
  const {location, thumbnail} = user[0]
  fee = parseFloat(fee)
  let computedGigFee = parseFloat(fee * hours)
  let voluntaryFee = parseFloat(computedGigFee * 0.112421) / hours
  let _total = parseFloat(fee + voluntaryFee)

  return (
    <Card sx={{p: 0, display: 'flex', height: 120, boxShadow: 'none'}}>
      <Box sx={{pt: 2, pb: 1, pl: 2, pr: 1, width: '100px', display: 'flex', alignItems: 'flex-start'}}>
        <CardMedia
          component="img"
          sx={{objectFit: 'cover', objectPosition: 'center', borderRadius: '8px', width: '70px', height: '70px'}}
          image={`${thumbnail}`}
          alt={position}
        />
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '90%', p: 0.5}}>
        <CardContent sx={{flex: '1 0 auto', px: 0, py: 1, alignItems: 'flex-start'}}>
          <Box sx={{width: '100%', alignItems: 'center', mb: '0 !important'}}>
            <Typography variant="overline" sx={{fontWeight: 'bold', mb: '0 !important', mt: '0 !important'}}>
              {position}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{fontSize: 12, mb: '0 !important', mt: '0 !important'}}>
            Location: {location}
          </Typography>
          <Stack direction="row" sx={{my: 0}}>
            <Typography variant="overline" color="default" sx={{fontSize: 10}}>
              {moment(from).format('MMM-DD hh:mm A')}
            </Typography>
            <Typography variant="overline" color="default" sx={{fontSize: 10, ml: 2}}>
              {moment(time).format('MMM-DD hh:mm A')}
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

          {/* <Box sx={{position: 'absolute', bottom: 20, right: 20}}>
            <Typography variant="overline" sx={{fontWeight: 'bold'}}>
              {status}
            </Typography>
          </Box> */}
        </CardContent>
      </Box>
    </Card>
  )
}
