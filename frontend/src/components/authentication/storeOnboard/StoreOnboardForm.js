import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useFormik, Form, FormikProvider } from 'formik'
import eyeFill from '@iconify/icons-eva/eye-fill'
import eyeOffFill from '@iconify/icons-eva/eye-off-fill'
import { useNavigate } from 'react-router-dom'
// material
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import { useSnackbar } from 'notistack5'


import useUser from 'utils/api/users'
import storage from 'utils/storage'
// ----------------------------------------------------------------------

export default function StoreOnboardForm() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [_u, set_u] = useState({})
  const [token, setToken] = useState('')

  const OnboardSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    company: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Company/ Store name required'),
    phone: Yup.string().min(11, 'Not a valid phone number! (ex. 091523468790)').max(11, 'Not a valid phone number! (ex. 091523468790)').required('Phone number is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const local_user = await storage.getUser()

      if (!local_user) {
        setLoading(false)
        enqueueSnackbar('Kindly re-login. Session expired', { variant: 'error' })
        return navigate('/login')
      }

      const user = JSON.parse(local_user)
      set_u(user)
      setToken(user.token)

      if (!user.isOnBoarded) {
        setLoading(false)
        return navigate('/store/onboard')
      }

      setLoading(false)
      return navigate('/stores/app')
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: _u.email ? _u.email : '',
      company: '',
      phone: '',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: OnboardSchema,
    onSubmit: async (values) => {
      setLoading(true)

      if (!values && (!values?.company || !values?.phone || !values?.password)) return setLoading(false)

      const result = await useUser.patch_store_onboard(values, _u._id)
      if (!result.ok) {
        enqueueSnackbar('Unable to process your request.', { variant: 'error' })
        return setLoading(false)
      }
      result.data.token = token

      await storage.storeUser(result.data);
      await storage.storeToken(result.data.token)
      enqueueSnackbar('On-boarding success', { variant: 'success' })
      setLoading(false)
      navigate('/stores/app', { replace: true })
    },
  })

  const { errors, touched, handleSubmit, getFieldProps } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            label="Company/Store name"
            {...getFieldProps('company')}
            error={Boolean(touched.company && errors.company)}
            helperText={touched.company && errors.company}
          />

          <TextField
            fullWidth
            label="Phone number"
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            disabled
            InputLabelProps={{ shrink: true }}
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
            Submit
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
