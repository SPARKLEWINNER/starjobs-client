import React, {useState, useEffect} from 'react'
import {Link as RouterLink} from '@reach/router'

// material
import {Stack, Typography, Box} from '@mui/material'

export default function NotificationTab() {
  const [isEnable, setEnabled] = useState(false)

  const checkIfPushIsEnabled = () => {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') <= -1) return
    }

    navigator.serviceWorker.ready.then((registration) => {
      if (!registration.pushManager) {
        alert('Push Unsupported')
        return
      }
    })
    //---check if push notification permission has been denied by the user---
    if (Notification.permission === 'denied') {
      console.log('User has blocked push notification.')
      Notification.requestPermission()
      setEnabled(false)
      return
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission()
      setEnabled(false)
      return
    }

    //---check if push notification is supported or not---
    if (!('PushManager' in window)) {
      alert(`Sorry, Push notification is not supported on this browser.`)
      return
    }
    //---get push notification subscription if serviceWorker is registered and ready---
    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager
        .getSubscription()
        .then(function (subscription) {
          console.log('subscription', subscription)
          if (!subscription) return

          console.log(subscription)
        })
        .catch(function (error) {
          console.error('Error occurred enabling push ', error)
        })
    })
  }

  useEffect(() => {
    checkIfPushIsEnabled()
  }, [])

  useEffect(() => {}, [isEnable])

  return (
    <Stack sx={{mb: 5}}>
      <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}}>
        <RouterLink to="/">
          <Box component="img" src="/static/illustrations/settings.png" sx={{width: '100%', objectFit: 'contain'}} />
        </RouterLink>
      </Box>

      <Box sx={{textAlign: 'center'}}>
        <Typography variant="h4" color="common.white" gutterBottom>
          Allow the Notification
        </Typography>
        <Typography color="common.white">Kindly Press "Allow" to receive updates within the app.</Typography>
      </Box>
    </Stack>
  )
}
