import {useState, useEffect} from 'react'
// material
import {Box, Divider, Paper, Button, Avatar, Stack, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'

// component form
import PersonalForm from 'src/components/freelancerOnboard/form/personalForm'
import EmploymentForm from 'src/components/freelancerOnboard/form/employmentForm'
import ExpertiseForm from 'src/components/freelancerOnboard/form/expertiseForm'
import EducationForm from 'src/components/freelancerOnboard/form/educationForm'
import RateForm from 'src/components/freelancerOnboard/form/rateForm'
import ProfileForm from 'src/components/freelancerOnboard/form/profileForm'

// hooks
import storage from 'src/utils/storage'
import onboard_api from 'src/lib/onboard'
import {useNavigate} from 'react-router-dom'

const image_bucket = process.env.REACT_APP_IMAGE_URL
const steps = [
  'Personal Information',
  'Work Experience',
  'Expertise',
  'Education Background',
  'Rate & Payment',
  'Profile Picture'
]

export default function LinearAlternativeLabel() {
  const {enqueueSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [user, setUser] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [form, setForm] = useState({
    personal: [],
    work: [],
    expertise: [],
    education: [],
    rate: [],
    photo: ''
  })

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

      Object.keys(form).forEach((val) => {
        if (localStorage.getItem(val)) {
          let set_data = []
          set_data[val] = JSON.parse(localStorage.getItem(val))
          setForm((prev_state) => ({...prev_state, ...set_data}))
        }
      })

      setUser(user)
      setLoading(false)
    }

    load()
    // eslint-disable-next-line
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
    let set_data = []
    if (!form_data) return
    set_data[form_type] = form_data
    localStorage.setItem(form_type, JSON.stringify(form_data))
    setForm((prev_state) => ({...prev_state, ...set_data}))
  }

  const handleSubmit = async () => {
    setLoading(true)
    localStorage.setItem('details', JSON.stringify(form))

    const form_data = {
      ...form.personal,
      work: form.work,
      expertise: form.expertise,
      education: form.education,
      rate: form.rate,
      payment: {
        accountPaymentType: form.rate.accountType,
        acccountPaymentName: form.rate.accountName,
        acccountPaymentNumber: form.rate.accountNumber
      },
      photo: form.photo
    }

    const result = await onboard_api.post_freelancer_onboard(form_data, user._id)

    if (!result.ok) {
      enqueueSnackbar('Unable to process your onboarding', {variant: 'error'})
      return setLoading(false)
    }
    await storage.storeUser(result.data)
    Object.keys(form).forEach((val) => {
      localStorage.removeItem(val)
    })

    enqueueSnackbar('Onboarding process success', {variant: 'success'})
    setLoading(false)
    navigate('/freelancer/onboard/success', {replace: true})
  }

  return (
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
            <Divider sx={{my: 3}} />
            <Box>
              <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                Present Address
              </Typography>
              <Box>
                <Typography variant="body2" sx={{mb: 3}}>
                  {form.personal.presentBlkNo} {form.personal.presentStreetName} {form.personal.presentCity}{' '}
                  {form.personal.presentZipCode}{' '}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                Permanent Address
              </Typography>
              <Box>
                <Typography variant="body2" sx={{mb: 3}}>
                  {form.personal.permanentBlkNo} {form.personal.permanentStreetName} {form.personal.permanentCity}{' '}
                  {form.personal.permanentZipCode}{' '}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{my: 2}} />
            <Box>
              <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                Expertise
              </Typography>
              <Box>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2">Skills Qualification:</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.expertise.skillQualification}
                  </Typography>
                </Stack>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2">Skills Qualification Others:</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.expertise.skillQualificationOthers}
                  </Typography>
                </Stack>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2">Skills offer:</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.expertise.skillOfferOthers}
                  </Typography>
                </Stack>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2">Other Skills Expertise:</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.expertise.othersExpertise}
                  </Typography>
                </Stack>

                <Typography variant="body2" sx={{mt: 1}}>
                  Sales & Marketing skill/s
                </Typography>
                <Stack direction={{xs: 'column', sm: 'column'}} spacing={2} sx={{marginTop: '0 !important'}}>
                  {form.expertise.workType.split('=>').length > 0 ? (
                    form.expertise.workType.split('=>').map((v, k) => {
                      return (
                        <Typography
                          Typography
                          variant="body2"
                          sx={{mb: 0, marginTop: '0 !important', fontWeight: 'bold'}}
                        >
                          - {v}
                        </Typography>
                      )
                    })
                  ) : (
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.expertise.skillOfferOthers}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Box>
            <Divider sx={{my: 2}} />
            <Box>
              <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                Work Experience
              </Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body2" sx={{mb: 1}}>
                  Current Employment
                </Typography>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2">Company Name:</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.work.currentCompany}
                  </Typography>
                </Stack>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2">Position:</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.work.currentPosition}
                  </Typography>
                </Stack>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2">Start Date:</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.work.currentStartDate}
                  </Typography>
                </Stack>

                {form.work.isCurrentWork ? (
                  <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                    <Typography variant="body2">End Date:</Typography>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.work.currentEndDate}
                    </Typography>
                  </Stack>
                ) : (
                  ''
                )}

                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2">Place of Work:</Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.work.currentPlaceOfWork}
                  </Typography>
                </Stack>
              </Box>
              {!form.work.isFreshGraduate ? (
                <Box sx={{mt: 2}}>
                  <Typography variant="body2" sx={{mb: 1}}>
                    Past Employment
                  </Typography>
                  <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                    <Typography variant="body2">Company Name:</Typography>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.work.pastCompany}
                    </Typography>
                  </Stack>

                  <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                    <Typography variant="body2">Position:</Typography>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.work.pastPosition}
                    </Typography>
                  </Stack>

                  <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                    <Typography variant="body2">Start Date:</Typography>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.work.pastStartDate}
                    </Typography>
                  </Stack>

                  <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                    <Typography variant="body2">End Date:</Typography>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.work.pastEndDate}
                    </Typography>
                  </Stack>

                  <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                    <Typography variant="body2">Place of Work:</Typography>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.work.pastPlaceOfWork}
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                ''
              )}
            </Box>
            <Divider sx={{my: 2}} />
            <Box>
              <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                Education Background
              </Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body2">High School</Typography>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.education.highSchoolName}
                  </Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.education.highSchoolName}
                  </Typography>
                </Stack>
              </Box>
              <Box sx={{mt: 2}}>
                <Typography variant="body2">College</Typography>
                <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.education.collegeName}
                  </Typography>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {form.education.collegeYear}
                  </Typography>
                </Stack>
              </Box>
              {form.education.vocationalProgram || form.education.vocationalProgram !== 'N/A' ? (
                <Box sx={{mt: 2}}>
                  <Typography variant="body2">Vocational Program</Typography>
                  <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.education.highSchoolName}
                    </Typography>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                      {form.education.highSchoolName}
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                ''
              )}
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
          {activeStep === 0 ? (
            <PersonalForm
              user={form.personal.length > 0 ? form.personal : user}
              stored={form}
              onNext={handleNext}
              onStoreData={handleFormData}
            />
          ) : (
            ''
          )}
          {activeStep === 1 ? (
            <EmploymentForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
          ) : (
            ''
          )}
          {activeStep === 2 ? (
            <ExpertiseForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
          ) : (
            ''
          )}
          {activeStep === 3 ? (
            <EducationForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
          ) : (
            ''
          )}
          {activeStep === 4 ? (
            <RateForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
          ) : (
            ''
          )}
          {activeStep === 5 ? (
            <ProfileForm user={user} stored={form} onNext={handleNext} onStoreData={handleFormData} />
          ) : (
            ''
          )}

          <Box sx={{marginBottom: '120px', display: 'block', mt: 1}}>
            {activeStep === 6 ? (
              <Button variant="contained" size="large" sx={{width: '100%'}} onClick={handleSubmit}>
                Submit
              </Button>
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
        </>
      )}
    </>
  )
}
