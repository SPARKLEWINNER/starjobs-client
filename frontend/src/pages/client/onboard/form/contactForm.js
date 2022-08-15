import * as Yup from 'yup'
import {useState} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
// material
import {Stack, TextField, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'

import PropTypes from 'prop-types'

ContactForm.propTypes = {
  user: PropTypes.object,
  stored: PropTypes.object,
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

export default function ContactForm({stored, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)

  let store = stored.contact ? stored.contact : undefined

  const Schema = Yup.object().shape({
    telephone: Yup.string().required('Telephone is required'),
    mobile: Yup.string().required('Mobile is required'),
    blkNo: Yup.string().required('Blk no. is required'),
    zipCode: Yup.string().required('Zip code is required'),
    streetName: Yup.string().required('Street Name is required'),
    city: Yup.string().required('City is required')
  })

  const formik = useFormik({
    initialValues: {
      telephone: store.telephone || '',
      mobile: store.mobile || '',
      blkNo: store.blkNo || '',
      zipCode: store.zipCode || '',
      streetName: store.streetName || '',
      city: store.city || ''
    },
    enableReinitialize: true,
    validationSchema: Schema,
    onSubmit: async (values) => {
      setLoading(true)

      if (
        !values.telephone ||
        !values.mobile ||
        !values.blkNo ||
        !values.zipCode ||
        !values.streetName ||
        !values.city
      ) {
        enqueueSnackbar('Missing field details, Kindly add N/A if no actual details')
        return setLoading(false)
      }

      let data = {
        telephone: values.telephone,
        mobile: values.mobile,
        blkNo: values.blkNo,
        zipCode: values.zipCode,
        streetName: values.streetName,
        city: values.city
      }

      onStoreData(data, 'contact')
      onNext()
    }
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="body1" sx={{mb: 3, mt: 3, fontWeight: 'bold'}}>
          Company Contacts
        </Typography>
        <Stack spacing={3}>
          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <TextField
              id="telephone"
              autoFocus
              fullWidth
              label="Telephone"
              {...getFieldProps('telephone')}
              error={Boolean(touched.telephone && errors.telephone)}
              helperText={touched.telephone && errors.telephone}
            />
          </Stack>

          <TextField
            id="mobile"
            fullWidth
            label="Mobile no."
            {...getFieldProps('mobile')}
            error={Boolean(touched.mobile && errors.mobile)}
            helperText={touched.mobile && errors.mobile}
          />
          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <TextField
              id="blkNo"
              fullWidth
              label="Blk. no."
              {...getFieldProps('blkNo')}
              error={Boolean(touched.blkNo && errors.blkNo)}
              helperText={touched.blkNo && errors.blkNo}
            />
            <TextField
              id="zipCode"
              fullWidth
              label="Zip code"
              {...getFieldProps('zipCode')}
              error={Boolean(touched.zipCode && errors.zipCode)}
              helperText={touched.zipCode && errors.zipCode}
            />

            <TextField
              id="streetName"
              fullWidth
              label="Street name"
              {...getFieldProps('streetName')}
              error={Boolean(touched.streetName && errors.streetName)}
              helperText={touched.streetName && errors.streetName}
            />

            <TextField
              id="city"
              fullWidth
              label="City"
              {...getFieldProps('city')}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city && errors.city}
            />

            <Stack sx={{mt: 5}}>
              {errors &&
                Object.values(errors).map((message, index) => (
                  <Typography
                    key={`error-${index}`}
                    variant="subtitle2"
                    sx={{color: 'error.main', mb: 0.5, mt: '0 !important', fontWeight: '400', fontSize: '0.75rem'}}
                    component="p"
                  >
                    {message}
                  </Typography>
                ))}
            </Stack>
          </Stack>

          <LoadingButton
            id="continueContactForm"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
          >
            Continue
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
