import {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
// material
import {Box, Stack, Typography, Button, Avatar} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'
// utils
import {fData} from 'src/utils/formatNumber'
// components
import {UploadAvatar} from 'src/components/upload'

Upload.propTypes = {
  stored: PropTypes.object,
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

import onboard_api from 'src/lib/onboard'
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

    onStoreData(upload_image, 'photo')
    onNext()
    setLoading(false)
  }

  return (
    <>
      <Stack spacing={5}>
        <Typography variant="body1" sx={{mb: 0, fontWeight: 'bold', textAlign: 'center'}}>
          Please upload a professional portrait that clearly shows your face
        </Typography>
        <Box id="upload" sx={{textAlign: 'center'}}>
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
        <LoadingButton id="con" fullWidth size="large" onClick={handleContinue} variant="contained" loading={isLoading}>
          Continue
        </LoadingButton>
      </Stack>
    </>
  )
}
