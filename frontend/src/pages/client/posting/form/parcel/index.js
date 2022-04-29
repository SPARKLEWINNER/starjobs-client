import {useState} from 'react'
// material
import {Box, Button, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'

// component form
import {ParcelForm, BillingForm} from './form'
import {CreateParcelDialog} from './dialog'

// hooks
import gigs_api from 'src/lib/gigs'
import PropTypes from 'prop-types'

CreateParcelForm.propTypes = {
  user: PropTypes.object
}

const {REACT_APP_DISCORD_URL, REACT_APP_DISCORD_KEY_STARJOBS} = process.env
const webhook = require('webhook-discord')

export default function CreateParcelForm({user}) {
  const discordHook = new webhook.Webhook(`${REACT_APP_DISCORD_URL}/${REACT_APP_DISCORD_KEY_STARJOBS}`)
  const {enqueueSnackbar} = useSnackbar()
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState([])

  const tConvert = (date) => {
    date = date.replace('PM', '').replace('AM', '')
    var hours = date.split(':')[0]
    var minutes = date.split(':')[1]
    var ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? minutes : minutes
    var strTime = hours + ':' + minutes + ' ' + ampm
    return strTime
  }

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

  const handleFormData = (form_data) => {
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

    try {
      const form_data = {
        ...form
      }
      const result = await gigs_api.post_gig(user._id, form_data)
      if (!result.ok) return enqueueSnackbar('Unable to process your parcel posting', {variant: 'error'})

      await discordHook.info(
        `Gig Posted Starjobs `,
        `\n\n**From:**\n ${user.name} - ${user.email}\n\n**Gig Details:**\n ${form.category} - ${form.position} \n${
          form.date
        } ${tConvert(form.from)} - ${tConvert(form.time)} \n ${form.shift} shift ${form.hours} hours \n Fee: P ${
          form.fee
        }`
      )

      enqueueSnackbar('Parcel post success', {variant: 'success'})
    } catch (error) {
      console.log(error)
    } finally {
      setActiveStep(0)
      setLoading(false)
    }
  }

  return (
    <>
      <Box sx={{textAlign: 'center', mt: 5, mb: 3}}>
        <Typography variant="h4">Parcel</Typography>
      </Box>
      {activeStep === 0 ? <ParcelForm onNext={handleNext} onStoreData={handleFormData} /> : ''}
      {activeStep === 1 ? <BillingForm onNext={handleNext} storeData={form} /> : ''}
      <Box sx={{marginBottom: '120px', display: 'block', mt: 1}}>
        {activeStep === 1 && (
          <LoadingButton
            variant="contained"
            size="large"
            sx={{width: '100%'}}
            onClick={handleConfirm}
            loading={isLoading}
          >
            Post A Parcel
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
      <CreateParcelDialog open={open} onConfirm={handleSubmit} handleClose={handleCancelConfirm} />
    </>
  )
}
