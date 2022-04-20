import {useState} from 'react'
import moment from 'moment'
import {capitalCase} from 'change-case'
// material
import {Box, Button, Typography} from '@material-ui/core'
import {LoadingButton} from '@material-ui/lab'
import {useSnackbar} from 'notistack5'

// component form
import {GigForm, BillingForm} from './form'
import {CreateGigDialog} from './dialog'

// hooks
import gigs_api from 'api/gigs'

const {REACT_APP_DISCORD_URL, REACT_APP_DISCORD_KEY_STARJOBS} = process.env
const webhook = require('webhook-discord')

export default function CreatGigForm({user, category}) {
  const {enqueueSnackbar} = useSnackbar()
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState([])

  const isStepSkipped = (step) => skipped.has(step)

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
    window.scrollTo(0, 0)
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
    if (!category) {
      enqueueSnackbar('Select category', {variant: 'error'})
      setLoading(false)
    }

    const discordHook = new webhook.Webhook(`${REACT_APP_DISCORD_URL}/${REACT_APP_DISCORD_KEY_STARJOBS}`)

    setLoading(true)
    setOpen(false)
    const form_data = {
      category: category,
      ...form,
    }

    const result = await gigs_api.post_gig(user._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Unable to process your gig posting', {variant: 'error'})
      return setLoading(false)
    }

    await discordHook.info(
      `Gig Posted Starjobs `,
      `\n\n**From:**\n ${user.name} - ${user.email}\n\n**Gig Details:**\n ${form.category} - ${form.position} \n${
        form.date
      } ${moment(form.from).format('MMM-DD hh:mm A')} - ${moment(form.time).format('MMM-DD hh:mm A')} \n ${
        form.shift
      } shift ${form.hours} hours \n Fee: P ${form.fee}`,
    )

    enqueueSnackbar('Gig post success', {variant: 'success'})
    setLoading(false)
    setActiveStep(0)
  }

  return (
    <>
      <Box sx={{textAlign: 'center', mt: 5, mb: 3}}>
        <Typography variant="h4">
          Gig Posting <br /> ({category && capitalCase(category.replace('-', ' '))}){' '}
        </Typography>
      </Box>
      {activeStep === 0 && <GigForm onNext={handleNext} formData={form} onStoreData={handleFormData} />}
      {activeStep === 1 && <BillingForm onNext={handleNext} storeData={form} />}

      <Box sx={{marginBottom: '120px', display: 'block', mt: 1}}>
        {activeStep === 1 && (
          <LoadingButton
            variant="contained"
            size="large"
            sx={{width: '100%'}}
            onClick={handleConfirm}
            loading={isLoading}
          >
            Post a Gig
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
      <CreateGigDialog open={open} onConfirm={handleSubmit} handleClose={handleCancelConfirm} />
    </>
  )
}
