import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {styled} from '@material-ui/core/styles'
import {Link, Stack, Container, Typography} from '@material-ui/core'

import Page from '../components/Page'
import LogoOutline from 'components/LogoOutline'
import {LoginForm} from '../components/authentication/login'

const RootStyle = styled(Page)(({theme}) => ({
  backgroundColor: theme.palette.common.white,
  height: '100vh',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const ContentStyle = styled('div')(({theme}) => ({
  maxWidth: 340,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3, 0),
}))

export default function Login() {
  return (
    <RootStyle title="Login - Starjobs">
      <Container maxWidth="sm" sx={{height: 'inherit'}}>
        <ContentStyle>
          <Stack sx={{mt: 0, mb: 3}}>
            <LogoOutline />
          </Stack>

          <Typography color="starjobs.main" style={{textTransform: 'initial', fontWeight: 600, mb: 3}} variant="h3">
            Welcome Back!
          </Typography>

          <Typography
            color="starjobs.fieldLabel"
            style={{textTransform: 'initial', fontSize: '0.8rem', fontWeight: 300, mb: 2}}
            variant="body1"
          >
            Enter your credentials to continue.
          </Typography>

          <LoginForm />

          <Stack direction="column" spacing={2}>
            <div style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>
              <Typography
                color="common.black"
                style={{textTransform: 'initial', fontSize: '0.8rem', fontWeight: 400}}
                variant="h6"
              >
                Don't have an account?
                <Link
                  to={`/sign-up`}
                  component={RouterLink}
                  color="starjobs.main"
                  style={{
                    marginLeft: '.25rem',
                    width: '100%',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Create Account
                </Link>
              </Typography>
            </div>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
