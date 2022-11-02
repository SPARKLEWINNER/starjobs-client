import React from 'react'
import {Link as RouterLink} from '@reach/router'

// animation
import {motion} from 'framer-motion'
import {MotionContainer, varBounceIn} from 'components/animate'

// material
import {styled} from '@mui/material/styles'
import {Container, Typography, Link, Box} from '@mui/material'

// component
import Page from 'components/Page'

// hooks
import {useAuth} from 'contexts/AuthContext'

// styles
const RootStyle = styled(Page)(({theme}) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(10)
}))

export default function GigApplySuccess() {
  const {currentUser} = useAuth()
  const accountType = currentUser.accountType === 0 ? '/freelancer' : '/client'

  return (
    <RootStyle title="Application to Gig Posted! - Starjobs">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{maxWidth: 480, margin: 'auto', textAlign: 'center'}}>
            <motion.div variants={varBounceIn} sx={{mb: 3}}>
              <Box component="img" src="/static/illustrations/check.png" sx={{mx: 'auto', my: {xs: 2, sm: 2}}} />
            </motion.div>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" sx={{mb: 0}} paragraph>
                Your gig application has been noted!
              </Typography>
              <Typography sx={{color: 'text.secondary', my: 1}}>
                Please allow the client to evaluate your profile.
              </Typography>
              <Typography variant="body1" sx={{color: 'text.secondary', mb: 3}}>
                View updates on your{' '}
                <Link component={RouterLink} underline="none" to={`${accountType}/dashboard`}>
                  My Gigs
                </Link>{' '}
                page.
              </Typography>
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  )
}
