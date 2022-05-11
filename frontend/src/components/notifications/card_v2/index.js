import {Box, Card, CardContent, Stack, Typography} from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import {useNavigate} from 'react-router-dom'
import user_api from 'src/lib/users'

import PropTypes from 'prop-types'

const NotificationCardV2 = ({
  id = '',
  uid = '',
  userType = 0,
  title = 'Title',
  body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  type = 'Notification',
  notifData = '{"name":"John", "age":30, "car":null}',
  isRead = false,
  onCardClick = () => {}
}) => {
  const parseData = notifData && JSON.parse(notifData)
  const navigate = useNavigate()

  const notifClickHandler = () => {
    if (notifData) {
      let json = JSON.parse(notifData)
      console.log(json)
    }
  }

  const gigNotifClickHandler = () => {
    let jsonData = JSON.parse(notifData)
    console.log(jsonData)
    //route to gig details page
    if (notifData) {
      if (userType === 1) {
        navigate(`/notification/details/${jsonData.data._id}/${jsonData.data._id}`)
      } else {
        navigate(`/notification/details/${jsonData.data._id}/${jsonData.data._id}`)
      }
    }
  }

  const clientInterestClickHandler = () => {
    //route to client details page
    if (notifData) {
      let json = JSON.parse(notifData)
      navigate(`/gigs/details/${json._id}/all`)
    }
  }

  const clickHandler = async (notifType) => {
    await user_api.put_user_notification_read(uid, id)
    onCardClick()
    switch (notifType) {
      case 'Notification':
        notifClickHandler()
        break
      case 'GigNotif':
        gigNotifClickHandler()
        break
      case 'ClientInterest':
        clientInterestClickHandler()
        break
      default:
        notifClickHandler()
        break
    }
  }

  console.log(parseData)
  return (
    <Card
      sx={{p: 0, display: 'flex', my: 1}}
      onClick={() => {
        clickHandler(type)
      }}
    >
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', px: 3, py: 2}}>
        <CardContent sx={{flex: '1 0 auto', p: '0 !important', alignItems: 'flex-start'}}>
          <Stack direction="row" spacing={2} sx={{alignItems: 'center', p: 0, mt: 1}}>
            <CircleIcon sx={{opacity: 10, color: isRead ? 'text.secondary' : '#ff2c2c'}} />
            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
              {title}
            </Typography>
          </Stack>
          <Typography variant="caption">{body}</Typography>
        </CardContent>
      </Box>
    </Card>
  )
}

NotificationCardV2.propTypes = {
  id: PropTypes.string,
  uid: PropTypes.string,
  userType: PropTypes.number,
  title: PropTypes.string,
  body: PropTypes.string,
  type: PropTypes.string,
  notifData: PropTypes.string,
  isRead: PropTypes.bool,
  onCardClick: PropTypes.func
}

export default NotificationCardV2
