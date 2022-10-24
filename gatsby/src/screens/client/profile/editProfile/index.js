import React, {useState, useEffect} from 'react'
import {useNavigate} from '@reach/router'

// material
import {Stack, Box, Paper, Button, Avatar, Typography} from '@mui/material'
import {styled} from '@mui/material/styles'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'

// components
import Page from 'components/Page'
import PersonalForm from './form/personalForm'
import ContactForm from './form/contactForm'
import IndustryForm from './form/industryForm'
import RateForm from './form/rateForm'
import ProfileForm from './form/profileForm'

// hooks
import storage from 'utils/storage'
import onboard_api from 'libs/endpoints/onboard'
import user_api from 'libs/endpoints/users'
import {useAuth} from 'contexts/AuthContext'

// variables
const DRAWER_WIDTH = 280
const image_bucket = process.env.REACT_APP_IMAGE_URL
const steps = ['Personal Information', 'Company Contacts', 'Industry', 'Rate & Payment', 'Company Logo & Permits']

// styles
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

const EditProfile = () => {
  const {currentUser} = useAuth()
  const {enqueueSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [user, setUsers] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [form, setForm] = useState({
    personal: [],
    contact: [],
    industry: [],
    rate: [],
    photo: '',
    documents: ''
  })

  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      const user = await user_api.get_user_edit_profile_client(currentUser._id)
      if (!user.ok) {
        return setLoading(false)
      }

      let details = user.data
      const isEdit = localStorage.getItem('isEdit')
      if (isEdit && JSON.parse(isEdit)) {
        Object.keys(form).forEach((val) => {
          if (sessionStorage.getItem(val)) {
            let set_data = []
            set_data[val] = JSON.parse(sessionStorage.getItem(val))
            setForm((prev_state) => ({...prev_state, ...set_data}))
          }
        })
      } else {
        let form_data = {
          contact: details[0].contact[0],
          industry: details[0].industry,
          personal: {
            firstName: details[0].firstName,
            lastName: details[0].lastName,
            middleInitial: details[0].middleInitial,
            email: details[0].email,
            brandName: details[0].brandName,
            companyName: details[0].companyName,
            companyPosition: details[0].companyPosition,
            location: details[0].location,
            website: details[0].website
          },
          rate: {
            accountType: details[0].payment.accountPaymentType,
            accountName: details[0].payment.acccountPaymentName,
            accountNumber: details[0].payment.acccountPaymentNumber
          },
          photo: `${details[0].photo}`
        }

        sessionStorage.setItem(
          'personal',
          JSON.stringify({
            firstName: details[0].firstName,
            lastName: details[0].lastName,
            middleInitial: details[0].middleInitial,
            email: details[0].email,
            brandName: details[0].brandName,
            companyName: details[0].companyName,
            companyPosition: details[0].companyPosition,
            location: details[0].location,
            website: details[0].website
          })
        )

        sessionStorage.setItem('contact', JSON.stringify(details[0].contact))
        sessionStorage.setItem('industry', JSON.stringify(details[0].industry))

        if (details[0].rate) {
          sessionStorage.setItem(
            'rate',
            JSON.stringify({
              rateAmount: details[0].rate.rateAmount,
              rateType: details[0].rate.rateType,
              accountType: details[0].payment.acccountPaymentName,
              accountName: details[0].payment.acccountPaymentNumber,
              accountNumber: details[0].payment.accountPaymentType
            })
          )
        }

        sessionStorage.setItem('photo', details[0].photo)
        setForm(form_data)
      }

      if (componentMounted) {
        setUsers(details[0])
        setLoading(false)
      }
    }

    load()
    return () => {
      componentMounted = false
    }
    // eslint-disable-next-line
  }, [currentUser])

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
    localStorage.setItem('isEdit', true)
    let set_data = []
    if (!form_data) return
    set_data[form_type] = form_data
    sessionStorage.setItem(form_type, JSON.stringify(form_data))
    setForm((prev_state) => ({...prev_state, ...set_data}))
  }

  const handleSubmit = async () => {
    setLoading(true)
    sessionStorage.setItem('details', JSON.stringify(form))

    const form_data = {
      ...form.personal,
      contact: form.contact,
      industry: form.industry,
      rate: form.rate,
      payment: {
        accountPaymentType: form.rate.accountType,
        acccountPaymentName: form.rate.accountName,
        acccountPaymentNumber: form.rate.accountNumber
      },
      photo: form.photo
    }

    const result = await onboard_api.patch_client_profile(form_data, user._id)
    if (!result.ok) {
      enqueueSnackbar('Unable to process your edit profile', {variant: 'error'})
      return setLoading(false)
    }

    localStorage.removeItem('isEdit')
    Object.keys(form).forEach((val) => {
      localStorage.removeItem(val)
    })

    let {data} = result
    await storage.storeUser(data)
    await storage.storeToken(data.token)
    await storage.storeRefreshToken(data.refreshToken)
    setUsers(data)
    enqueueSnackbar('Edit profile success', {variant: 'success'})
    setLoading(false)
    navigate('/client/profile?edit=true', {replace: true})
  }

  return (
    <Page title="Edit Profile - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        <>
          {activeStep === steps.length ? (
            <>
              <Paper sx={{p: 3, my: 3}}>
                <Box sx={{textAlign: 'center'}}>
                  <Avatar
                    key={'Profile Picture'}
                    alt="Picture"
                    src={`${image_bucket}${form.photo}`}
                    sx={{margin: '0 auto', width: 128, height: 128}}
                  />
                  <Typography variant="h3">
                    {form.personal.firstName} {form.personal.middleInitial} {form.personal.lastName}
                  </Typography>
                </Box>
              </Paper>

              <Box sx={{marginBottom: '120px', display: 'block', mt: 1}}>
                <LoadingButton
                  loading={isLoading}
                  size="large"
                  variant="contained"
                  sx={{width: '100%', textAlign: 'center', mt: 3, mb: 3}}
                  onClick={handleSubmit}
                >
                  Save
                </LoadingButton>
                <Button
                  size="large"
                  variant="outlined"
                  sx={{width: '100%', textAlign: 'center', mb: 5}}
                  onClick={handleBack}
                >
                  Go Back
                </Button>
              </Box>
            </>
          ) : (
            <>
              {activeStep === 0 && (
                <PersonalForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
              )}
              {activeStep === 1 && (
                <ContactForm user={form} stored={form} onNext={handleNext} onStoreData={handleFormData} />
              )}
              {activeStep === 2 && (
                <IndustryForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
              )}
              {activeStep === 3 && (
                <RateForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
              )}
              {activeStep === 4 && (
                <ProfileForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
              )}

              <Box sx={{marginBottom: '120px', display: 'block', mt: 1}}>
                {activeStep === 6 && (
                  <Button variant="contained" size="large" sx={{width: '100%'}} onClick={handleSubmit}>
                    Submit
                  </Button>
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
            </>
          )}
        </>
      </MainStyle>
    </Page>
  )
}

export default EditProfile