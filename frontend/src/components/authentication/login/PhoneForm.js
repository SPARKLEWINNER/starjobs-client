import * as Yup from 'yup'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
// material
import { Link, Stack, Checkbox, TextField, FormControlLabel } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'

import storage from 'utils/storage'
import useAuth from 'utils/api/auth'
// ----------------------------------------------------------------------

export default function LoginForm({ currentStep }) {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().min(11, 'Not a valid phone number! (ex. 091523468790)').max(11, 'Not a valid phone number! (ex. 091523468790)').required('Phone number is required'),
  })

  const formik = useFormik({
    initialValues: {
      phone: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true)
      if (!values.phone) return setLoading(false)

      const result = await useAuth.sign_in_phone(values.phone)

      if (!result.ok) {
        alert(result.data.msg)
        return setLoading(false)
      }

      let { data } = result
      data.sid = data.store_id
      await storage.storeUser(data)
      await storage.storeToken(data.token)
      setLoading(false)
      if (data.verificationCode === null) {
        if (data.isVerified && data.isOnBoarded) {
          if (data.role === 1 || data.role === 4) return navigate('/stores/app')
          navigate(`/dashboard/app`)
        } else if (data.isVerified && !data.isOnBoarded) {
          navigate(`/${data.store_id}/onboard`)
        } else if (!data.isVerified && !data.isOnBoarded) {
          navigate(`/${data.store_id}/onboard`)
        }
      } else {
        currentStep(2)
      }
    },
  })

  const { errors, touched, values, handleSubmit, getFieldProps } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            type="tel"
            inputProps={{ maxLength: 11, minLength: 11 }}
            label="Phone number"
            autoFocus
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
