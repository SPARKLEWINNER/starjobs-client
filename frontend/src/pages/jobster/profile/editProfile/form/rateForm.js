import * as Yup from 'yup'
import PropTypes from 'react'
import {useState} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
// material
import {Stack, TextField, Box, Typography, Select} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'
const E_WALLETS = [{label: 'GCash', image: '', value: 'gcash'}]

const RATE_TYPE = [
  {label: 'Hourly', value: 'Hourly'},
  {label: 'Daily', value: 'Daily'},
  {label: 'Monthly', value: 'Monthly'}
]

PersonalForm.propTypes = {
  stored: PropTypes.object,
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

export default function PersonalForm({stored, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const store = stored.rate ? stored.rate : undefined

  const Schema = Yup.object().shape({
    rateAmount: Yup.number().required('Rate amount is required'),
    rateType: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Rate billing is required'),
    accountType: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Account type is required'),
    accountName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Account Name is required'),
    accountNumber: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Account number')
  })

  const formik = useFormik({
    initialValues: {
      rateAmount: store.rateAmount || '',
      rateType: store.rateType || '',
      accountType: store.accountType || '',
      accountName: store.accountName || '',
      accountNumber: store.accountNumber || ''
    },
    enableReinitialize: true,
    validationSchema: Schema,
    onSubmit: async (values) => {
      setLoading(true)
      if (
        !values.rateAmount ||
        !values.rateType ||
        !values.accountType ||
        !values.accountName ||
        !values.accountNumber
      ) {
        enqueueSnackbar('Kindly put N/A for empty fields', {variant: 'warning'})
        return setLoading(false)
      }

      let data = {
        rateAmount: values.rateAmount,
        rateType: values.rateType,
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
          <Box>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <TextField
                id="rateAmount"
                autoFocus
                type="number"
                fullWidth
                label="Proposed Gig rate (₱ - Peso)"
                {...getFieldProps('rateAmount')}
                error={Boolean(touched.rateAmount && errors.rateAmount)}
                helperText={touched.rateAmount && errors.rateAmount}
              />

              <Select id="rateTypeSelect" native {...getFieldProps('rateType')}>
                <option selected value="" key="initialRateType" disabled>
                  Select Rate type
                </option>
                {RATE_TYPE.map((v, k) => {
                  return (
                    <option key={k} value={v.value}>
                      {v.label}
                    </option>
                  )
                })}
              </Select>
            </Stack>
          </Box>

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
              {values.accountType ? (
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
              ) : (
                ''
              )}
            </Stack>
          </Box>

          <LoadingButton
            id="continueRateForm"
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
