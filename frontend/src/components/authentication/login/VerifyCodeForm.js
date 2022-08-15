import {useEffect} from 'react'
import PropTypes from 'prop-types'

import {useSnackbar} from 'notistack'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {Stack, Button} from '@mui/material'
import {Form, FormikProvider, useFormik} from 'formik'
// material
import {LoadingButton} from '@mui/lab'
import ReactCodeInput from 'react-verification-code-input'
import {makeStyles} from '@mui/styles'

import auth_api from 'src/lib/auth'
import storage from 'src/utils/storage'

import SMSForm from './SMSForm'

import {LoadingButtonStyle} from 'src/theme/style'

const useStyles = makeStyles((theme) => ({
  inpt: {
    font: 'inherit',
    letterSpacing: 'inherit',
    boxSizing: 'content-box',
    background: 'none',
    height: '1rem',
    textAlign: 'center',
    display: 'block',
    minWidth: 0,
    width: '100%',
    '& input': {
      color: theme.palette.common.black,
      backgroundColor: theme.palette.starjobs.fieldColor,
      border: '0 !important',
      borderRadius: '0.25rem !important',
      height: '3rem !important',
      '&:nth-child(even)': {
        margin: '0 0.5rem'
      }
    }
  }
}))

VerifyCodeForm.propTypes = {
  account: PropTypes.object
}

export default function VerifyCodeForm({account}) {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const [buttonText, setButtonText] = useState('Resend verification code via email')
  const [smsButtonText, setSMSButtonText] = useState('Re-send verification code via SMS')
  const classes = useStyles()
  const [isLoading, setLoading] = useState(false)
  const [code, setCode] = useState(undefined)
  const [user, setUser] = useState([])
  const [OPEN_SMS, setSMSOpen] = useState(false)
  let mins = 0
  let secs = 30
  let interval
  const [isButtonDisabled, setButtonDisabled] = useState(false)

  const formik = useFormik({
    initialValues: {
      code: ''
    },
    onSubmit: async () => {
      setLoading(true)
      if (!code) return setLoading(false)

      let form_data = {
        email: account.email,
        code: code
      }

      const result = await auth_api.post_verify(form_data)
      if (!result.ok) {
        enqueueSnackbar('Invalid verification code', {variant: 'error'})
        return setLoading(false)
      }

      let {data} = result
      data.token = account.token

      await storage.storeUser({...data, verificationCode: null, isVerified: true})

      setLoading(false)
      enqueueSnackbar('Verify success', {variant: 'success'})
      return navigate(`/setup/welcome`, {replace: true})
    }
  })

  const {handleSubmit} = formik

  const pad = (num, size) => {
    var s = num + ''
    while (s.length < size) s = '0' + s
    return s
  }

  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) {
        navigate('/login', {replace: true})
      }

      const user = JSON.parse(local_user)
      if (!user) {
        return setLoading(false)
      }

      if (componentMounted) {
        setUser(user)
        setLoading(false)
      }
    }

    load()
    return () => {
      componentMounted = false
    }
    // eslint-disable-next-line
  }, [])

  const handleResendVerification = async (type) => {
    if (isButtonDisabled) return

    interval = setInterval(function () {
      if (mins >= 0 && secs >= 0) {
        if (type && type === 'sms') {
          setSMSButtonText('Resend Code via SMS in ' + pad(mins, 2) + ':' + pad(secs, 2))
        } else {
          setButtonText('Resend Code in ' + pad(mins, 2) + ':' + pad(secs, 2))
        }
        setButtonDisabled(true)
        if (secs > 0) {
          secs--
        } else {
          secs = 59
          mins--
        }
        if (mins < 0) {
          clearInterval(interval)
          setButtonText('Resend Verification Code via email')
          setSMSButtonText('Resend Verification Code via SMS')
          setButtonDisabled(false)
        }
      }
    }, 1000)

    let result
    if (type && type === 'sms') {
      result = await auth_api.post_resend_verification({email: user.email, phone: user.phone}, 'sms')
    } else {
      result = await auth_api.post_resend_verification({email: user.email}, 'email')
    }

    if (!result.ok) return setLoading(false)
    enqueueSnackbar(result.data.msg, {variant: 'success'})
    setLoading(false)
  }

  const handleOpenSMSDialog = () => {
    setSMSOpen(true)
  }

  const handleCloseSMSDialog = () => {
    setSMSOpen(false)
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} sx={{mt: 2}} justifyContent="center" className={'phone-form-container'}>
          <ReactCodeInput onComplete={(e) => setCode(e)} autoFocus={true} className={classes.inpt} />
        </Stack>

        <br />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isLoading}
          sx={{mt: 4, ...LoadingButtonStyle}}
        >
          Verify
        </LoadingButton>

        <Stack sx={{my: 2}}>
          <Button
            variant="body2"
            sx={{color: 'starjobs.main', fontSize: '0.75rem', fontWeight: 400}}
            onClick={handleResendVerification}
          >
            {buttonText}
          </Button>

          {account && account.phone && (
            <Button
              variant="body2"
              sx={{color: 'starjobs.main', fontSize: '0.75rem', fontWeight: 400}}
              onClick={() => handleResendVerification('sms')}
            >
              {smsButtonText}
            </Button>
          )}
          {account && !account.phone && (
            <Button
              variant="body2"
              sx={{color: 'starjobs.main', fontSize: '0.75rem', fontWeight: 400}}
              onClick={handleOpenSMSDialog}
            >
              {smsButtonText}
            </Button>
          )}
        </Stack>
        <SMSForm account={user} open={OPEN_SMS} onClose={handleCloseSMSDialog} />
      </Form>
    </FormikProvider>
  )
}
