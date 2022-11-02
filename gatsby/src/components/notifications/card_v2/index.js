import React from 'react'
import {Box, Card, CardContent, Stack, Typography} from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import {navigate} from 'gatsby'
import user_api from 'libs/endpoints/users'
import PropTypes from 'prop-types'

const NotificationCardV2 = ({
  id = '',
  uid = '',
  title = 'Title',
  body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  type = 'Notification',
  notifData = '{"name":"John", "age":30, "car":null}',
  isRead = false,
  notifTime,
  onCardClick = () => {}
}) => {
  const moment = require('moment-timezone')
  const notifTimeAgo = moment(notifTime).tz('Asia/Manila').startOf('second').fromNow()
  const notifClickHandler = () => {
    if (notifData) {
      let json = JSON.parse(notifData)
      console.log(json)
    }
  }

  const gigNotifClickHandler = () => {
    let jsonData = JSON.parse(notifData)
    //route to gig details page
    if (notifData) {
      if (jsonData.data) {
        return navigate(`/notification/details/${jsonData.data._id}/${jsonData.data._id}`)
      } else {
        return navigate(`/notification/details/${jsonData._id}/${jsonData._id}`)
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
          <Stack direction="row" spacing={2} sx={{justifyContent: 'space-between', alignItems: 'center', p: 0, mt: 1}}>
            <Typography variant="caption">{body}</Typography>
            <Typography sx={{}} variant="caption">
              {notifTimeAgo}
            </Typography>
          </Stack>
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
  notifTime: PropTypes.string,
  onCardClick: PropTypes.func
}

export default NotificationCardV2
