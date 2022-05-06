import * as Yup from 'yup'
import {useState, useEffect} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
import moment from 'moment'
// material
import {Stack, TextField, MenuItem, Select} from '@mui/material'
import {LoadingButton, MobileDatePicker, LocalizationProvider} from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {useSnackbar} from 'notistack'
import DatePicker from 'react-datepicker'
// api
import category_api from 'src/lib/category'

import PropTypes from 'prop-types'

ParcelForm.propTypes = {
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

export default function ParcelForm({onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const [categories, setCategory] = useState([])
  const [date, setDate] = useState(new Date())
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const current_date = new Date()

  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      setLoading(true)
      const result = await category_api.get_categories()
      if (!result.ok) return setLoading(false)
      let category_data = result.data.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
      if (componentMounted) {
        setLoading(false)
        setCategory(category_data.filter((obj) => obj['status'] !== 1))
      }
    }
    load()
    return () => {
      componentMounted = false
    }
  }, [])

  const Schema = Yup.object().shape({
    category: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Gig category is required'),
    position: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Gig position is required'),
    date: Yup.string(),
    shift: Yup.string().min(2, 'Too Short!').required('Gig Shift is required'),
    hours: Yup.number().required('Gig hours is calculated by From and To selection'),
    fee: Yup.number().min(1, 'Min value 1.').required('Gig fee is required'),
    from: Yup.string().required('Gig Start time is required'),
    to: Yup.string().required('Gig End time is required'),
    notes: Yup.string()
  })

  const formik = useFormik({
    initialValues: {
      category: '',
      date: '',
      fee: '',
      position: '',
      shift: '',
      hours: '',
      from: '',
      to: '', // time
      notes: ''
    },
    enableReinitialize: true,
    validationSchema: Schema,
    onSubmit: () => {
      setLoading(true)
      if (!values.category) {
        enqueueSnackbar('Gig category is not selected', {variant: 'error'})
        return setLoading(false)
      }

      if (!values.date) {
        values.date = moment(new Date()).format('YYYY-MM-DD')
      }

      values.from = moment(values.from, 'HH:mm a').format('HH:mm A')
      values.to = moment(values.to, 'HH:mm a').format('HH:mm A')

      if (!values.position || !values.shift || !values.hours || !values.fee) return setLoading(false)

      let data = {
        category: values.category,
        position: values.position,
        date: values.date,
        shift: values.shift,
        hours: values.hours,
        fee: values.fee,
        time: values.to,
        from: values.from
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
            <Select
              {...getFieldProps('category')}
              labelId="select-category"
              label="*Select Category"
              value={values.category ?? ''}
              error={Boolean(touched.category && errors.category)}
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {categories &&
                categories.map((category) => {
                  if (category.slug !== 'parcels') return ''
                  return (
                    <MenuItem key={category.slug} value={category.slug}>
                      {category.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </Stack>

          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <Select
              {...getFieldProps('position')}
              labelId="select-position"
              label="*Select Parcel Size"
              value={values.position ?? ''}
              error={Boolean(touched.position && errors.position)}
            >
              <MenuItem value="" disabled>
                Select Parcel Size
              </MenuItem>
              <MenuItem value="Small Parcel" key="small-parcel">
                Small size Parcel
              </MenuItem>
              <MenuItem value="Large Parcel" key="large-parcel">
                Large size Parcel
              </MenuItem>
            </Select>
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
                renderInput={(params) => <TextField {...params} margin="normal" />}
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
            label="Shift"
            {...getFieldProps('shift')}
            error={Boolean(touched.shift && errors.shift)}
            helperText={touched.shift && errors.shift}
          />

          <TextField
            label="No. of parcel/s"
            type="number"
            {...getFieldProps('hours')}
            error={Boolean(touched.hours && errors.hours)}
            helperText={touched.hours && errors.hours}
          />

          <TextField
            label="Parcel Fee"
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
