import * as Yup from 'yup'
import {useState} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
// material
import {Stack, TextField, Box, Typography, Select} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'
import {fCamelCase} from 'utils/formatCase'

import PropTypes from 'prop-types'

RateForm.propTypes = {
  user: PropTypes.object,
  stored: PropTypes.object,
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

const E_WALLETS = [
  {label: 'None', image: '', value: 'none'},
  {label: 'GCash', image: '', value: 'gcash'}
]

export default function RateForm({stored, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)

  let store = stored.rate ? stored.rate : undefined

  const Schema = Yup.object().shape({
    accountType: Yup.string(),
    accountName: Yup.string(),
    accountNumber: Yup.string()
  })

  const formik = useFormik({
    initialValues: {
      accountType: store.accountType || '',
      accountName: store.accountName || '',
      accountNumber: store.accountNumber || ''
    },
    enableReinitialize: true,
    validationSchema: Schema,
    onSubmit: async (values) => {
      setLoading(true)
      let isComplete = true

      if (!values.accountType) {
        enqueueSnackbar('Select Payment Type', {variant: 'warning'})
        return setLoading(false)
      }

      if (values.accountType === 'gcash') {
        if (!values.accountName || !values.accountNumber) {
          enqueueSnackbar('Kindly fill out necessary fields', {variant: 'warning'})
          return setLoading(false)
        }
      }

      Object.keys(values).forEach((item) => {
        let field = values[item]

        if (item === 'accountName' || item === 'accountNumber') return ''
        if (!field) {
          isComplete = false
          enqueueSnackbar(`Required field ${fCamelCase(item)}`, {variant: 'warning'})
        }
      })

      if (!isComplete) {
        return
      }

      let data = {
        accountType: values.accountType,
        accountName: values.accountName,
        accountNumber: values.accountNumber
      }
      onStoreData(data, 'rate')
      onNext()
    }
  })

  const {errors, values, touched, handleSubmit, getFieldProps} = formik
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="body1" sx={{mt: 3, fontWeight: 'bold'}}>
          Rate & Payment
        </Typography>
        <Typography variant="body2" sx={{mb: 3}}>
          plus SSS, PhilHealth, Pag-Ibig Mutual Fund
        </Typography>
        <Stack spacing={3}>
          <Typography variant="body1" sx={{mt: 3, mb: 0, fontWeight: 'bold'}}>
            How would you like to get paid?
          </Typography>
          <Typography variant="body2" sx={{mb: 3, marginTop: '0 !important'}}>
            The usual processing of Gig service fees takes not more than 12 hours after every successful Gig engagement
          </Typography>
          <Box>
            <Stack sx={{mt: 2}} direction={{xs: 'column', sm: 'column'}} spacing={2}>
              <Typography variant="body1" sx={{mb: 0, fontWeight: 'bold'}}>
                E-Wallets
              </Typography>
              <Typography variant="body2" sx={{mb: 3, marginTop: '0 !important'}}>
                plus SSS, PhilHealth, Pag-Ibig Mutual Fund
              </Typography>
              <Select id="walletSelect" native {...getFieldProps('accountType')} value={values.accountType}>
                <option selected value="" key="initialAccountType" disabled>
                  Select mode of wallet
                </option>
                {E_WALLETS.map((v, k) => {
                  return (
                    <option key={k} value={v.value}>
                      {v.label}
                    </option>
                  )
                })}
              </Select>
              {values.accountType === 'gcash' && (
                <Stack sx={{mt: 3}} direction={{xs: 'column', sm: 'column'}} spacing={2}>
                  <TextField
                    id="accountName"
                    fullWidth
                    label="Account Name"
                    {...getFieldProps('accountName')}
                    error={Boolean(touched.accountName && errors.accountName)}
                    helperText={touched.accountName && errors.accountName}
                  />
                  <TextField
                    id="accountNumber"
                    fullWidth
                    label="Account Number"
                    {...getFieldProps('accountNumber')}
                    error={Boolean(touched.accountNumber && errors.accountNumber)}
                    helperText={touched.accountNumber && errors.accountNumber}
                  />
                </Stack>
              )}
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
