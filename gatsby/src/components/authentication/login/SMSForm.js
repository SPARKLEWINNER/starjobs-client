import * as Yup from 'yup'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {useSnackbar} from 'notistack'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Typography,
  Stack,
  TextField
} from '@mui/material'
import {useFormik, Form, FormikProvider} from 'formik'
import {LoadingButton} from '@mui/lab'

import auth_api from 'libs/endpoints/auth'

const SMSDialog = ({account, open, onClose}) => {
  const [isLoading, setLoading] = useState(false)
  const {enqueueSnackbar} = useSnackbar()

  const SMSSchema = Yup.object().shape({
    phone: Yup.string()
      .min(11, 'Not a valid phone number! (ex. 091523468790)')
      .max(11, 'Not a valid phone number! (ex. 091523468790)')
      .required('Phone number is required')
  })

  const formik = useFormik({
    initialValues: {
      phone: ''
    },
    validationSchema: SMSSchema,
    onSubmit: async (values) => {
      setLoading(true)

      if (!values.phone || !account) return setLoading(false)
      const result = await auth_api.post_resend_verification({email: account.email, phone: values.phone}, 'sms')
      if (!result.ok) return setLoading(false)
      enqueueSnackbar(result.data.msg, {variant: 'success'})
      setLoading(false)
      onClose()

      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h4">Re-send verification code via SMS</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body2" sx={{textAlign: 'center'}}>
              We don't have any record of your phone number, Kindly provide it so we could send it via SMS.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display: 'block', pb: 5, px: 5}}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{mb: 3}}>
                <TextField
                  fullWidth
                  type="tel"
                  inputProps={{maxLength: 11, minLength: 11}}
                  label="Phone number"
                  autoFocus
                  {...getFieldProps('phone')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </Stack>

              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
                Submit
              </LoadingButton>
            </Form>
          </FormikProvider>
        </DialogActions>
      </Dialog>
    </div>
  )
}

SMSDialog.propTypes = {
  account: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default SMSDialog
