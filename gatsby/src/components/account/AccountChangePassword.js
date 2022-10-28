import {useState} from 'react'
import * as Yup from 'yup'
import {useSnackbar} from 'notistack'
import {useFormik, Form, FormikProvider} from 'formik'
import {Stack, Card, TextField, Grid, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'

import user_api from 'libs/endpoints/users'
import {useAuth} from 'contexts/AuthContext'

import color from 'theme/palette'

export default function AccountChangePassword() {
  const {enqueueSnackbar} = useSnackbar()
  const {currentUser} = useAuth()
  const [isLoading, setLoading] = useState(false)

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  })

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values) => {
      setLoading(true)
      const result = await user_api.patch_user_password(currentUser._id, values)
      if (!result.ok) {
        setLoading(false)
        return enqueueSnackbar(result.data.msg, {variant: 'error'})
      }
      resetForm()
      setLoading(false)
      return enqueueSnackbar('Change password success', {variant: 'success'})
    }
  })

  const {errors, touched, resetForm, handleSubmit, getFieldProps} = formik

  return (
    <Grid item xs={12} md={4}>
      <Card sx={{p: 1, backgroundColor: 'transparent !important', boxShadow: 'none !important'}}>
        <Stack spacing={3} sx={{mb: 5}}>
          <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
            Change Password
          </Typography>
        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} alignItems="flex-end">
              <TextField
                id="oldPassword"
                {...getFieldProps('oldPassword')}
                fullWidth
                autoComplete="on"
                type="password"
                label="Old Password"
                error={Boolean(touched.oldPassword && errors.oldPassword)}
                helperText={touched.oldPassword && errors.oldPassword}
              />

              <TextField
                id="newPassword"
                {...getFieldProps('newPassword')}
                fullWidth
                autoComplete="on"
                type="password"
                label="New Password"
                error={Boolean(touched.newPassword && errors.newPassword)}
                helperText={(touched.newPassword && errors.newPassword) || 'Password must be minimum 6+'}
              />

              <TextField
                id="confirmNewPassword"
                {...getFieldProps('confirmNewPassword')}
                fullWidth
                autoComplete="on"
                type="password"
                label="Confirm New Password"
                error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                helperText={touched.confirmNewPassword && errors.confirmNewPassword}
              />

              <LoadingButton
                id="save"
                type="submit"
                variant="contained"
                sx={{width: '100%', boxShadow: 'none !important'}}
                loading={isLoading}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      </Card>
    </Grid>
  )
}
