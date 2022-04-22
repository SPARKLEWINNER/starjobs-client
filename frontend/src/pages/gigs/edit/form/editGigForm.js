import * as Yup from 'yup'
import {useState, useEffect} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
import moment from 'moment'

// material
import {Stack, TextField, Select, Typography, Box} from '@mui/material'
import {LoadingButton, MobileDatePicker, LocalizationProvider} from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {useSnackbar} from 'notistack5'
import DatePicker from 'react-datepicker'

// api
import category_api from 'src/lib/category'

const EditGigForm = ({data, onNext, onStoreData}) => {
  const {enqueueSnackbar} = useSnackbar()

  const [isLoading, setLoading] = useState(false)
  const [category, setCategory] = useState([])
  const [date, setDate] = useState(new Date())
  const [from, setFrom] = useState(new Date(data.from || ''))
  const [to, setTo] = useState(new Date(data.time) || '') // eslint-disable-next-line
  const [GIG_DETAILS, setGig] = useState(data)
  const current_date = new Date()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = await category_api.get_categories()
      if (!result.ok) return setLoading(false)
      let category_data = result.data.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))

      setLoading(false)
      setCategory(category_data.filter((obj) => obj['status'] !== 1))
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const GigSchema = Yup.object().shape({
    category: Yup.string(),
    position: Yup.string(),
    date: Yup.string(),
    from: Yup.string(),
    to: Yup.string(),
    hours: Yup.number(),
    shift: Yup.string(),
    fee: Yup.string(),
    notes: Yup.string()
  })

  const formik = useFormik({
    initialValues: {
      category: data.category || '',
      date: data.date || '',
      fee: data.fee || '',
      position: data.position || '',
      shift: data.shift || '',
      hours: data.hours || '    ',
      from: new Date(data.from) || '',
      to: new Date(data.time) || '', // time
      notes: data.notes || ''
    },
    enableReinitialize: true,
    validationSchema: GigSchema,
    onSubmit: () => {
      setLoading(true)
      if (!values.category) {
        enqueueSnackbar('Gig category is not selected', {variant: 'error'})
        return setLoading(false)
      }

      if (!values.date) {
        values.date = moment(date).format('YYYY-MM-DD')
      }

      values.from = moment(values.from)
      values.to = moment(values.to)

      if (!values.position || !values.shift || !values.hours || !values.fee) return setLoading(false)

      let data = {
        category: values.category,
        position: values.position,
        date: values.date,
        shift: values.shift,
        hours: values.hours,
        fee: values.fee,
        time: values.to,
        from: values.from,
        notes: values.notes
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
    setFieldValue('time', to_hours)
    setFieldValue('from', from_hours)

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
    let duration = moment.duration(to_hours.diff(from_hours)).asHours()
    if (duration < 0) return

    setFieldValue('hours', duration.toFixed(2))
  }

  const handleFeeFormat = (value) => {
    let newFee = parseFloat(value).toFixed(2)
    setGig((prevState) => ({...prevState, fee: newFee}))
    setFieldValue('fee', newFee)
  }

  const handleSelectedCategory = (value) => {
    setFieldValue('category', value)
  }
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{mb: 0, fontWeight: 'bold'}} color="primary">
              Gig id - {GIG_DETAILS && GIG_DETAILS._id}
            </Typography>
            <Typography variant="h6" sx={{mb: 0, fontWeight: 'bold'}} color="default">
              Posted by - {GIG_DETAILS && GIG_DETAILS.user[0].companyName}
            </Typography>
          </Box>

          <Box sx={{width: '100%'}}>
            <Stack direction={{xs: 'column', sm: 'column', md: 'column'}} sx={{alignItems: 'flex-start'}} spacing={2}>
              <Box sx={{width: '100%'}}>
                <Select
                  native
                  onChange={(e) => handleSelectedCategory(e.target.value)}
                  defaultValue={GIG_DETAILS.category || ''}
                  sx={{width: '100%'}}
                >
                  <option value="" disabled key="initial">
                    Select Gig Category
                  </option>
                  {category &&
                    category.map((v) => {
                      if (v.slug !== 'parcels') {
                        return (
                          <option key={v.slug} value={v.slug}>
                            {v.name}
                          </option>
                        )
                      } else {
                        return ''
                      }
                    })}
                </Select>
              </Box>
              <Box sx={{width: '100%'}}>
                <TextField
                  fullWidth
                  label="Position"
                  {...getFieldProps('position')}
                  error={Boolean(touched.position && errors.position)}
                  helperText={touched.position && errors.position}
                />
              </Box>
              <Box sx={{width: '100%'}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    orientation="portrait"
                    label="Date"
                    value={date}
                    // @ts-ignore: Unreachable code error
                    sx={{mt: '0 !important'}}
                    minDate={current_date}
                    onChange={(newValue) => {
                      setDate(newValue)
                    }}
                    renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                  />
                </LocalizationProvider>
              </Box>
            </Stack>
          </Box>

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

          <Stack sx={{mt: 2}} direction={{xs: 'column', sm: 'column', md: 'row'}} spacing={2}>
            <TextField
              fullWidth
              label="No. of hours"
              type="number"
              {...getFieldProps('hours')}
              InputLabelProps={{
                shrink: true
              }}
              error={Boolean(touched.hours && errors.hours)}
              helperText={touched.hours && errors.hours}
            />
            <Box sx={{width: '100%', display: 'block !important'}}>
              <TextField
                fullWidth
                label="Gig Fee per hour"
                type="number"
                {...getFieldProps('fee')}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(value) => handleFeeFormat(value.target.value)}
                error={Boolean(touched.fee && errors.fee)}
                helperText={touched.fee && errors.fee}
              />
              <Typography variant="caption" sx={{mt: '6px !important', opacity: 0.5}}>
                Note: Adjust the break/lunch time.
              </Typography>
            </Box>
          </Stack>
          <Stack direction={{xs: 'column', sm: 'column'}}>
            <TextField
              label="Special Instruction (optional)"
              key="notes"
              rows={6}
              fullWidth
              multiline
              sx={{mt: 3}}
              InputLabelProps={{
                shrink: true
              }}
              {...getFieldProps('notes')}
            />
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
            sx={{width: '50%', marginLeft: 'auto !important'}}
          >
            Save new changes
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}

export default EditGigForm
