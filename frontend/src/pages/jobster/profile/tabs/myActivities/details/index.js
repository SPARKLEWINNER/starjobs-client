// material
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Stack, Typography} from '@mui/material'
import {styled} from '@mui/material/styles'

// components
import Page from 'src/components/Page'
import ActivityDetailsCard from 'src/components/activity/details'

import user_api from 'src/lib/users'

const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

const ActivityDetailsPage = () => {
  const params = useParams()
  const [data, setData] = useState([])

  const load = async () => {
    if (!params) return false

    const result = await user_api.get_user_notifications_details(params.id)
    if (!result.ok) return false
    let {data} = result.data
    setData(data[0])
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
    <Page title="My Activity Details - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        <Typography variant="h4" sx={{display: 'block', width: '100%', textAlign: 'center', mb: 3}}>
          Gig Receipt
        </Typography>
        <ActivityDetailsCard details={data} />
      </MainStyle>
    </Page>
  )
}

export default ActivityDetailsPage
