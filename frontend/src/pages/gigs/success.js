import React, {useState, useEffect} from 'react'
import {Link as RouterLink} from 'react-router-dom'

// animation
import {motion} from 'framer-motion'
import {MotionContainer, varBounceIn} from 'components/animate'

// material
import {styled} from '@material-ui/core/styles'
import {Container, Typography, Link, Box} from '@material-ui/core'

// component
import Page from 'components/Page'

// hooks
import storage from 'utils/storage'

// styles
const RootStyle = styled(Page)(({theme}) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(10),
}))

export default function GigApplySuccess() {
  const [user, setUser] = useState([])

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return

      const user = JSON.parse(local_user)
      setUser(user)
    }

    load()
  }, [])

  const accountType = user.accountType === 0 ? '/freelancer' : '/client'
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
                <Link component={RouterLink} underline="none" to={`${accountType}/app`}>
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
