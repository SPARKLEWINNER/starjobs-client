import * as Yup from 'yup'
import {useState} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
// material
import {Stack, TextField, Box, Typography} from '@material-ui/core'
import {LoadingButton} from '@material-ui/lab'

export default function PersonalForm({user, stored, onNext, onStoreData}) {
  const [isLoading, setLoading] = useState(false)

  let store = stored.personal ? stored.personal : undefined

  const PersonalSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name is required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name is required'),
    middleInitial: Yup.string().required('Middle initial is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email address is required'),
  })

  const formik = useFormik({
    initialValues: {
      firstName: user.name || store.firstName || '',
      lastName: store.lastName || '',
      middleInitial: store.middleInitial || '',
      email: store.email,
      companyName: store.companyName || '',
      brandName: store.brandName || '',
      location: store.location || '',
      website: store.website || '',
      companyPosition: store.companyPosition || '',
    },
    enableReinitialize: true,
    validationSchema: PersonalSchema,
    onSubmit: async (values) => {
      setLoading(true)

      if (
        !values.firstName ||
        !values.lastName ||
        !values.middleInitial ||
        !values.email ||
        !values.companyName ||
        !values.brandName ||
        !values.location ||
        !values.website ||
        !values.companyPosition
      )
        return setLoading(false)

      let data = {
        firstName: values.firstName,
        lastName: values.lastName,
        middleInitial: values.middleInitial,
        email: values.email,
        companyName: values.companyName,
        brandName: values.brandName,
        location: values.location,
        website: values.website,
        companyPosition: values.companyPosition,
      }

      onStoreData(data, 'personal')
      onNext()
    },
  })

  const {errors, touched, handleSubmit, getFieldProps} = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="body1" sx={{mb: 3, mt: 3, fontWeight: 'bold'}}>
          Personal Information
        </Typography>
        <Stack spacing={3}>
          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <TextField
              autoFocus
              fullWidth
              autoComplete="name"
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
          </Stack>

          <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
            <TextField
              fullWidth
              autoComplete="name"
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />

            <TextField
              fullWidth
              label="Middle Initial"
              {...getFieldProps('middleInitial')}
              error={Boolean(touched.middleInitial && errors.middleInitial)}
              helperText={touched.middleInitial && errors.middleInitial}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Email address"
            InputLabelProps={{
              shrink: true,
            }}
            {...getFieldProps('email')}
            disabled
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <Box>
            <Typography variant="body1" sx={{mt: 3, mb: 3, fontWeight: 'bold'}}>
              Company Details
            </Typography>

            <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
              <TextField
                fullWidth
                label="Company name"
                {...getFieldProps('companyName')}
                error={Boolean(touched.companyName && errors.companyName)}
                helperText={touched.companyName && errors.companyName}
              />
              <TextField
                fullWidth
                label="Brand name"
                {...getFieldProps('brandName')}
                error={Boolean(touched.brandName && errors.brandName)}
                helperText={touched.brandName && errors.brandName}
              />
              <TextField
                fullWidth
                label="Location"
                {...getFieldProps('location')}
                error={Boolean(touched.location && errors.location)}
                helperText={touched.location && errors.location}
              />
              <TextField
                fullWidth
                label="Website"
                {...getFieldProps('website')}
                error={Boolean(touched.website && errors.website)}
                helperText={touched.website && errors.website}
              />
              <TextField
                fullWidth
                label="Position in the company"
                {...getFieldProps('companyPosition')}
                error={Boolean(touched.companyPosition && errors.companyPosition)}
                helperText={touched.companyPosition && errors.companyPosition}
              />
            </Stack>
          </Box>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
            Continue
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
