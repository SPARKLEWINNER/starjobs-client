// material
import {styled} from '@material-ui/core/styles'
import {Link, Container, Typography, Box} from '@material-ui/core'
import {Link as RouterLink} from 'react-router-dom'
// layouts
// components
import Page from '../components/Page'
import {RegistrationForm} from '../components/authentication/registration'

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function StoreRegistration() {
  return (
    <RootStyle title="Registration - Starjobs">
      <Container maxWidth="sm">
        <ContentStyle>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', mt: 5, mb: 5}}>
            <Typography variant="h2" color="common.white">
              Sign up
            </Typography>
          </Box>

          <RegistrationForm />

          <div style={{margin: '2rem auto', width: '100%', textAlign: 'center'}}>
            <Link to={`/login`} component={RouterLink}>
              <Typography color="common.white" style={{textTransform: 'initial'}} variant="body1" component="p">
                I already have an account{' '}
                <Typography
                  component="span"
                  color="common.black"
                  style={{marginLeft: '.25rem', width: '100%', textDecoration: 'none', fontWeight: 600}}
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
