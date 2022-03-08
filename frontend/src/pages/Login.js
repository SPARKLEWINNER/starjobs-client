import React, {useEffect, useContext} from 'react'
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom'
import {styled} from '@material-ui/core/styles'
import {Link, Stack, Container, Typography, Divider, Box} from '@material-ui/core'

import Page from '../components/Page'
import LogoOutline from 'components/LogoOutline'
import {LoginForm} from '../components/authentication/login'

import {UsersContext} from 'utils/context/users'

import {DividerWhite} from 'theme/style'

const RootStyle = styled(Page)(({theme}) => ({
  backgroundColor: theme.palette.starjobs.main,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const ContentStyle = styled('div')(({theme}) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3, 0),
}))

export default function Login() {
  const navigate = useNavigate()
  const {check_login} = useContext(UsersContext)
  const location = useLocation()

  const load = async () => {
    const user = await check_login()
    if (!user) return
    navigate(`${user.accessType}`)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <RootStyle title="Login - Starjobs">
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{mb: 5}}>
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 5, mb: 2}}>
              <Box
                component="img"
                src="/static/illustrations/login-user.png"
                sx={{width: 120, height: 120, objectFit: 'contain'}}
              />
            </Box>
          </Stack>
          <LoginForm />
          <Divider sx={DividerWhite}>
            <Typography variant="body2" sx={{color: 'common.white'}}>
              OR
            </Typography>
          </Divider>

          <Stack direction="column" spacing={2}>
            <div style={{margin: '1rem auto', width: '100%', textAlign: 'center'}}>
              <Typography
                color="common.white"
                style={{textTransform: 'initial', fontSize: '0.875rem', fontWeight: 400}}
                variant="body1"
              >
                Don't have an account?
                <Link
                  to={`/sign-up`}
                  component={RouterLink}
                  color="common.black"
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
          <Stack sx={{mt: 5}}>
            <Box sx={{display: 'flex', justifyContent: 'center', mb: 5}}>
              <RouterLink to="/">
                <LogoOutline />
              </RouterLink>
            </Box>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
