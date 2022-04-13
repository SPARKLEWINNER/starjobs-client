import {useState, useContext, useEffect} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {styled} from '@material-ui/core/styles'
// material
import {Box, Container, Paper, Button, Link, MobileStepper} from '@material-ui/core'

import Page from 'components/Page'
import {Verified, Start, Notification, Complete} from 'components/welcome'
import {useAuth} from 'utils/context/AuthContext'
import {UsersContext} from 'utils/context/users'

import {LoadingButtonStyle} from 'theme/style'
const steps = ['Verified', 'Notification', 'Profile', 'Start']

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
  minHeight: '100vh',

  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(1, 0),
}))

export default function Welcome() {
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const {currentUser} = useAuth()

  const isStepOptional = (step) => step === 2

  const isStepSkipped = (step) => skipped.has(step)

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  return (
    <RootStyle title="Employee Registration - Starjobs">
      <Container maxWidth="sm">
        <ContentStyle>
          {activeStep === steps.length ? (
            ''
          ) : (
            <>
              <Paper sx={{p: 1, backgroundColor: 'starjobs.main'}}>
                {activeStep === 0 && <Verified />}
                {activeStep === 1 && <Notification />}
                {activeStep === 2 && <Complete user={currentUser} />}
                {activeStep === 3 && <Start />}
              </Paper>
            </>
          )}
          <MobileStepper
            variant="dots"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{
              alignItems: 'center',
              backgroundColor: 'starjobs.main',
              '& .MuiMobileStepper-dot': {
                backgroundColor: 'common.white',
              },
              '& .MuiMobileStepper-dot.MuiMobileStepper-dotActive': {
                backgroundColor: 'common.black',
              },
            }}
            nextButton={
              <Box sx={{display: 'flex'}}>
                <Box sx={{flexGrow: 1}} />
                {isStepOptional(activeStep) ? (
                  <Button color="inherit" sx={{...LoadingButtonStyle, mr: 1}} onClick={handleSkip}>
                    Skip
                  </Button>
                ) : activeStep === steps.length - 1 ? (
                  <Link component={RouterLink} to={`/dashboard`} sx={{textDecoration: 'none'}}>
                    <Button variant="contained" sx={LoadingButtonStyle} onClick={handleNext}>
                      Let's Go!
                    </Button>
                  </Link>
                ) : (
                  <Button variant="contained" sx={LoadingButtonStyle} onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            }
            backButton={
              <Box sx={{backgroundColor: 'starjobs.main'}}>
                {activeStep !== 0 ? (
                  <Button Button size="small" sx={LoadingButtonStyle} onClick={handleBack} disabled={activeStep === 0}>
                    Back
                  </Button>
                ) : (
                  <Box />
                )}
              </Box>
            }
          />
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
