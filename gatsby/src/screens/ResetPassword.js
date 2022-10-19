import * as Yup from 'yup'
import {styled} from '@mui/material/styles'
import React, {useState, useEffect} from 'react'
import {last} from 'lodash'
import jwt_decode from 'jwt-decode'

import {Icon} from '@iconify/react'
import eyeFill from '@iconify/icons-eva/eye-fill'
import eyeOffFill from '@iconify/icons-eva/eye-off-fill'

import {useFormik, Form, FormikProvider} from 'formik'
import {useLocation, useNavigate} from '@reach/router'
// material
import {Stack, TextField, Typography, Container, Box, InputAdornment, IconButton} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'

import auth_api from 'libs/endpoints/auth'
import Page from 'components/Page'
import {LoadingButtonStyle, InputOutlineStyle} from 'theme/style'

const RootStyle = styled(Page)(({theme}) => ({
  backgroundColor: theme.palette.common.white,
  height: '100vh',
  display: 'flex',
  alignItems: 'center'
}))

const ContentStyle = styled('div')(({theme}) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3, 0)
}))

export default function ForgotPassword() {
  const params = useLocation()
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [isExpired, setExpired] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const Schema = Yup.object().shape({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
  })

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: Schema,
    onSubmit: async () => {
      setLoading(true)

      if (!resetToken) return enqueueSnackbar('Something went wrong....', {variant: 'error'})
      const form_data = {
        password: values.password,
        token: resetToken
      }

      await auth_api.post_reset_password(form_data)
      enqueueSnackbar('New password saved!', {variant: 'success'})
      resetForm()
      setLoading(false)
      return navigate('/login')
    }
  })

  const {errors, touched, values, resetForm, handleSubmit, getFieldProps} = formik

  useEffect(() => {
    const load = () => {
      const split_token = params.search.split('?token=')

      if (!split_token) return setExpired(true)

      const token = last(split_token)
      const decode = jwt_decode(token)
      if (decode.exp * 1000 < new Date().getTime()) return setExpired(true)
      setEmail(decode.email)
      setResetToken(token)
    }

    load()
    // eslint-disable-next-line
  }, [])

  return (
    <RootStyle title="Set new password - Starjobs">
      <Container maxWidth="sm">
        <ContentStyle>
          <>
            {isExpired && (
              <Box sx={{display: 'flex', justifyContent: 'flex-start', mt: 0, mb: 5}}>
                <Typography
                  color="starjobs.main"
                  style={{textTransform: 'initial', fontWeight: 'bold', mb: 3, width: '75%', lineHeight: 'initial'}}
                  variant="h3"
                >
                  Password request expired.
                </Typography>
              </Box>
            )}
            {!isExpired && (
              <>
                <Box sx={{display: 'flex', justifyContent: 'flex-start', mt: 0, mb: 3}}>
                  <Typography
                    color="starjobs.main"
                    style={{textTransform: 'initial', fontWeight: 'bold', mb: 3, width: '75%', lineHeight: 'initial'}}
                    variant="h3"
                  >
                    Set new password
                  </Typography>
                </Box>
                <Typography
                  color="common.black"
                  style={{
                    textTransform: 'initial',
                    fontWeight: 400,
                    mb: 5,
                    width: '75%',
                    lineHeight: 'initial'
                  }}
                  variant="body1"
                >
                  Your email address {email}
                </Typography>

                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{my: 3}}>
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
                                sx={{color: 'starjobs.main'}}
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                              </IconButton>
                            </InputAdornment>
                          )
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
                    </Stack>

                    <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{...LoadingButtonStyle, mt: 5, mb: 2}}
                      loading={isLoading}
                    >
                      Submit
                    </LoadingButton>
                  </Form>
                </FormikProvider>
              </>
            )}{' '}
          </>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
