import * as Yup from 'yup'
import {useState, useEffect} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
import moment from 'moment'
// material
import {Stack, TextField, Select, Typography} from '@material-ui/core'
import {LoadingButton, MobileDatePicker, LocalizationProvider} from '@material-ui/lab'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import {useSnackbar} from 'notistack5'
import DatePicker from 'react-datepicker'

export default function GigForm({user, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const [category, setCategory] = useState([])
  const [date, setDate] = useState(new Date())
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const current_date = new Date()

  const GigSchema = Yup.object().shape({
    position: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Gig position is required'),
    date: Yup.string(),
    shift: Yup.string().min(2, 'Too Short!').required('Gig Shift is required'),
    hours: Yup.number().required('Gig hours is calculated by From and To selection'),
    fee: Yup.number().min(1, 'Min value 1.').required('Gig fee is required'),
    from: Yup.string().required('Gig Start time is required'),
    to: Yup.string().required('Gig End time is required'),
    notes: Yup.string(),
  })

  const formik = useFormik({
    initialValues: {
      date: '',
      fee: '',
      position: '',
      shift: '',
      hours: '    ',
      from: '',
      to: '', // time
      notes: '',
    },
    enableReinitialize: true,
    validationSchema: GigSchema,
    onSubmit: () => {
      setLoading(true)

      if (!values.date) {
        values.date = moment(date).format('YYYY-MM-DD')
      }

      values.from = moment(values.from)
      values.to = moment(values.to)

      if (!values.position || !values.shift || !values.hours || !values.fee || !values.notes) return setLoading(false)

      let data = {
        position: values.position,
        date: values.date,
        shift: values.shift,
        hours: values.hours,
        fee: values.fee,
        time: values.to,
        from: values.from,
        notes: values.notes,
      }
      setLoading(false)
      onStoreData(data)
      onNext()
    },
  })

  const {values, errors, touched, handleSubmit, setFieldValue, getFieldProps} = formik

  const handleCalculate = (newValue) => {
    setTo(newValue)

    if (!from) {
      setFieldValue('hours', 0.0)
      return enqueueSnackbar('Select start time', {variant: 'warning'})
    }

    let from_hours = moment(from, 'HH:mm a')
    let to_hours = moment(newValue, 'HH:mm a')

    setFieldValue('to', to_hours)
    setFieldValue('from', from_hours)

    if (!to_hours.isAfter(from_hours)) {
      setFieldValue('hours', 0.0)
      return enqueueSnackbar('Cannot set time behind from the start time', {variant: 'warning'})
    }

    let duration = moment.duration(to_hours.diff(from_hours)).asHours()
    if (duration < 0) return

    setFieldValue('hours', duration.toFixed(2))
  }

  const handleFrom = (newValue) => {
    setFrom(newValue)
    let from_hours = moment(newValue, 'HH:mm a')
    setFieldValue('from', from_hours)

    if (!to) return

    let to_hours = moment(to, 'HH:mm a')

    if (!to_hours.isAfter(from_hours)) {
      setFieldValue('hours', 0.0)
      return enqueueSnackbar('Cannot set  time ahead of end time', {variant: 'warning'})
    }

    let duration = moment.duration(to_hours.diff(from_hours)).asHours()
    if (duration < 0) return
    window.scrollTo(0, 0)

    setFieldValue('hours', duration.toFixed(2))
  }

  const handleFeeFormat = (value) => {
    setFieldValue('fee', parseFloat(value).toFixed(2))
  }

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <TextField
              fullWidth
              label="Type of work"
              {...getFieldProps('position')}
              error={Boolean(touched.position && errors.position)}
              helperText={touched.position && errors.position}
            />
          </Stack>
          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                orientation="portrait"
                label="Date"
                value={date}
                minDate={current_date}
                onChange={(newValue) => {
                  setDate(newValue)
                }}
                renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
              />
            </LocalizationProvider>
          </Stack>

          <Stack direction={{sm: 'row', xs: 'column'}} spacing={2}>
            <DatePicker
              onChange={(date) => handleFrom(date)}
              minDate={current_date}
              selected={from || ''}
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={<TextField fullWidth margin="normal" sx={{marginTop: '0 !important'}} label="Start date" />}
            />
            <DatePicker
              onChange={(date) => handleCalculate(date)}
              minDate={current_date}
              selected={to || ''}
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={<TextField fullWidth margin="normal" sx={{marginTop: '0 !important'}} label="End date" />}
            />
          </Stack>

          <TextField
            fullWidth
            label="Shift"
            {...getFieldProps('shift')}
            error={Boolean(touched.shift && errors.shift)}
            helperText={touched.shift && errors.shift}
          />

          <TextField
            fullWidth
            label="No. of hours"
            type="number"
            {...getFieldProps('hours')}
            error={Boolean(touched.hours && errors.hours)}
            helperText={touched.hours && errors.hours}
          />
          <Typography variant="body2" sx={{mt: '6px !important', opacity: 0.5}}>
            Note: Adjust the break/lunch time.
          </Typography>
          <TextField
            fullWidth
            label="Gig Fee"
            type="number"
            onChange={(value) => handleFeeFormat(value.target.value)}
            error={Boolean(touched.fee && errors.fee)}
            helperText={touched.fee && errors.fee}
          />

          <TextField
            label="Special Instruction"
            key="notes"
            rows={6}
            fullWidth
            multiline
            sx={{mt: 3}}
            {...getFieldProps('notes')}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
            Continue
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
