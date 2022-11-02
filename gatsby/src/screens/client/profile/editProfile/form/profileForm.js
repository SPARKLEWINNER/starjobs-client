import React, {useState, useCallback} from 'react'
// material
import {Box, Stack, Typography, Avatar, Button} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'
// utils
import {fData} from 'utils/formatNumber'
// components
import {UploadAvatar} from 'components/upload'

import onboard_api from 'libs/endpoints/onboard'

import PropTypes from 'prop-types'

Upload.propTypes = {
  user: PropTypes.object,
  stored: PropTypes.object,
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

export default function Upload({stored, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isUpload, setUpload] = useState(false)

  const handleDropAvatar = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]

    if (file) {
      setAvatarUrl({
        ...file,
        preview: URL.createObjectURL(file),
        file: file
      })
    }
  }, [])

  const handleContinue = async () => {
    setLoading(true)
    let documents = []
    if (!avatarUrl.file) {
      setLoading(false)
      onStoreData(stored.photo, 'photo')
      onNext()
      return
    }

    const upload_image = await onboard_api.request_upload_url(avatarUrl.file)
    if (!upload_image) {
      setLoading(false)
      return enqueueSnackbar('Something went wrong in uploading your image.', {variant: 'warning'})
    }

    let format_document = documents.join('=>')
    onStoreData(format_document, 'documents')
    onStoreData(upload_image, 'photo')
    onNext()
    setLoading(false)
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="body1" sx={{mt: 0, fontWeight: 'bold'}}>
          Company Logo
        </Typography>
        <Box id="uploadProfileContainer" sx={{textAlign: 'center', marginTop: '1rem !important', mb: 10}}>
          {!stored.photo || isUpload ? (
            <UploadAvatar
              accept="image/*"
              file={avatarUrl}
              onDrop={handleDropAvatar}
              caption={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          ) : (
            <Avatar src={stored.photo} sx={{m: '1rem auto', width: 120, height: 120}} />
          )}
        </Box>
        {!isUpload ? (
          <Button onClick={() => setUpload(true)}>Upload Avatar</Button>
        ) : (
          <Button onClick={() => setUpload(false)}>Cancel</Button>
        )}
        <LoadingButton fullWidth size="large" onClick={handleContinue} variant="contained" loading={isLoading}>
          Continue
        </LoadingButton>
      </Stack>
    </>
  )
}
