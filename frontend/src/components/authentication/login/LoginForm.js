import * as Yup from 'yup'
import {useState} from 'react'
import {useNavigate, Link as RouterLink} from 'react-router-dom'
import {useFormik, Form, FormikProvider} from 'formik'
import {useSnackbar} from 'notistack'

import {Icon} from '@iconify/react'
import eyeFill from '@iconify/icons-eva/eye-fill'
import eyeOffFill from '@iconify/icons-eva/eye-off-fill'
// material
import {Stack, TextField, IconButton, InputAdornment, Link} from '@mui/material'
import {LoadingButton} from '@mui/lab'

import {useAuth} from 'src/contexts/AuthContext'

import {LoadingButtonStyle, InputOutlineStyle} from 'src/theme/style'

export default function LoginForm() {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const {signIn} = useAuth()
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      setLoading(true)
      const result = await signIn(values)
      if (!result.status) {
        enqueueSnackbar(result.msg, {variant: 'warning'})
        return setLoading(false)
      }

      resetForm()
      navigate('/dashboard')
      setLoading(false)
    }
  })

  const {errors, touched, values, resetForm, handleSubmit, getFieldProps} = formik

  const handleShowPassword = () => {
    setShowPassword((show) => !show)
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{my: 3}}>
          <TextField
            id="useremail"
            fullWidth
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            sx={InputOutlineStyle}
          />

          <TextField
            id="userpassword"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            sx={InputOutlineStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} sx={{color: 'starjobs.main'}} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} sx={{color: 'starjobs.main'}} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Link
          component={RouterLink}
          variant="subtitle2"
          sx={{textDecoration: 'none', float: 'right', fontSize: '0.75rem'}}
          color="starjobs.main"
          to="/forgot-password"
        >
          Forgot password?
        </Link>

        <LoadingButton
          id="loginBtn"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{...LoadingButtonStyle, mt: 5, mb: 2}}
          loading={isLoading}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
