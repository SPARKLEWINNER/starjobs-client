import * as Yup from 'yup'
import {useCallback, useState} from 'react'
import {Form, FormikProvider, useFormik} from 'formik'
import {
  Box,
  Grid,
  Card,
  Stack,
  Switch,
  TextField,
  FormControlLabel,
  Typography,
  FormHelperText,
} from '@material-ui/core'
import {LoadingButton} from '@material-ui/lab'
import {UploadAvatar} from '../../../upload'
import {fData} from '../../../../utils/formatNumber'

const AccountGeneral = ({_data}) => {
  const [isEdit, setIsEdit] = useState(false)
  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      displayName:
        _data.firstName === null
          ? _data.displayName
            ? _data.displayName
            : ''
          : `${_data.firstName} ${_data.lastName}`,
      email: _data.email || '',
      photoURL: _data.image || '',
      phoneNumber: _data.phone || '',
      company: _data.company || '',
      isVerified: _data.isVerified || '',
    },
    validationSchema: UpdateUserSchema,
    onSubmit: async (values, {setErrors, setSubmitting}) => {
      try {
        // await updateProfile({ ...values });
        // enqueueSnackbar('Update success', { variant: 'success' });
        setSubmitting(false)
      } catch (error) {
        setErrors({afterSubmit: error.code})
        setSubmitting(false)
      }
    },
  })

  const {values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue} = formik

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setFieldValue('photoURL', {
          ...file,
          preview: URL.createObjectURL(file),
        })
      }
    },
    [setFieldValue],
  )

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{py: 10, px: 3, textAlign: 'center'}}>
              <UploadAvatar
                accept="image/*"
                file={values.photoURL}
                maxSize={3145728}
                onDrop={handleDrop}
                error={Boolean(touched.photoURL && errors.photoURL)}
                caption={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />

              <FormHelperText error sx={{px: 2, textAlign: 'center'}}>
                {touched.photoURL && errors.photoURL}
              </FormHelperText>

              <FormControlLabel
                control={<Switch {...getFieldProps('isVerified')} color="primary" />}
                labelPlacement="start"
                label="Account Verified"
                sx={{mt: 5}}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{p: 3}}>
              <Stack spacing={{xs: 2, md: 3}}>
                <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...getFieldProps('displayName')}
                    InputProps={{
                      readOnly: isEdit ? false : true,
                    }}
                  />
                  <TextField
                    fullWidth
                    disabled
                    label="Email Address"
                    {...getFieldProps('email')}
                    InputProps={{
                      readOnly: isEdit ? false : true,
                    }}
                  />
                </Stack>

                <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phoneNumber')}
                    InputProps={{
                      readOnly: isEdit ? false : true,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Company"
                    {...getFieldProps('company')}
                    InputProps={{
                      readOnly: isEdit ? false : true,
                    }}
                  />
                </Stack>
              </Stack>

              <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                <Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
                  {!isEdit ? (
                    <LoadingButton type="button" variant="contained" onClick={() => setIsEdit(true)}>
                      Edit Profile
                    </LoadingButton>
                  ) : (
                    <>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Save Changes
                      </LoadingButton>

                      <LoadingButton type="button" variant="contained" spacing={2} onClick={() => setIsEdit(false)}>
                        Cancel Edit
                      </LoadingButton>
                    </>
                  )}
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  )
}

export default AccountGeneral
