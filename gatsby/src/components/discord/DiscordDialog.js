import React, {useEffect, useState} from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material'
import {Formik, useField} from 'formik'
import * as yup from 'yup'

import {useSnackbar} from 'notistack'
import PropTypes from 'prop-types'
import storage from 'utils/storage'
import config from 'utils/config'

const {url, key} = config.discord

const validationSchema = yup.object({
  name: yup.string().max(50, 'Too long').required(),
  email: yup.string().email('Invalid email').required(),
  phone: yup.string().max(20, 'Too long').required(),
  issue: yup.string().required()
})

const CustomTextField = ({type, label, placeholder, InputProps, ...props}) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ''
  return (
    <TextField
      label={label}
      type={type}
      variant="standard"
      fullWidth
      margin="dense"
      required
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
      InputProps={InputProps}
    />
  )
}

const CustomMultiLineTextField = ({type, label, placeholder, InputProps, ...props}) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ''
  return (
    <TextField
      label={label}
      type={type}
      variant="standard"
      fullWidth
      margin="dense"
      multiline
      rows={4}
      required
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
      InputProps={InputProps}
    />
  )
}

const DiscordDialog = ({open, handleClose}) => {
  const {enqueueSnackbar} = useSnackbar()
  const [user, setUser] = useState([])

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return enqueueSnackbar('Unable to proceed, Kindly Re-log again', {variant: 'warning'})
      const user = JSON.parse(local_user)
      setUser(user)
    }

    load()
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Need help?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please tell us what happen and we will get back to you as soon as possible
          </DialogContentText>
          <Formik
            initialValues={{
              name: `${user.name}`,
              email: `${user.email}`,
              phone: ``
            }}
            validationSchema={validationSchema}
            onSubmit={async (data, {setSubmitting}) => {
              setSubmitting(true)

              fetch(`${url}/${key}`, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: `Starjobs Help`,
                  content: `Starjobs Help\n**from:**\n ${data.name}\n**Email:**\n ${data.email}\n**Phone:**\n ${data.phone} \n**Issue:**\n ${data.issue}`
                })
              })

              // const result = await discordHook.info(
              //   `Starjobs Help `,
              //   `Starjobs Help\n**from:**\n ${data.name}\n**Email:**\n ${data.email}\n**Phone:**\n ${data.phone} \n**Issue:**\n ${data.issue}`
              // )

              // if (!result.ok) return enqueueSnackbar('Unable to submit your request for assitance', {variant: 'error'})

              setSubmitting(false)
              handleClose()
              return enqueueSnackbar('Thank you for your patience, we will contact you ASAP.', {variant: 'success'})
            }}
          >
            {({handleChange, handleSubmit, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <CustomTextField
                  id="name"
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                />
                <CustomTextField
                  id="phone"
                  autoFocus
                  margin="dense"
                  name="phone"
                  label="Phone"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                />
                <CustomTextField
                  autoFocus
                  margin="dense"
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                />
                <CustomMultiLineTextField
                  id="inquiry"
                  autoFocus
                  margin="dense"
                  name="issue"
                  label="Inquiry/Issue"
                  fullWidth
                  multiline
                  rows={4}
                  variant="standard"
                  onChange={handleChange}
                />
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button id="submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress /> : 'Send'}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DiscordDialog

CustomTextField.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  InputProps: PropTypes.object
}

CustomMultiLineTextField.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  InputProps: PropTypes.object
}

DiscordDialog.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  handleClose: PropTypes.func
}
