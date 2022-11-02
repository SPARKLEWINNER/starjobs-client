import React, {useState, useEffect} from 'react'
import {Stack, Typography, Box} from '@mui/material'
import {slice} from 'lodash'

import ActivityCard from 'components/activity/card'

import user_api from 'libs/endpoints/users'
import {useAuth} from 'contexts/AuthContext'

const LIMIT = 3
const MyActivities = () => {
  const {currentUser} = useAuth()
  const [isLoading, setLoading] = useState(false)
  const [ACTIVITY, setActivity] = useState([])
  const [render, setRender] = useState([])

  const renderCard = (v, index) => {
    if (!v) return ''
    return <ActivityCard gig={v} details={v} key={index} type={v.user.accountType} />
  }

  useEffect(() => {
    let componentMounted = true

    const load = async () => {
      setLoading(true)

      let result
      if (currentUser.accountType === 1) {
        result = await user_api.get_user_activity_client(currentUser._id)
      } else {
        result = await user_api.get_user_activity(currentUser._id)
      }

      if (!result.ok) {
        return setLoading(false)
      }

      const {data} = result.data
      if (data.length === 0) return setLoading(false)
      if (componentMounted) {
        setLoading(false)
        setActivity(data)
        setRender(slice(data, 0, LIMIT))
      }
    }

    load()
    return () => {
      componentMounted = false
    }
    // eslint-disable-next-line
  }, [currentUser])

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
