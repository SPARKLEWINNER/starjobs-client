import React, {useState, useEffect} from 'react'
import {styled} from '@mui/material/styles'
import {Stack, Container, Typography, Box} from '@mui/material'
import {slice} from 'lodash'

import Page from 'src/components/Page'
import LoadingScreen from 'src/components/LoadingScreen'

import storage from 'src/utils/storage'
import user_api from 'src/lib/users'
import NotificationCardV2 from 'src/components/notifications/card_v2'

const RootStyle = styled(Page)(({theme}) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}))

const ContentStyle = styled('div')(({theme}) => ({
  margin: '0',
  display: 'flex',
  minHeight: '50vh',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(3, 0)
}))

const LIMIT = 3
const Message = () => {
  const [isLoading, setLoading] = useState(false)
  const [notif, setNotifications] = useState([])
  const [render, setRender] = useState([])
  const [user, setUser] = useState([])

  const load = async () => {
    setLoading(true)

    const local_user = await storage.getUser()
    if (!local_user) return setLoading(false)

    const users = JSON.parse(local_user)
    if (users.length === 0) {
      return setLoading(false)
    }

    setUser(users)
    let result
    if (users.accountType === 1) {
      result = await user_api.get_user_notifications_client(users._id)
    } else {
      result = await user_api.get_user_notifications(users._id)
    }

    if (!result.ok) {
      return setLoading(false)
    }

    const {data} = result.data
    if (data.length === 0) return setLoading(false)
    setLoading(false)
    setNotifications(data)
    setRender(slice(data, 0, LIMIT))
  }

  const renderCard = (v, index) => {
    if (!v) return ''

    return (
      <NotificationCardV2
        key={index}
        id={v._id}
        uid={user._id}
        userType={user.accountType}
        title={v.title}
        body={v.body}
        type={v.type}
        notifData={v.additionalData}
        isRead={v.isRead}
        onCardClick={() => {
          notif[index].isRead = true
          let newArr = [...notif]
          setNotifications(newArr)
        }}
      />
    )
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [])

  return (
    <RootStyle title="Notifications - Starjobs">
      <Container maxWidth="sm">
        <ContentStyle>
          {isLoading && <LoadingScreen />}

          {!isLoading && render.length === 0 && (
            <Stack sx={{mb: 5}}>
              <Box>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                  <Box component="img" src="/static/illustrations/message.png" sx={{objectFit: 'contain'}} />
                </Box>
                <Box sx={{textAlign: 'center'}}>
                  <Typography variant="h4" sx={{color: 'text.secondary'}}>
                    Looks like you don't have any notifications yet.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          )}

          {!isLoading && render.length > 0 && (
            <>
              <Stack sx={{mb: 5, px: 1}}>
                {notif.length > 0 &&
                  notif.map((v, k) => {
                    return renderCard(v, k)
                  })}
              </Stack>
            </>
          )}
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}

export default Message
