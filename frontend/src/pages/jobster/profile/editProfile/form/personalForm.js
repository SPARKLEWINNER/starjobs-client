import * as Yup from 'yup'
import { useState } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'
// material
import { Stack, TextField, FormControlLabel, Box, Typography, Checkbox, Select } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import { useSnackbar } from 'notistack5'

import { fCamelCase } from 'utils/formatCase';

export default function PersonalForm({ user, stored, onNext, onStoreData }) {
  const { enqueueSnackbar } = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const store = stored.personal ? stored.personal : undefined

  const PersonalSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name is required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name is required'),
    middleInitial: Yup.string().required('Middle initial is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email address is required'),
    gender: Yup.string().required('Gender is required'),
    religion: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Religion is required'),
    civilStatus: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Civil is required'),
    citizenship: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Citizenship is required'),
    presentBlkNo: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Present Blk. No. is required'),
    presentZipCode: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Present Zip Code is required'),
    presentStreetName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Present Street Name is required'),
    presentCity: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Present City is required'),
    samePermanentAddress: Yup.boolean(),
    emergencyName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Emergency Name is required'),
    emergencyContact: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Emergency Contact is required'),
    emergencyRelation: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Emergency Relation is required'),
    permanentBlkNo: Yup.string(),
    permanentZipCode: Yup.string(),
    permanentStreetName: Yup.string(),
    permanentCity: Yup.string(),
  })

  const formik = useFormik({
    initialValues: {
      firstName: user.name || store.firstName || '',
      lastName: store.lastName || '',
      middleInitial: store.middleInitial || '',
      email: user.email || store.email || '',
      gender: store.gender || '',
      religion: store.religion || '',
      civilStatus: store.civilStatus || '',
      citizenship: store.citizenship || '',
      presentBlkNo: store.presentBlkNo || '',
      presentZipCode: store.presentZipCode || '',
      presentStreetName: store.presentStreetName || '',
      samePermanentAddress: store.samePermanentAddress || false,
      presentCity: store.presentCity || '',
      emergencyName: store.emergencyName || '',
      emergencyContact: store.emergencyContact || '',
      emergencyRelation: store.emergencyRelation || '',
      permanentBlkNo: store.permanentBlkNo || '',
      permanentZipCode: store.permanentZipCode || '',
      permanentStreetName: store.permanentStreetName || '',
      permanentCity: store.permanentCity || '',
    },
    enableReinitialize: true,
    validationSchema: PersonalSchema,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setLoading(true)
      let isComplete = true;
      if (
        !values.firstName ||
        !values.lastName ||
        !values.middleInitial ||
        !values.email ||
        !values.gender ||
        !values.religion ||
        !values.civilStatus ||
        !values.citizenship ||
        !values.presentBlkNo ||
        !values.presentZipCode ||
        !values.presentStreetName ||
        !values.presentCity ||
        !values.emergencyName ||
        !values.emergencyContact ||
        !values.emergencyRelation
      )
        return setLoading(false)

      if (!values.samePermanentAddress) {

        Object.keys(values).forEach((item) => {
          let field = values[item];

          if (item === 'samePermanentAddress') return

          if (!field) {
            isComplete = false;
            enqueueSnackbar(`Required field ${fCamelCase(item)}`, { variant: 'warning' });
          }

        });
        setLoading(false);
      }

      if (!isComplete) {
        return
      }


      let data = {
        firstName: values.firstName,
        lastName: values.lastName,
        middleInitial: values.middleInitial,
        email: values.email,
        gender: values.gender,
        religion: values.religion,
        civilStatus: values.civilStatus,
        citizenship: values.citizenship,
        presentBlkNo: values.presentBlkNo,
        presentZipCode: values.presentZipCode,
        presentStreetName: values.presentStreetName,
        presentCity: values.presentCity,
        emergencyName: values.emergencyName,
        emergencyContact: values.emergencyContact,
        emergencyRelation: values.emergencyRelation,
        permanentBlkNo: values.permanentBlkNo,
        permanentZipCode: values.permanentZipCode,
        permanentStreetName: values.permanentStreetName,
        permanentCity: values.permanentCity,
      }

      if (values.samePermanentAddress) {
        data.permanentBlkNo = values.presentBlkNo
        data.permanentZipCode = values.presentZipCode
        data.permanentStreetName = values.presentStreetName
        data.permanentCity = values.presentCity
      }

      onStoreData(data, 'personal')
      onNext()
    },
  })

  const { values, errors, touched, handleSubmit, getFieldProps } = formik
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="body1" sx={{ mb: 3, mt: 3, fontWeight: 'bold' }}>
          Personal Information
        </Typography>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'column' }} spacing={2}>
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

          <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2}>
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
              label="Middle Initial (If not applicable put N/A or n/a)"
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
            {...getFieldProps('email')}
            disabled
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <Select native {...getFieldProps('gender')} value={values.gender}>
            <option value="" key="initial">
              Select Gender
            </option>
            <option key="male" value="Male">
              Male
            </option>
            <option key="female" value="Female">
              Female
            </option>
            <option key="private" value="Private">
              I'd rather not say
            </option>
          </Select>

          <TextField
            fullWidth
            label="Religion"
            {...getFieldProps('religion')}
            error={Boolean(touched.religion && errors.religion)}
            helperText={touched.religion && errors.religion}
          />

          <Select native {...getFieldProps('civilStatus')} value={values.civilStatus}>
            <option value="" key="initialStatus">
              Select Civil status
            </option>
            <option key="single" value="Single">
              Single
            </option>
            <option key="married" value="Married">
              Married
            </option>
          </Select>

          <TextField
            fullWidth
            label="Citizenship"
            {...getFieldProps('citizenship')}
            error={Boolean(touched.citizenship && errors.citizenship)}
            helperText={touched.citizenship && errors.citizenship}
          />

          <Box>
            <Typography variant="body1" sx={{ mt: 3, fontWeight: 'bold' }}>
              Present Address
            </Typography>
            <FormControlLabel
              sx={{ mb: 3 }}
              control={<Checkbox color="primary" {...getFieldProps('samePermanentAddress')} />}
              label={
                <Typography variant="body2" align="left" sx={{ color: 'text.secondary' }}>
                  Same as Permanent Address
                </Typography>
              }
            />

            <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Blk. No."
                {...getFieldProps('presentBlkNo')}
                error={Boolean(touched.presentBlkNo && errors.presentBlkNo)}
                helperText={touched.presentBlkNo && errors.presentBlkNo}
              />
              <TextField
                fullWidth
                label="Zip code"
                {...getFieldProps('presentZipCode')}
                error={Boolean(touched.presentZipCode && errors.presentZipCode)}
                helperText={touched.presentZipCode && errors.presentZipCode}
              />
            </Stack>
          </Box>

          <TextField
            fullWidth
            label="Street Name"
            {...getFieldProps('presentStreetName')}
            error={Boolean(touched.presentStreetName && errors.presentStreetName)}
            helperText={touched.presentStreetName && errors.presentStreetName}
          />

          <TextField
            fullWidth
            label="City"
            {...getFieldProps('presentCity')}
            error={Boolean(touched.presentCity && errors.presentCity)}
            helperText={touched.presentCity && errors.presentCity}
          />
          {!values.samePermanentAddress ? (
            <>
              <Box>
                <Typography variant="body1" sx={{ mb: 3, mt: 3, fontWeight: 'bold' }}>
                  Permanent Address
                </Typography>
                <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Blk. No."
                    {...getFieldProps('permanentBlkNo')}
                    error={Boolean(touched.permanentBlkNo && errors.permanentBlkNo)}
                    helperText={touched.permanentBlkNo && errors.permanentBlkNo}
                  />
                  <TextField
                    fullWidth
                    label="Zip code"
                    {...getFieldProps('permanentZipCode')}
                    error={Boolean(touched.permanentZipCode && errors.permanentZipCode)}
                    helperText={touched.permanentZipCode && errors.permanentZipCode}
                  />
                </Stack>
              </Box>

              <TextField
                fullWidth
                label="Street Name"
                {...getFieldProps('permanentStreetName')}
                error={Boolean(touched.permanentStreetName && errors.permanentStreetName)}
                helperText={touched.permanentStreetName && errors.permanentStreetName}
              />

              <TextField
                fullWidth
                label="City"
                {...getFieldProps('permanentCity')}
                error={Boolean(touched.permanentCity && errors.permanentCity)}
                helperText={touched.permanentCity && errors.permanentCity}
              />
            </>
          ) : (
            ''
          )}

          <Box>
            <Typography variant="body1" sx={{ mb: 3, mt: 3, fontWeight: 'bold' }}>
              Emergency Contact person
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'column' }} spacing={2}>
              <TextField
                fullWidth
                label="Name (ex. Juan Dela Cruz)"
                {...getFieldProps('emergencyName')}
                error={Boolean(touched.emergencyName && errors.emergencyName)}
                helperText={touched.emergencyName && errors.emergencyName}
              />
              <TextField
                fullWidth
                label="Contact No. (ex. 09123456789 / 2601234)"
                {...getFieldProps('emergencyContact')}
                error={Boolean(touched.emergencyContact && errors.emergencyContact)}
                helperText={touched.emergencyContact && errors.emergencyContact}
              />
              <TextField
                fullWidth
                label="Relation (ex. Father)"
                {...getFieldProps('emergencyRelation')}
                error={Boolean(touched.emergencyRelation && errors.emergencyRelation)}
                helperText={touched.emergencyRelation && errors.emergencyRelation}
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
