import React, {useState, useEffect} from 'react'
import {Stack, Typography, Box} from '@material-ui/core'
import {slice} from 'lodash'

import ActivityCard from 'components/activity/card'

import storage from 'utils/storage'
import user_api from 'utils/api/users'

const LIMIT = 3
const MyActivities = () => {
  const [isLoading, setLoading] = useState(false)
  const [ACTIVITY, setActivity] = useState([])
  const [render, setRender] = useState([])

  const load = async () => {
    setLoading(true)

    const local_user = await storage.getUser()
    if (!local_user) return setLoading(false)

    const users = JSON.parse(local_user)
    if (users.length === 0) {
      return setLoading(false)
    }

    let result
    if (users.accountType === 1) {
      result = await user_api.get_user_activity_client(users._id)
    } else {
      result = await user_api.get_user_activity(users._id)
    }

    if (!result.ok) {
      return setLoading(false)
    }

    const {data} = result.data
    if (data.length === 0) return setLoading(false)
    setLoading(false)
    setActivity(data)
    setRender(slice(data, 0, LIMIT))
  }

  const renderCard = (v, index) => {
    if (!v) return ''
    return <ActivityCard gig={v} details={v} key={index} type={v.user.accountType} />
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {isLoading && ''}
      {render.length === 0 ? (
        <Stack sx={{mb: 5}}>
          <Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <Box component="img" src="/static/illustrations/verified.png" sx={{objectFit: 'contain'}} />
            </Box>
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h4" sx={{color: 'text.secondary'}}>
                Looks like you don't have any gig receipt/s
              </Typography>
            </Box>
          </Box>
        </Stack>
      ) : (
        <>
          <Stack sx={{mb: 5, px: 1}}>
            {ACTIVITY.length > 0 &&
              ACTIVITY.map((v, k) => {
                return renderCard(v, k)
              })}
          </Stack>
        </>
      )}
    </>
  )
}

export default MyActivities
