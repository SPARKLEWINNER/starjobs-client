// import from 'react'
import {motion} from 'framer-motion'
import {Link as RouterLink} from '@reach/router'
// material
import {styled} from '@mui/material/styles'
import {Box, Button, Typography, Container} from '@mui/material'
// components
import {MotionContainer, varBounceIn} from 'components/animate'
import Page from 'components/Page'

const RootStyle = styled(Page)(({theme}) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(10)
}))

export default function OnboardSuccess() {
  return (
    <RootStyle title="Congratulations! - Starjobs">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{maxWidth: 480, margin: 'auto', textAlign: 'center'}}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" sx={{mb: 0}} paragraph>
                Congratulations!
              </Typography>
            </motion.div>
            <Typography sx={{color: 'text.secondary'}}>You're halfway in getting a client</Typography>

            <motion.div variants={varBounceIn} sx={{mb: 3}}>
              <Box component="img" src="/static/illustrations/check.png" sx={{mx: 'auto', my: {xs: 2, sm: 2}}} />
              <Typography variant="body1" sx={{mb: 0, fontWeight: 'bold'}} paragraph>
                Reminder
              </Typography>
              <Typography variant="body2" sx={{color: 'text.secondary', mb: 3}}>
                Upload your supporting credentials in your personal dashboard to get verified.
              </Typography>
              <Button to="/freelancer/app" size="large" variant="contained" component={RouterLink}>
                View Dashboard
              </Button>
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  )
}
