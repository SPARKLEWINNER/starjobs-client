import {useState, useEffect} from 'react'
// material
import {Box, Button, Typography} from '@material-ui/core'
import {LoadingButton} from '@material-ui/lab'
import {useSnackbar} from 'notistack5'

// component form
import {ParcelForm, BillingForm} from './form'
import {CreateParcelDialog} from './dialog'

// hooks
import storage from 'utils/storage'
import gigs_api from 'api/gigs'

const {REACT_APP_DISCORD_URL, REACT_APP_DISCORD_KEY_STARJOBS} = process.env
const webhook = require('webhook-discord')

export default function GigCreate() {
  const discordHook = new webhook.Webhook(`${REACT_APP_DISCORD_URL}/${REACT_APP_DISCORD_KEY_STARJOBS}`)
  const {enqueueSnackbar} = useSnackbar()
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [user, setUser] = useState([])
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

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) {
        return
      }

      const user = JSON.parse(local_user)
      if (!user) {
        return setLoading(false)
      }

      setUser(user)
      setLoading(false)
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

    const result = await gigs_api.post_gig(user._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Unable to process your parcel posting', {variant: 'error'})
      return setLoading(false)
    }

    await discordHook.info(
      `Gig Posted Starjobs `,
      `\n\n**From:**\n ${user.name} - ${user.email}\n\n**Gig Details:**\n ${form.category} - ${form.position} \n${
        form.date
      } ${tConvert(form.from)} - ${tConvert(form.time)} \n ${form.shift} shift ${form.hours} hours \n Fee: P ${
        form.fee
      }`,
    )

    enqueueSnackbar('Parcel post success', {variant: 'success'})
    setLoading(false)
    setActiveStep(0)
  }

  return (
    <>
      <Box sx={{textAlign: 'center', mt: 5, mb: 3}}>
        <Typography variant="h4">Parcel</Typography>
      </Box>
      {activeStep === 0 ? <ParcelForm onNext={handleNext} onStoreData={handleFormData} /> : ''}
      {activeStep === 1 ? <BillingForm onNext={handleNext} storeData={form} /> : ''}
      <Box sx={{marginBottom: '120px', display: 'block', mt: 1}}>
        {activeStep === 1 ? (
          <LoadingButton
            variant="contained"
            size="large"
            sx={{width: '100%'}}
            onClick={handleConfirm}
            loading={isLoading}
          >
            Post A Parcel
          </LoadingButton>
        ) : (
          ''
        )}
        {activeStep !== 0 ? (
          <Button
            size="large"
            variant="outlined"
            sx={{width: '100%', textAlign: 'center', mt: 3, mb: 5}}
            onClick={handleBack}
          >
            Go Back
          </Button>
        ) : (
          ''
        )}
      </Box>
      <CreateParcelDialog open={open} onConfirm={handleSubmit} handleClose={handleCancelConfirm} />
    </>
  )
}
