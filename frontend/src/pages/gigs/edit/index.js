import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

// material
import {Box, Button, Stack} from '@material-ui/core'
import {LoadingButton} from '@material-ui/lab'
import {useSnackbar} from 'notistack5'
import {styled} from '@material-ui/core/styles'

// components
import Page from 'components/Page'
import {EditGigForm, EditBillingForm} from './form'
import EditDialog from './dialog'

// hooks
import storage from 'utils/storage'
import gigs_api from 'api/gigs'

const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const Edit = () => {
  const params = useParams()
  const {enqueueSnackbar} = useSnackbar()
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [CURRENT_USER, setUser] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState([])
  const [GIG_DETAILS, setGig] = useState([])

  useEffect(() => {
    const load = async () => {
      if (!params || !params.id) {
        return enqueueSnackbar('Unable to edit this gig', {variant: 'error'})
      }

      const local_user = await storage.getUser()
      if (!local_user) {
        return
      }

      const user = JSON.parse(local_user)
      if (!user) {
        return setLoading(false)
      }

      const request = await gigs_api.get_gig_details(params.id)
      if (!request.ok) {
        enqueueSnackbar('Unable to edit this gig', {variant: 'error'})
        return
      }

      setGig(request.data)
      setUser(user)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleFormData = (form_data, form_type) => {
    if (!form_data) return

    setForm((prev_state) => ({...prev_state, ...form_data}))
  }

  const handleConfirm = () => {
    setOpen(true)
  }

  const handleCancelConfirm = () => {
    setOpen(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setOpen(false)
    const form_data = {
      ...form,
    }

    const result = await gigs_api.patch_gig_details(params.id, CURRENT_USER._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Unable to process your gig posting', {variant: 'error'})
      return setLoading(false)
    }

    enqueueSnackbar('Gig edit success', {variant: 'success'})
    setLoading(false)
    setActiveStep(0)
    window.location.reload()
  }

  return (
    <Page title="Edit Gig - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        <>
          {Object.keys(GIG_DETAILS).length > 0 && (
            <>
              {activeStep === 0 && <EditGigForm data={GIG_DETAILS} onNext={handleNext} onStoreData={handleFormData} />}
              {activeStep === 1 && <EditBillingForm onNext={handleNext} storeData={form} />}
            </>
          )}
          <Box sx={{marginBottom: '120px', display: 'block', mt: 1}}>
            {activeStep === 1 && (
              <LoadingButton
                variant="contained"
                size="large"
                sx={{width: '100%'}}
                onClick={handleConfirm}
                loading={isLoading}
              >
                Save Changes
              </LoadingButton>
            )}
            {activeStep !== 0 && (
              <Button
                size="large"
                variant="outlined"
                sx={{width: '100%', textAlign: 'center', mt: 3, mb: 5}}
                onClick={handleBack}
              >
                Go Back
              </Button>
            )}
          </Box>
          <EditDialog open={open} onConfirm={handleSubmit} handleClose={handleCancelConfirm} />
        </>
      </MainStyle>
    </Page>
  )
}

export default Edit
