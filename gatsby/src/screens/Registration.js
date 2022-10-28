// import React from 'react'
// material
import {styled} from '@mui/material/styles'
import {Link, Container, Typography, Box} from '@mui/material'
import {Link as RouterLink} from '@reach/router'
// layouts
// components
import Page from 'components/Page'
import {RegistrationForm} from 'components/authentication/registration'

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
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3, 0)
}))

export default function Registration() {
  return (
    <RootStyle title="Registration - Starjobs">
      <Container maxWidth="sm">
        <ContentStyle>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', mt: 0, mb: 5}}>
            <Typography
              color="starjobs.main"
              style={{textTransform: 'initial', fontWeight: 'bold', mb: 3, width: '75%', lineHeight: 'initial'}}
              variant="h3"
            >
              Let's create your account
            </Typography>
          </Box>

          <RegistrationForm />

          <div style={{margin: '2rem auto', width: '100%', textAlign: 'center'}}>
            <Link to={`/login`} component={RouterLink} sx={{textDecoration: 'none'}}>
              <Typography
                color="starjobs.fieldLabel"
                style={{textTransform: 'initial', fontSize: '0.8rem', fontWeight: 400}}
                variant="body1"
                component="p"
              >
                I already have an account{' '}
                <Typography
                  component="span"
                  color="starjobs.main"
                  style={{
                    marginLeft: '.25rem',
                    fontSize: '0.8rem',
                    width: '100%',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Go back
                </Typography>
              </Typography>
            </Link>
          </div>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
