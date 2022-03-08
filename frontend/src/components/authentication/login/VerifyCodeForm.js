import {useEffect} from 'react'
import {useSnackbar} from 'notistack5'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {Stack, Button, Divider, Typography} from '@material-ui/core'
import {Form, FormikProvider, useFormik} from 'formik'
// material
import {LoadingButton} from '@material-ui/lab'
import ReactCodeInput from 'react-verification-code-input'
import {makeStyles} from '@material-ui/styles'

import auth_api from 'utils/api/auth'
import storage from 'utils/storage'

import SMSForm from './SMSForm'

import {DividerWhite, LoadingButtonStyle} from 'theme/style'
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  inpt: {
    font: 'inherit',
    letterSpacing: 'inherit',
    boxSizing: 'content-box',
    background: 'none',
    height: '1.4375em',
    margin: theme.spacing(1),
    textAlign: 'center',
    display: 'block',
    minWidth: 0,
    width: '100%',
    padding: '16.5px 14px',
    '& input': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.starjobs.main,
      borderBottom: '2px solid #000 !important',
      borderTop: '0 !important',
      borderLeft: '0 !important',
      borderRight: '0 !important',
      borderRadius: '0 !important',
      '&:nth-child(even)': {
        margin: '0 0.5rem',
      },
    },
  },
}))

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
      code: '',
    },
    onSubmit: async () => {
      setLoading(true)
      if (!code) return setLoading(false)

      const local_user = await storage.getUser()
      if (!local_user) return

      const user = JSON.parse(local_user)

      if (!user) {
        return setLoading(false)
      }

      let form_data = {
        email: user.email,
        code: code,
      }

      const result = await auth_api.post_verify(form_data)
      if (!result.ok) {
        enqueueSnackbar('Invalid verification code', {variant: 'error'})
        return setLoading(false)
      }

      let {data} = result
      data.token = user.token

      await storage.storeUser(data)
      await storage.storeToken(data.token)

      setLoading(false)
      enqueueSnackbar('Verify success', {variant: 'success'})
      return navigate(`/setup/welcome`, {replace: true})
    },
  })

  const {handleSubmit} = formik

  const pad = (num, size) => {
    var s = num + ''
    while (s.length < size) s = '0' + s
    return s
  }

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) {
        navigate('/login', {replace: true})
      }

      const user = JSON.parse(local_user)
      if (!user) {
        return setLoading(false)
      }

      setUser(user)
      setLoading(false)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Stack direction="row" spacing={2} justifyContent="center" className={'phone-form-container'}>
          <ReactCodeInput onComplete={(e) => setCode(e)} autoFocus={true} className={classes.inpt} />
        </Stack>

        <br />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isLoading}
          sx={{mt: 3, ...LoadingButtonStyle}}
        >
          Verify
        </LoadingButton>

        <Stack sx={{my: 5}}>
          <Button variant="body2" sx={{color: 'common.white'}} onClick={handleResendVerification}>
            {buttonText}
          </Button>

          <Divider sx={DividerWhite}>
            <Typography variant="body2" sx={{color: 'common.white'}}>
              OR
            </Typography>
          </Divider>
          {account && account.phone && (
            <Button variant="body2" sx={{color: 'common.white'}} onClick={() => handleResendVerification('sms')}>
              {smsButtonText}
            </Button>
          )}
          {account && !account.phone && (
            <Button variant="body2" sx={{color: 'common.white'}} onClick={handleOpenSMSDialog}>
              {smsButtonText}
            </Button>
          )}
        </Stack>
        <SMSForm account={user} open={OPEN_SMS} onClose={handleCloseSMSDialog} />
      </Form>
    </FormikProvider>
  )
}
