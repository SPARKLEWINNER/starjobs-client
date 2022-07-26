import * as Yup from 'yup'
import {useState, useEffect} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
import moment from 'moment'
import {capitalCase} from 'change-case'
import SelectMultiple from 'react-select'
// material
import {Stack, TextField, Typography, FormControl, FormControlLabel, Checkbox, Select} from '@mui/material'
import {LoadingButton, MobileDatePicker, LocalizationProvider} from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {useSnackbar} from 'notistack'
import DatePicker from 'react-datepicker'
import {calculations} from 'src/utils/gigComputation'

import PropTypes from 'prop-types'

GigForm.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onNext: PropTypes.func,
  onStoreData: PropTypes.func,
  areasAvailable: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default function GigForm({formData, onNext, onStoreData, areasAvailable}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const [areasNotif, setAreasNotif] = useState([])
  const [date, setDate] = useState(new Date())
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [areas, setAreas] = useState([])
  const current_date = new Date()

  useEffect(() => {
    const formatNotificationArea = () => {
      let arrArea = []
      areasAvailable.map((item) => {
        arrArea.push({value: item, label: capitalCase(item)})
      })

      setAreas(arrArea)
    }

    formatNotificationArea()
  }, [areasAvailable])

  const GigSchema = Yup.object().shape({
    position: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Gig position is required'),
    location: Yup.string().required('Location'),
    date: Yup.string(),
    shift: Yup.string().min(2, 'Too Short!').required('Gig Shift is required'),
    contactNumber: Yup.string().min(2, 'Too Short!').required('Contact number is required'),
    hours: Yup.number().required('Gig hours is calculated by From and To selection'),
    fee: Yup.number().min(1, 'Min value 1.').required('Gig fee is required'),
    from: Yup.string().required('Gig Start time is required'),
    to: Yup.string().required('Gig End time is required'),
    breakHr: Yup.number().required('Break hour/s is required'),
    locationRate: Yup.string().required('Gig location rate'),
    notes: Yup.string(),
    notifyArea: Yup.array()
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
      locationRate: formData?.locationRate ?? '',
      notifyArea: formData.notifyArea ?? []
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

      let areas = []
      areasNotif && areasNotif.length > 0 && areasNotif.map((obj) => areas.push(obj.value))

      let data = {
        position: values.position,
        date: values.date,
        shift: values.shift,
        hours: values.hours,
        fee: values.fee,
        time: values.to,
        from: values.from,
        location: values.location,
        contactNumber: values.contactNumber,
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
        },
        areas: areas
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
              id="workType"
              fullWidth
              label="Type of work"
              type="text"
              {...getFieldProps('position')}
              error={Boolean(touched.position && errors.position)}
              helperText={touched.position && errors.position}
            />
          </Stack>

          <TextField
            id="location"
            fullWidth
            label="Location"
            type="text"
            {...getFieldProps('location')}
            error={Boolean(touched.location && errors.location)}
            helperText={touched.location && errors.location}
          />

          <TextField
            id="contactNumber"
            fullWidth
            label="Contact person number"
            type="text"
            {...getFieldProps('contactNumber')}
            error={Boolean(touched.contactNumber && errors.contactNumber)}
            helperText={touched.contactNumber && errors.contactNumber}
          />
          {areas && areas.length > 0 && (
            <SelectMultiple
              id="area"
              onChange={(e) => setAreasNotif(e)}
              value={areasNotif}
              isMulti={true}
              options={areas}
              className="area-select"
            />
          )}

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
              id="startDate"
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
              id="endDate"
              onChange={(date) => handleCalculate(date)}
              minDate={current_date}
              selected={to || ''}
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={
                <TextField
                  id="endDate"
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

          <Select id="shifts" native onChange={(e) => setFieldValue('shift', e.target.value)} defaultValue={''}>
            <option value="" disabled key="initial">
              Select Shift
            </option>

            <option key="Morning-key" value="Morning">
              Morning Shift
            </option>
            <option key="Mid-key" value="Mid">
              Mid Shift
            </option>
            <option key="Night-key" value="Night">
              Night Shift
            </option>
            <option key="Graveyard-key" value="Graveyard">
              Graveyard Shift
            </option>
          </Select>

          <TextField
            id="hours"
            fullWidth
            label="No. of gig hours"
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
            <Select native onChange={(event) => handleBreakTimeReduceHours(event.target.value)} defaultValue={''}>
              <option value="" disabled key="initial">
                No. of break hour/s
              </option>
              <option key="one-hour-key" value="1">
                1 hour
              </option>
              <option key="two-hour-key" value="2">
                2 hours
              </option>
            </Select>
          )}

          <TextField
            id="inputFee"
            fullWidth
            label="Gig Fee per hour"
            type="number"
            onChange={(value) => handleFeeFormat(value.target.value)}
            error={Boolean(touched.fee && errors.fee)}
            helperText={touched.fee && errors.fee}
          />

          <Select id="locRate" native onChange={(e) => setFieldValue('locationRate', e.target.value)} defaultValue={''}>
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
            id="instruction"
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

          <LoadingButton id="continue" fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
            Continue
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
