import {useEffect} from 'react'
import NProgress from 'nprogress'
import {Box, CircularProgress} from '@mui/material'

function ProgressCircle() {
  useEffect(() => {
    NProgress.start()

    return () => {
      NProgress.done()
    }
  }, [])

  return (
    <Box sx={{width: '100%', height: '100%', my: 20}} display="flex" alignItems="center" justifyContent="center">
      <CircularProgress size={64} disableShrink thickness={3} />
    </Box>
  )
}

export default ProgressCircle
