import * as Yup from 'yup'
import {useState} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
// material
import {Stack, TextField, Divider, Box, Typography, Select} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'

const PROGRAM_COURSE = [
  {label: 'None', value: 'None'},
  {label: 'Outstanding Leadership Award', value: 'Outstanding Leadership Award'},
  {label: 'Overachiever Award', value: 'Overachiever Award'},
  {label: 'Exemplary Character Award', value: 'Exemplary Character Award'},
  {label: 'The Epitome of Teamwork Award', value: 'The Epitome of Teamwork Award'},
  {label: 'Mentorship Award', value: 'Mentorship Award'},
  {label: 'Innovation Award', value: 'Innovation Award'},
  {label: 'Extraordinary Diligence Award', value: 'Extraordinary Diligence Award'}
]

const fields = [
  'collegeName',
  'collegeYear',
  'collegeAwards',
  'collegeDegree',
  'vocationalProgram',
  'vocationalYear',
  'vocationalAwards',
  'vocationalProgramCourse'
]

export default function PersonalForm({user, onNext, onStoreData}) {
  const [isLoading, setLoading] = useState(false)
  const {enqueueSnackbar} = useSnackbar()

  const PersonalSchema = Yup.object().shape({
    highSchoolName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    highSchoolYear: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    highSchoolAwards: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    collegeName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    collegeYear: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    collegeAwards: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    collegeDegree: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    vocationalProgram: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    vocationalYear: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    vocationalAwards: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!')
  })

  const formik = useFormik({
    initialValues: {
      highSchoolName: user.highSchoolName || '',
      highSchoolYear: user.highSchoolYear || '',
      highSchoolAwards: user.highSchoolAwards || '',
      collegeName: user.collegeName || '',
      collegeYear: user.collegeYear || '',
      collegeAwards: user.collegeAwards || '',
      collegeDegree: user.collegeDegree || '',
      vocationalProgram: user.vocationalProgram || '',
      vocationalYear: user.vocationalYear || '',
      vocationalAwards: user.vocationalAwards || ''
    },
    enableReinitialize: true,
    validationSchema: PersonalSchema,
    onSubmit: async (values) => {
      setLoading(true)

      fields.forEach((inpt) => {
        if (!values[inpt]) {
          if (inpt !== 'vocationalProgramCourse') {
            values[inpt] = 'N/A'
            setFieldValue(inpt, 'N/A')
          } else {
            values[inpt] = 'None'
            setFieldValue('vocationalProgramCourse', 'None')
          }
        }
      })

      if (
        !values.highSchoolName ||
        !values.highSchoolYear ||
        !values.highSchoolAwards ||
        !values.collegeName ||
        !values.collegeAwards ||
        !values.collegeDegree ||
        !values.vocationalProgram ||
        !values.vocationalYear ||
        !values.vocationalAwards
      ) {
        enqueueSnackbar('Kindly fill-out details such as High School', {variant: 'warning'})
        return setLoading(false)
      }

      onStoreData(values, 'education')
      onNext()
    }
  })

  const {errors, values, touched, handleSubmit, setFieldValue, getFieldProps} = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="body1" sx={{mb: 3, mt: 3, fontWeight: 'bold'}}>
          Education Background
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <TextField
                fullWidth
                label="High school"
                {...getFieldProps('highSchoolName')}
                error={Boolean(touched.highSchoolName && errors.highSchoolName)}
                helperText={touched.highSchoolName && errors.highSchoolName}
              />
              <TextField
                fullWidth
                label="Year graduated"
                {...getFieldProps('highSchoolYear')}
                error={Boolean(touched.highSchoolYear && errors.highSchoolYear)}
                helperText={touched.highSchoolYear && errors.highSchoolYear}
              />
            </Stack>

            <Stack sx={{mt: 3}} direction={{xs: 'column', sm: 'column'}} spacing={2}>
              <TextField
                fullWidth
                label="Awards Received"
                {...getFieldProps('highSchoolAwards')}
                error={Boolean(touched.highSchoolAwards && errors.highSchoolAwards)}
                helperText={touched.highSchoolAwards && errors.highSchoolAwards}
              />
            </Stack>
          </Box>
          <Divider sx={{my: 3}} />
          <Box>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <TextField
                fullWidth
                label="College"
                {...getFieldProps('collegeName')}
                error={Boolean(touched.collegeName && errors.collegeName)}
                helperText={touched.collegeName && errors.collegeName}
              />
              <TextField
                fullWidth
                label="Year graduated"
                {...getFieldProps('collegeYear')}
                error={Boolean(touched.collegeYear && errors.collegeYear)}
                helperText={touched.collegeYear && errors.collegeYear}
              />
            </Stack>

            <Stack sx={{mt: 3}} direction={{xs: 'column', sm: 'column'}} spacing={2}>
              <TextField
                fullWidth
                label="Awards Received"
                {...getFieldProps('collegeAwards')}
                error={Boolean(touched.collegeAwards && errors.collegeAwards)}
                helperText={touched.collegeAwards && errors.collegeAwards}
              />
            </Stack>
          </Box>
          <Divider sx={{my: 3}} />
          <Box>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <TextField
                fullWidth
                label="Vocational Program"
                {...getFieldProps('vocationalProgram')}
                error={Boolean(touched.vocationalProgram && errors.vocationalProgram)}
                helperText={touched.vocationalProgram && errors.vocationalProgram}
              />
              <TextField
                fullWidth
                label="Year graduated"
                {...getFieldProps('vocationalYear')}
                error={Boolean(touched.vocationalYear && errors.vocationalYear)}
                helperText={touched.vocationalYear && errors.vocationalYear}
              />
            </Stack>

            <Stack sx={{mt: 3}} direction={{xs: 'column', sm: 'column'}} spacing={2}>
              <TextField
                fullWidth
                label="Awards Received"
                {...getFieldProps('vocationalAwards')}
                error={Boolean(touched.vocationalAwards && errors.vocationalAwards)}
                helperText={touched.vocationalAwards && errors.vocationalAwards}
              />

              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                Program / Course
              </Typography>
              <Select native {...getFieldProps('vocationalProgramCourse')} value={values.civilStatus}>
                <option selected value="" key="initialProgramCourse" disabled>
                  Select Program / Course
                </option>
                {PROGRAM_COURSE.map((v, k) => {
                  return (
                    <option key={k} value={v.value}>
                      {v.label}
                    </option>
                  )
                })}
              </Select>
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
