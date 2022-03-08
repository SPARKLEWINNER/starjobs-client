import moment from 'moment'
// material
import {Stack, Card, Typography, Grid} from '@material-ui/core'

// utils
import {calculations} from 'utils/gigComputation'

const ActivityDetailsCard = ({details}) => {
  if (!details || details === undefined) return ''

  let {_id, position, from, time, fee, hours} = details

  let {serviceCost} = calculations(hours, fee)

  return (
    <Stack sx={{mb: 5}}>
      <Card sx={{p: 2}}>
        <Grid container>
          <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
            <Typography variant="overline">Name</Typography>
          </Grid>
          <Grid item xs={8} sm={8}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {position}
            </Typography>
          </Grid>
          <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
            <Typography variant="overline">Date</Typography>
          </Grid>
          <Grid item xs={8} sm={8}>
            <Stack direction="row" sx={{my: 1}}>
              <Typography variant="overline" color="default" sx={{fontSize: 10}}>
                Start: {moment(from).format('MMM-DD hh:mm A')}
              </Typography>
              <Typography variant="overline" color="default" sx={{fontSize: 10, ml: 2}}>
                End: {moment(time).format('MMM-DD hh:mm A')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      <Card sx={{p: {xs: 1, sm: 2}, my: 3}}>
        <Typography variant="overline" sx={{py: 2, px: 3}}>
          Gid ID
        </Typography>
        <Typography variant="h6" sx={{py: 1, px: 3, fontWeight: 'bold', wordBreak: 'break-all', width: '100%'}}>
          {_id}
        </Typography>
      </Card>
      <Card sx={{p: 3, mb: 10}}>
        <Stack direction="column">
          <Grid container>
            <Grid item xs={6} md={6}>
              <Typography variant="overline">Gig Fee per hr</Typography>
            </Grid>
            <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
              <Typography variant="overline" sx={{fontWeight: 'bold'}}>
                {Number(fee).toFixed(2)} / hr
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography variant="overline">No. of hours</Typography>
            </Grid>
            <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
              <Typography variant="overline" sx={{fontWeight: 'bold'}}>
                {hours} {hours && hours.length > 1 ? 'hrs' : 'hr'}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography variant="overline">Total service cost</Typography>
            </Grid>
            <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
              <Typography variant="overline" sx={{fontWeight: 'bold', fontSize: 16}} color="#1e9627">
                P {serviceCost.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  )
}

export default ActivityDetailsCard
