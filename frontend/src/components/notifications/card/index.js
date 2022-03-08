import {Link as RouterLink} from 'react-router-dom'
import moment from 'moment'
import {Box, Card, CardContent, Link, Typography, Stack} from '@material-ui/core'
import CircleIcon from '@material-ui/icons/Circle'
import AccessTimeIcon from '@material-ui/icons/AccessTime'

const NotificationCard = ({gig, details, type}) => {
  if (!gig || !details) return ''
  const user = details.user.pop()

  const checkStatusTitle = (status) => {
    if (!status) return
    switch (status) {
      case 'Accepted':
        if (type === 1) return 'Applicant Accepted'
        return 'Apply Success'
      case 'Confirm-Gig':
        return 'Gig Confirmed'
      case 'Arrived':
        if (type === 1) return 'Jobster has arrived'
        return 'You have arrived'
      case 'On-the-way':
        if (type === 1) return 'Jobster is on the way'
        return 'You are on the way'
      case 'Applying':
      case 'Confirm-Arrived':
      case 'On-going':
      case 'Cancelled':
        return 'Gig Status Updated'
      case 'Confirm-End-Shift':
        return 'Gig Completed'
      case 'End-Shift':
        return 'Waiting for Confirmation'
      default:
        return ''
    }
  }

  const checkStatusMessage = (status, data) => {
    const {position} = data
    if (!status) return
    switch (status) {
      case 'Applying':
        if (type === 1) return `Applicant has sent a gig request`
        return `Your application has been sent`
      case 'Accepted':
        if (type === 1)
          return `You have accepted the jobster's application in ${position} - ${user.location} - (Start: ${moment(
            details.from,
          ).format('MMM-DD hh:mm A')} - End: ${moment(details.time).format('MMM-DD hh:mm A')})})`
        return `Your application has been accepted in ${position} - ${user.location} -(Start: ${moment(
          details.from,
        ).format('MMM-DD hh:mm A')} - End: ${moment(details.time).format('MMM-DD hh:mm A')})})`
      case 'Confirm-Gig':
        if (type === 1)
          return `The jobster's confirmed his/her gig for ${position} - ${user.location} - (Start: ${moment(
            details.from,
          ).format('MMM-DD hh:mm A')} - End: ${moment(details.time).format('MMM-DD hh:mm A')})})`
        return `You have confirmed your gig in ${position} - ${user.location} -(Start: ${moment(details.from).format(
          'MMM-DD hh:mm A',
        )} - End: ${moment(details.time).format('MMM-DD hh:mm A')})`
      case 'On-the-way':
      case 'Arrived':
      case 'Confirm-Arrived':
      case 'On-going':
      case 'Cancelled':
      case 'End-Shift':
        return `${position} - ${user.location}- (Start: ${moment(details.from).format(
          'MMM-DD hh:mm A',
        )} - End: ${moment(details.time).format('MMM-DD hh:mm A')}) has been updated to "${status}" status`
      case 'Confirm-End-Shift':
        return `${position} - ${user.location}- (Start: ${moment(details.from).format(
          'MMM-DD hh:mm A',
        )} - End: ${moment(details.time).format('MMM-DD hh:mm A')}) has been marked completed.`

      default:
        return 'Gig updated'
    }
  }

  let {dateCreated} = details
  const msg = checkStatusMessage(gig.status, details)
  const title = checkStatusTitle(gig.status)
  let timeAgo = moment(dateCreated).fromNow()

  return (
    <Card sx={{p: 0, display: 'flex', my: 1}}>
      <Link
        underline="none"
        variant="caption"
        component={RouterLink}
        sx={{display: 'block', width: '100%', color: 'text.primary'}}
        to={`/notification/details/${details._id}/${gig._id}`}
      >
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', px: 3, py: 2}}>
          <CardContent sx={{flex: '1 0 auto', p: '0 !important', alignItems: 'flex-start'}}>
            <Stack direction="row" sx={{alignItems: 'center', p: 0}}>
              {type === 0 ? (
                !gig.readUser ? (
                  <CircleIcon sx={{fontSize: 12, mr: 1, color: '#ff2c2c'}} />
                ) : (
                  <CircleIcon sx={{fontSize: 12, mr: 1, color: 'text.secondary'}} />
                )
              ) : (
                ''
              )}
              {type === 1 ? (
                !gig.readAuthor ? (
                  <CircleIcon sx={{fontSize: 12, mr: 1, color: '#ff2c2c'}} />
                ) : (
                  <CircleIcon sx={{fontSize: 12, mr: 1, color: 'text.secondary'}} />
                )
              ) : (
                ''
              )}
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {title}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{alignItems: 'center', p: 0, mt: 1}}>
              <CircleIcon sx={{opacity: 0}} />
              <Typography variant="caption">{msg}</Typography>
            </Stack>

            <Stack direction="row" sx={{alignItems: 'center', mt: 1}}>
              <Box sx={{ml: 3, p: 0, width: '50%', alignItems: 'center'}}>
                <AccessTimeIcon sx={{fontSize: 12, mr: 1, color: 'text.secondary'}} />
                <Typography variant="caption" sx={{color: 'text.secondary'}}>
                  {timeAgo}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Box>
      </Link>
    </Card>
  )
}

export default NotificationCard
