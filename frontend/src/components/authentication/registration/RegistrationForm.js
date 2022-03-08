import Bugsnag from '@bugsnag/js'
import * as Yup from 'yup'
import {useState} from 'react'
import {Icon} from '@iconify/react'
import {useFormik, Form, FormikProvider} from 'formik'
import eyeFill from '@iconify/icons-eva/eye-fill'
import eyeOffFill from '@iconify/icons-eva/eye-off-fill'
import {useNavigate} from 'react-router-dom'
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Checkbox,
  Button,
} from '@material-ui/core'
import {DialogAnimate} from '../../animate'
import {LoadingButton} from '@material-ui/lab'
import {useSnackbar} from 'notistack5'

import auth_api from 'utils/api/auth'

import {LoadingButtonStyle, InputOutlineStyle, CheckboxWhiteStyle} from 'theme/style'

// ----------------------------------------------------------------------

const freelancer_docs = [
  'https://bit.ly/3DIlnNl', // data privacy
  'https://bit.ly/31IAxVK', // service agreements
]

const client_docs = [
  'https://bit.ly/3IBUi1R', // data privacy
  'https://bit.ly/3IzqRxt', // service agreements
]

export default function StoreOnboardForm() {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [terms, setTerms] = useState(false)

  const [dataPrivacyOpen, setOpenDataPrivacy] = useState(false)
  const [conditionsOpen, setConditionOpen] = useState(false)

  const [termsConditionOpen, setTermsConditionOpen] = useState(false)
  const [termsLink, setTermsLink] = useState(freelancer_docs[1]) //freelancer default service agreement
  const [dataPrivacyLink, setDataPrivacyLink] = useState(freelancer_docs[0]) // freelancer default data privacy

  const RegistrationSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    phone: Yup.string()
      .min(11, 'Not a valid phone number! (ex. 091523468790)')
      .max(11, 'Not a valid phone number! (ex. 091523468790)')
      .required('Phone number is required'),
    accountType: Yup.number(),
    marketing: Yup.boolean(),
  })

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    },
    enableReinitialize: true,
    validationSchema: RegistrationSchema,
    onSubmit: async (values) => {
      setLoading(true)

      if (!terms) {
        enqueueSnackbar('Please agree with our terms and conditions, privacy policy agreement. Thank you.', {
          variant: 'warning',
        })
        return setLoading(false)
      }

      if (!values.accountType) {
        enqueueSnackbar('Please select your registration account type', {variant: 'warning'})
        return setLoading(false)
      }

      if (
        !values?.email ||
        !values?.firstName ||
        !values?.lastName ||
        !values?.accountType ||
        !values?.password ||
        !values?.phone
      )
        return setLoading(false)

      let format_phone
      const numberFormat =
        String(values.phone).charAt(0) + String(values.phone).charAt(1) + String(values.phone).charAt(2)
      if (numberFormat !== '+63') {
        format_phone = '+63' + values.phone.substring(1)
      }

      let data = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        accountType: JSON.parse(values.accountType),
        phone: format_phone,
      }

      const result = await auth_api.post_sign_up(data)
      if (!result.ok) {
        Bugsnag.notify(result)
        enqueueSnackbar(`${result.data.msg}`, {variant: 'error'})
        return setLoading(false)
      }

      enqueueSnackbar('Registration success. We have sent a Verification code under your registered Email address', {
        variant: 'success',
      })
      setLoading(false)
      navigate('/login', {replace: true})
    },
  })

  const {errors, touched, handleSubmit, setFieldValue, getFieldProps} = formik

  const handleTerms = (event) => {
    setTerms(event.target.checked)
  }

  const handleAccountType = (event) => {
    setFieldValue('accountType', event.target.value)
    if (JSON.parse(event.target.value) === 1) {
      setDataPrivacyLink(client_docs[0]) // data privacy
      return setTermsLink(client_docs[1])
    }
    setDataPrivacyLink(freelancer_docs[0]) // data privacy
    return setTermsLink(freelancer_docs[1]) // service agreement
  }

  const handleDataPrivacy = () => {
    setOpenDataPrivacy(true)
  }

  const handleConditions = () => {
    setConditionOpen(true)
  }

  const handleTermsConditions = () => {
    setTermsConditionOpen(true)
  }

  const handleClose = () => {
    setOpenDataPrivacy(false)
    setConditionOpen(false)
    setTermsConditionOpen(false)
  }

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
              <TextField
                autoFocus
                fullWidth
                autoComplete="name"
                label="First name"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={InputOutlineStyle}
              />

              <TextField
                fullWidth
                autoComplete="name"
                label="Last name"
                {...getFieldProps('lastName')}
                sx={InputOutlineStyle}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Stack>

            <TextField
              fullWidth
              type="tel"
              inputProps={{maxLength: 11, minLength: 11}}
              label="Phone number"
              {...getFieldProps('phone')}
              sx={InputOutlineStyle}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
            />

            <TextField
              fullWidth
              autoComplete="email"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              sx={InputOutlineStyle}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              sx={InputOutlineStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      sx={{color: 'common.white'}}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Confirm password"
              sx={InputOutlineStyle}
              {...getFieldProps('confirmPassword')}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />

            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{
                  textAlign: 'center',
                  mb: 2,
                  mt: 3,
                  color: '#FFFFFF !important',
                  fontWeight: 600,
                }}
              >
                Allow us to know you
              </FormLabel>
              <RadioGroup
                onChange={handleAccountType}
                row
                sx={{display: 'flex', justifyContent: 'center', width: '100%'}}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio className="radio-btn" />}
                  label="I am a Jobster"
                  sx={{
                    border: '0.15rem solid #FFFFFF',
                    borderRadius: '1.2rem !important',
                    width: {xs: '100%', sm: '45%', md: '45%'},
                    my: {xs: 2, sm: 0, md: 0},
                    mx: {xs: 0, sm: 1, md: 1},
                    justifyContent: 'center',
                    padding: '0.5rem 0.75rem',
                    transition: 'all 0.4s ease',
                    color: '#FFFFFF !important',
                  }}
                  className="radio-control-group"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio className="radio-btn" />}
                  label="I am a Client"
                  sx={{
                    border: '0.15rem solid #FFFFFF',
                    borderRadius: '1.2rem',
                    width: {xs: '100%', sm: '45%', md: '45%'},
                    m: {xs: 0, sm: 1, md: 1},
                    justifyContent: 'center',
                    padding: '0.5rem 0.75rem',
                    transition: 'all 0.4s ease',
                    color: '#FFFFFF !important',
                  }}
                  className="radio-control-group"
                />
              </RadioGroup>
            </FormControl>

            <FormControlLabel
              control={<Checkbox color="primary" />}
              sx={CheckboxWhiteStyle}
              label={
                <>
                  <Typography variant="body2" align="left" color="common.white" sx={{mt: 2}}>
                    Yes, send me useful email every now and then to help me get the latest job openings from Starjobs
                  </Typography>
                </>
              }
            />

            <FormControlLabel
              control={<Checkbox color="primary" onChange={handleTerms} defaultValue={false} />}
              sx={CheckboxWhiteStyle}
              label={
                <>
                  <Typography variant="body2" color="common.white" align="left" sx={{mt: 2}}>
                    Yes, I understand and agree to the&nbsp;
                    <Typography
                      variant="text"
                      sx={{p: 0, fontWeight: 600}}
                      onClick={handleTermsConditions}
                      underline="none"
                      color="common.black"
                    >
                      Terms & Conditions of Starjobs
                    </Typography>
                    , &nbsp; including the &nbsp;
                    <Typography
                      variant="text"
                      sx={{p: 0, wordBreak: 'break-all', fontWeight: 600}}
                      onClick={handleConditions}
                      underline="none"
                      color="common.black"
                    >
                      Cooperation Agreement, Forward Together
                    </Typography>
                    &nbsp; and &nbsp;
                    <Typography
                      variant="text"
                      sx={{p: 0, fontWeight: 600}}
                      underline="none"
                      color="common.black"
                      onClick={handleDataPrivacy}
                    >
                      Data Privacy Policy
                    </Typography>
                    .
                  </Typography>
                </>
              }
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={LoadingButtonStyle}
              loading={isLoading}
            >
              Create account
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>

      <DialogAnimate fullScreen open={dataPrivacyOpen} onClose={handleClose}>
        <iframe
          src={dataPrivacyLink}
          width="100%"
          style={{height: '90vh', overflowX: 'scroll'}}
          frameborder="0"
          title="data-privacy-policy"
        ></iframe>
        <Button onClick={handleClose} variant="contained" size="large">
          Close
        </Button>
      </DialogAnimate>

      <DialogAnimate fullScreen open={conditionsOpen} onClose={handleClose}>
        <iframe
          src="https://drive.google.com/file/d/1iVmoWZi1OI2S8yh07cx4LAtmHmkBgHzP/preview"
          width="100%"
          style={{height: '90vh'}}
          frameborder="0"
          title="terms-conditions"
        ></iframe>
        <Button onClick={handleClose} variant="contained" size="large">
          Close
        </Button>
      </DialogAnimate>

      <DialogAnimate fullScreen open={termsConditionOpen} onClose={handleClose}>
        <iframe
          src={termsLink}
          width="100%"
          style={{height: '90vh'}}
          frameborder="0"
          title="service-agreement"
        ></iframe>
        <Button onClick={handleClose} variant="contained" size="large">
          Close
        </Button>
      </DialogAnimate>
    </>
  )
}
