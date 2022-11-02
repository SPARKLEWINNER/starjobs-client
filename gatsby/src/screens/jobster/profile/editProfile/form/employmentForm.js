import React, {useState} from 'react'
import PropTypes from 'prop-types'

import {useFormik, Form, FormikProvider} from 'formik'
import * as Yup from 'yup'
// material
import {Stack, TextField, FormControlLabel, Typography, Checkbox} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'

import {fCamelCase} from 'utils/formatCase'

EmploymentForm.propTypes = {
  user: PropTypes.object,
  stored: PropTypes.object,
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

export default function EmploymentForm({stored, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const store = stored.work ? stored.work : undefined
  const Schema = Yup.object().shape({
    currentCompany: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('If none kindly put N/A'),
    currentPosition: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('If none kindly put N/A'),
    currentStartDate: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('If none kindly put N/A'),
    currentEndDate: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    currentPlaceOfWork: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('If none kindly put N/A'),
    pastCompany: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    pastPosition: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    pastStartDate: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    pastEndDate: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    pastPlaceOfWork: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    isCurrentWork: Yup.boolean(),
    isFreshGraduate: Yup.boolean()
  })

  const formik = useFormik({
    initialValues: {
      currentCompany: store.currentCompany || '',
      currentPosition: store.currentPosition || '',
      currentStartDate: store.currentStartDate || '',
      currentEndDate: store.currentEndDate || '',
      currentPlaceOfWork: store.currentPlaceOfWork || '',
      pastCompany: store.pastCompany || '',
      pastPosition: store.pastPosition || '',
      pastStartDate: store.pastStartDate || '',
      pastEndDate: store.pastEndDate || '',
      pastPlaceOfWork: store.pastPlaceOfWork || '',
      isCurrentWork: store.isCurrentWork || false,
      isFreshGraduate: store.isFreshGraduate || false
    },
    enableReinitialize: true,
    validationSchema: Schema,
    onSubmit: async (values) => {
      setLoading(true)
      let isComplete = true
      if (!values.currentCompany || !values.currentPosition || !values.currentStartDate || !values.currentPlaceOfWork) {
        enqueueSnackbar('Missing field details, Kindly add N/A if no actual details')
        return setLoading(false)
      }

      if (!values.isFreshGraduate) {
        Object.keys(values).forEach((item) => {
          let field = values[item]

          if (item === 'isFreshGraduate') return
          if (item === 'isCurrentWork') return

          if (!field) {
            isComplete = false
            enqueueSnackbar(`Required field ${fCamelCase(item)}`, {variant: 'warning'})
          }
        })
        setLoading(false)
      }

      if (!isComplete) {
        return
      }

      let data = {
        currentCompany: values.currentCompany,
        currentPosition: values.currentPosition,
        currentStartDate: values.currentStartDate,
        currentEndDate: values.currentEndDate,
        currentPlaceOfWork: values.currentPlaceOfWork,
        pastCompany: values.pastCompany,
        pastPosition: values.pastPosition,
        pastStartDate: values.pastStartDate,
        pastEndDate: values.pastEndDate,
        pastPlaceOfWork: values.pastPlaceOfWork,
        isCurrentWork: values.isCurrentWork || false,
        isFreshGraduate: values.isFreshGraduate
      }

      if (values.isCurrentWork) {
        data.currentEndDate = 'N/A'
      }

      if (values.isFreshGraduate) {
        data.pastCompany = 'N/A'
        data.pastPosition = 'N/A'
        data.pastStartDate = 'N/A'
        data.pastEndDate = 'N/A'
        data.pastPlaceOfWork = 'N/A'
      }

      onStoreData(data, 'work')
      onNext()
    }
  })

  const {values, errors, touched, handleSubmit, getFieldProps} = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="body1" sx={{mb: 0, mt: 3, fontWeight: 'bold'}}>
          Work Experience
        </Typography>
        <Typography variant="body2" sx={{mt: 1, mb: 3, fontWeight: 'bold'}}>
          Current Employment
        </Typography>
        <Stack spacing={3}>
          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <TextField
              id="currentCompany"
              autoFocus
              fullWidth
              label="Company name"
              {...getFieldProps('currentCompany')}
              error={Boolean(touched.currentCompany && errors.currentCompany)}
              helperText={touched.currentCompany && errors.currentCompany}
            />
          </Stack>

          <TextField
            id="currentPosition"
            fullWidth
            label="Position"
            {...getFieldProps('currentPosition')}
            error={Boolean(touched.currentPosition && errors.currentPosition)}
            helperText={touched.currentPosition && errors.currentPosition}
          />
          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <TextField
              id="currentStartDate"
              fullWidth
              label="Start Date"
              {...getFieldProps('currentStartDate')}
              error={Boolean(touched.currentStartDate && errors.currentStartDate)}
              helperText={touched.currentStartDate && errors.currentStartDate}
            />

            {!formik.values.isCurrentWork ? (
              <TextField
                id="currentEndDate"
                fullWidth
                label="End date"
                {...getFieldProps('currentEndDate')}
                error={Boolean(touched.currentEndDate && errors.currentEndDate)}
                helperText={touched.currentEndDate && errors.currentEndDate}
              />
            ) : (
              ''
            )}
          </Stack>

          <TextField
            id="currentPlaceOfWork"
            fullWidth
            label="Place of work"
            {...getFieldProps('currentPlaceOfWork')}
            error={Boolean(touched.currentPlaceOfWork && errors.currentPlaceOfWork)}
            helperText={touched.currentPlaceOfWork && errors.currentPlaceOfWork}
          />

          <FormControlLabel
            sx={{mb: 3}}
            checked={formik.values.isCurrentWork}
            control={<Checkbox color="primary" {...getFieldProps('isCurrentWork')} />}
            label={
              <Typography variant="body2" align="left" sx={{color: 'text.secondary'}}>
                I currently work here
              </Typography>
            }
          />

          <Typography variant="body1" sx={{mb: 3, mt: 3, fontWeight: 'bold'}}>
            Past Employment
          </Typography>

          <FormControlLabel
            sx={{mb: 3}}
            checked={formik.values.isFreshGraduate}
            control={<Checkbox color="primary" {...getFieldProps('isFreshGraduate')} />}
            label={
              <Typography variant="body2" align="left" sx={{color: 'text.secondary'}}>
                Fresh Graduate
              </Typography>
            }
          />

          {!formik.values.isFreshGraduate ? (
            <>
              <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
                <TextField
                  id="pastCompany"
                  fullWidth
                  label="Past Company name"
                  {...getFieldProps('pastCompany')}
                  error={Boolean(touched.pastCompany && errors.pastCompany)}
                  helperText={touched.pastCompany && errors.pastCompany}
                />
              </Stack>

              <TextField
                id="pastPosition"
                fullWidth
                label="Position"
                {...getFieldProps('pastPosition')}
                error={Boolean(touched.pastPosition && errors.pastPosition)}
                helperText={touched.pastPosition && errors.pastPosition}
              />
              <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
                <TextField
                  id="pastStartDate"
                  fullWidth
                  label="Start Date"
                  {...getFieldProps('pastStartDate')}
                  error={Boolean(touched.pastStartDate && errors.pastStartDate)}
                  helperText={touched.pastStartDate && errors.pastStartDate}
                />

                {!values.currentWork ? (
                  <TextField
                    id="pastEndDate"
                    fullWidth
                    label="Past End date"
                    {...getFieldProps('pastEndDate')}
                    error={Boolean(touched.pastEndDate && errors.pastEndDate)}
                    helperText={touched.pastEndDate && errors.pastEndDate}
                  />
                ) : (
                  ''
                )}

                <TextField
                  id="pastPlaceOfWork"
                  fullWidth
                  label="Past Place of work"
                  {...getFieldProps('pastPlaceOfWork')}
                  error={Boolean(touched.pastPlaceOfWork && errors.pastPlaceOfWork)}
                  helperText={touched.pastPlaceOfWork && errors.pastPlaceOfWork}
                />
              </Stack>
            </>
          ) : (
            ''
          )}

          <LoadingButton
            id="continueEmploymentForm"
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
