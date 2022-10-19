import * as Yup from 'yup'
import {styled} from '@mui/material/styles'

import {Link as RouterLink} from '@reach/router'
import React, {useState} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'

// material
import {Stack, TextField, Typography, Container, Box, Link} from '@mui/material'
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
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  })

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      setLoading(true)
      await auth_api.post_forgot_password(values)
      enqueueSnackbar('We have sent a change password link to your email address', {variant: 'success'})
      resetForm()
      return setLoading(false)
    }
  })

  const {errors, touched, values, resetForm, handleSubmit, getFieldProps} = formik

  return (
    <RootStyle title="Forgot Password - Starjobs">
      <Container maxWidth="sm">
        <ContentStyle>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', mt: 0, mb: 5}}>
            <Typography
              color="starjobs.main"
              style={{textTransform: 'initial', fontWeight: 'bold', mb: 3, width: '75%', lineHeight: 'initial'}}
              variant="h3"
            >
              Forgot Password
            </Typography>
          </Box>

          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{my: 3}}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email address"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  sx={InputOutlineStyle}
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

          <div style={{margin: '2rem auto', width: '100%', textAlign: 'center'}}>
            <Link to={`/login`} component={RouterLink} sx={{textDecoration: 'none'}}>
              <Typography
                color="starjobs.fieldLabel"
                style={{textTransform: 'initial', fontSize: '0.8rem', fontWeight: 400}}
                variant="body1"
                component="p"
              >
                I already have an account{' '}
                <Typography
                  component="span"
                  color="starjobs.main"
                  style={{
                    marginLeft: '.25rem',
                    fontSize: '0.8rem',
                    width: '100%',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  <div id="back">Go back</div>
                </Typography>
              </Typography>
            </Link>
          </div>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
