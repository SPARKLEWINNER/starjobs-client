import React, {useEffect} from 'react'
import {useNavigate, Link as RouterLink} from '@reach/router'
import {styled} from '@mui/material/styles'
import {Stack, Container, Typography, Button, Box} from '@mui/material'

import Page from 'components/Page'
import {VerifyCodeForm} from 'components/authentication/login'

import storage from '../utils/storage'
import {useAuth} from '../contexts/AuthContext'

import {LoadingButtonOutline} from '../theme/style'

const RootStyle = styled(Page)(({theme}) => ({
  backgroundColor: theme.palette.common.white,
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}))

const ContentStyle = styled('div')(({theme}) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(0, 0)
}))

export default function VerificationPage() {
  const navigate = useNavigate()
  const {currentUser} = useAuth()

  const handleSignOut = async (e) => {
    e.preventDefault()
    await storage.remove()
    navigate('/login')
  }

  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      if (componentMounted) {
        if (!currentUser) return navigate('/login')
        if (currentUser.isVerified) return navigate(`/dashboard`, {replace: true})
      }
    }
    load()
    return () => {
      componentMounted = false
    }
    // eslint-disable-next-line
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
                  src="illustrations/email.png"
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
          <VerifyCodeForm account={currentUser} />

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
