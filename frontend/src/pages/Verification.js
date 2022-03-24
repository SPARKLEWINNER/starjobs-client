import React, {useEffect, useState} from 'react'
import {useNavigate, Link as RouterLink} from 'react-router-dom'
import {styled} from '@material-ui/core/styles'
import {Stack, Container, Typography, Button, Box} from '@material-ui/core'

import Page from '../components/Page'
import {VerifyCodeForm} from '../components/authentication/login'

import storage from 'utils/storage'
import user_api from 'api/users'

import {LoadingButtonOutline} from 'theme/style'

const RootStyle = styled(Page)(({theme}) => ({
  backgroundColor: theme.palette.common.white,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const ContentStyle = styled('div')(({theme}) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(0, 0),
}))

export default function VerificationPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState()

  const handleSignOut = async (e) => {
    e.preventDefault()
    await storage.remove()
    navigate('/login')
  }

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return

      const check_user = await user_api.get_user(JSON.parse(local_user)._id)
      if (!check_user.ok) {
        return navigate('/login')
      }

      let user = check_user.data
      user.token = JSON.parse(local_user).token

      await storage.storeUser(user)
      if (user.isVerified) {
        if (user.accountType === 0) return navigate(`/freelancer/app`, {replace: true})
        return navigate(`/client/app`, {replace: true})
      }
      setUser(user)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <RootStyle title="Employee Registration - Starjobs">
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{textAlign: 'center'}}>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <RouterLink to="/">
                <Box
                  component="img"
                  src="/static/illustrations/email.png"
                  sx={{width: '80%', mx: 'auto', objectFit: 'contain'}}
                />
              </RouterLink>
            </Box>
            <Typography variant="h6" gutterBottom color="starjobs.main" sx={{mb: 0}}>
              Account Verification
            </Typography>

            <Typography color="starjobs.fieldLabel" variant="caption">
              Kindly check your email account for Six (6) Verification Code.
            </Typography>
          </Stack>
          <VerifyCodeForm account={user} />

          <Stack sx={{my: 1}}>
            <Button
              variant="outlined"
              size="medium"
              sx={{...LoadingButtonOutline, fontSize: '0.75rem'}}
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
