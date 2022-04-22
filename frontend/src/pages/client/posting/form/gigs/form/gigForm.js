import * as Yup from 'yup'
import {useState} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
import moment from 'moment'
// material
import {Stack, TextField, Typography, FormControl, FormControlLabel, Checkbox, Select} from '@mui/material'
import {LoadingButton, MobileDatePicker, LocalizationProvider} from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {useSnackbar} from 'notistack5'
import DatePicker from 'react-datepicker'
import {calculations} from 'src/utils/gigComputation'

export default function GigForm({formData, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
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
    breakHr: Yup.number().required('Break hour/s is required'),
    locationRate: Yup.string().required('Gig location rate'),
    notes: Yup.string()
  })

  const formik = useFormik({
    initialValues: {
      date: formData?.date ?? '',
      fee: formData?.fee ?? '',
      position: formData?.position ?? '',
      shift: '',
      hours: formData?.hours ?? '',
      from: formData?.from ?? '',
      to: formData?.time ?? '', // time
      breakHr: formData?.breakHr ?? 0,
      notes: formData?.notes ?? '',
      locationRate: formData?.locationRate ?? ''
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

      if (!values.position || !values.shift || !values.hours || !values.fee) return setLoading(false)

      const {
        computedFeeByHr,
        voluntaryFee,
        appFee,
        transactionFee,
        grossGigFee,
        grossVAT,
        grossWithHolding,
        serviceCost,
        jobsterTotal
      } = calculations(values.hours, values.fee, values.locationRate)

      let data = {
        position: values.position,
        date: values.date,
        shift: values.shift,
        hours: values.hours,
        fee: values.fee,
        time: values.to,
        from: values.from,
        breakHr: values.break,
        notes: values.notes ?? '',
        locationRate: values.locationRate,
        fees: {
          computedFeeByHr: computedFeeByHr,
          voluntaryFee: voluntaryFee,
          appFee: appFee,
          transactionFee: transactionFee,
          grossGigFee: grossGigFee,
          grossVAT: grossVAT,
          grossWithHolding: grossWithHolding,
          serviceCost: serviceCost,
          jobsterTotal: jobsterTotal
        }
      }
      setLoading(false)
      onStoreData(data)
      onNext()
    }
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

  const handleBreakTimeReduceHours = (value) => {
    let from_hours = moment(from, 'HH:mm a')
    let to_hours = moment(to, 'HH:mm a')

    let totalHours = moment.duration(to_hours.diff(from_hours)).asHours()
    if (totalHours < 0 || !totalHours) return

    setFieldValue('hours', parseFloat(totalHours - value).toFixed(2))
    setFieldValue('break', parseInt(value).toFixed(2))
  }

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <TextField
              fullWidth
              label="Type of work"
              type="text"
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
                value={moment(new Date()).format('YYYY-MM-DD')}
                minDate={current_date}
                onChange={(newValue) => {
                  setDate(newValue)
                  setFieldValue('date', moment(newValue).format('YYYY-MM-DD'))
                }}
                renderInput={(params) => <TextField type="text" fullWidth {...params} margin="normal" />}
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
              customInput={
                <TextField
                  type="text"
                  fullWidth
                  margin="normal"
                  sx={{marginTop: '0 !important'}}
                  label="Start date"
                  value={values.from ?? ''}
                />
              }
            />
            <DatePicker
              onChange={(date) => handleCalculate(date)}
              minDate={current_date}
              selected={to || ''}
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={
                <TextField
                  type="text"
                  fullWidth
                  margin="normal"
                  sx={{marginTop: '0 !important'}}
                  label="End date"
                  value={values.time ?? ''}
                />
              }
            />
          </Stack>

          <TextField
            fullWidth
            label="Shift"
            type="text"
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

          <FormControl fullWidth sx={{my: 0}}>
            <FormControlLabel
              value="isClientUser"
              control={
                <Checkbox
                  onChange={(event) => {
                    if (!event.target.checked) {
                      handleBreakTimeReduceHours(0)
                    }
                    setFieldValue('isBreak', event.target.checked)
                  }}
                  defaultValue="false"
                />
              }
              label={
                <>
                  <Typography variant="body1" component="p">
                    Break time hour/s
                  </Typography>

                  <Typography variant="body2" component="span" sx={{opacity: 0.5}}>
                    Note: Adjust the break/lunch time.
                  </Typography>
                </>
              }
              labelPlacement="end"
            />
          </FormControl>

          {values.isBreak && (
            <TextField
              fullWidth
              label="No. of break hour/s"
              type="number"
              InputProps={{inputProps: {min: 0}}}
              onChange={(event) => handleBreakTimeReduceHours(event.currentTarget.value)}
              error={Boolean(touched.breakHr && errors.breakHr)}
              helperText={touched.breakHr && errors.breakHr}
            />
          )}

          <TextField
            fullWidth
            label="Gig Fee per hour"
            type="number"
            onChange={(value) => handleFeeFormat(value.target.value)}
            error={Boolean(touched.fee && errors.fee)}
            helperText={touched.fee && errors.fee}
          />

          <Select native onChange={(e) => setFieldValue('locationRate', e.target.value)} defaultValue={''}>
            <option value="" disabled key="initial">
              Select Gig Location Rate
            </option>

            <option key="ncr-key" value="NCR">
              NCR/Manila Rate
            </option>
            <option key="provincial-key" value="Provincial">
              Provincial Rate
            </option>
          </Select>

          <TextField
            label="Special Instruction"
            key="notes"
            rows={6}
            type="text"
            fullWidth
            multiline
            sx={{mt: 3}}
            {...getFieldProps('notes')}
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

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
            Continue
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
