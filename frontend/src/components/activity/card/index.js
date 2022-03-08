import {Link as RouterLink} from 'react-router-dom'
import moment from 'moment'
import {Box, Card, CardContent, Link, Typography, Stack} from '@material-ui/core'
import MonetizationOnOutlined from '@material-ui/icons/MonetizationOnOutlined'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import Label from 'components/Label'

const ActivityCard = ({gig, details}) => {
  if (!gig || !details) return ''

  const user = gig.user.pop()
  let timeAgo = moment(gig.details.filter((obj) => obj.status === 'Confirm-End-Shift').pop()).fromNow()

  return (
    <Card sx={{p: 0, display: 'flex', my: 1, backgroundColor: '#f7f7f7'}}>
      <Link
        underline="none"
        variant="caption"
        component={RouterLink}
        sx={{display: 'block', width: '100%', color: 'text.primary'}}
        to={`/history/details/${details._id}/${gig._id}`}
      >
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', px: 3, py: 2}}>
          <CardContent sx={{flex: '1 0 auto', p: '0 !important', alignItems: 'flex-start'}}>
            <Stack direction="row" sx={{alignItems: 'center', p: 0}}>
              <MonetizationOnOutlined sx={{fontSize: 32, mr: 2, color: '#ff2c2c'}} />

              <Stack direction="column" sx={{alignItems: 'flex-start', p: 0, mt: 1}}>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {gig.position} - {user && user.location}
                </Typography>
                <Typography variant="caption">
                  (Start: {moment(details.from).format('MMM-DD hh:mm A')} - End:
                  {moment(details.time).format('MMM-DD hh:mm A')})
                </Typography>
                <Box sx={{py: 1, px: 0, width: '100%', alignItems: 'center'}}>
                  <AccessTimeIcon sx={{fontSize: 12, mr: 1, color: 'text.secondary'}} />
                  <Typography variant="caption" sx={{color: 'text.secondary'}}>
                    {timeAgo}{' '}
                    <Label style={{marginLeft: '6px'}} color="success">
                      {gig.status === 'Confirm-End-Shift' ? 'Completed' : ''}
                    </Label>
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Box>
      </Link>
    </Card>
  )
}

export default ActivityCard
