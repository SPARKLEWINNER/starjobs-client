// material
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Stack, Typography} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'

// components
import Page from 'components/Page'
import NotificationsDetailsCard from 'components/notifications/details'

import user_api from 'api/users'

import {useAuth} from 'utils/context/AuthContext'

const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const NotificationDetailsPage = () => {
  const params = useParams()
  const [data, setData] = useState([])
  const {currentUser} = useAuth()

  const load = async () => {
    if (!params) return false

    const result = await user_api.get_user_notifications_details(params.id)
    if (!result.ok) return false
    let {data} = result.data
    setData(data[0])
    await user_api.patch_user_notification_read(params.hid, currentUser._id)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [params])

  return (
    <Page title="Notification Details - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        <Typography variant="h4" sx={{display: 'block', width: '100%', textAlign: 'center', mt: 5}}>
          Notification Details
        </Typography>
        <NotificationsDetailsCard details={data} />
      </MainStyle>
    </Page>
  )
}

export default NotificationDetailsPage
