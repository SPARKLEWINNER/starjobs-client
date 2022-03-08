import * as Yup from 'yup'
import {useState, useContext} from 'react'
import {useNavigate, Link as RouterLink} from 'react-router-dom'
import {useFormik, Form, FormikProvider} from 'formik'
import {useSnackbar} from 'notistack5'

import {Icon} from '@iconify/react'
import eyeFill from '@iconify/icons-eva/eye-fill'
import eyeOffFill from '@iconify/icons-eva/eye-off-fill'
// material
import {Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel, Link} from '@material-ui/core'
import {LoadingButton} from '@material-ui/lab'

import storage from 'utils/storage'
import auth_api from 'utils/api/auth'

import {UsersContext} from 'utils/context/users'

import {LoadingButtonStyle, InputOutlineStyle, CheckboxWhiteStyle} from 'theme/style'
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const {setUser} = useContext(UsersContext)
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      setLoading(true)
      if (!values.email || !values.password) return setLoading(false)

      const result = await auth_api.post_sign_in(values)
      if (!result.ok) {
        enqueueSnackbar('Invalid username or password', {variant: 'error'})
        return setLoading(false)
      }
      let {data} = result
      resetForm()
      await storage.storeUser(data)
      await storage.storeToken(data.token)
      await storage.storeRefreshToken(data.refreshToken)

      setLoading(false)
      setUser(data)
      if (!data.isVerified) return navigate(`/verification`, {replace: true})
      if (data.accountType === 0) {
        if (data.isActive) {
          return navigate(`/freelancer/message`, {replace: true})
        } else {
          return navigate(`/freelancer/app`, {replace: true})
        }
      } else {
        if (data.isActive) {
          return navigate(`/client/gig/create`, {replace: true})
        } else {
          return navigate(`/client/app`, {replace: true})
        }
      }
    },
  })

  const {errors, touched, values, resetForm, handleSubmit, getFieldProps} = formik

  const handleShowPassword = () => {
    setShowPassword((show) => !show)
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            // autoFocus
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            sx={InputOutlineStyle}
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
                  <IconButton onClick={handleShowPassword} sx={{color: 'common.white'}} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            sx={CheckboxWhiteStyle}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" sx={{textDecoration: 'none'}} color="common.white" to="#">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{...LoadingButtonStyle, my: 5}}
          loading={isLoading}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
