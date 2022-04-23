import {useState, useCallback} from 'react'
// material
import {Box, Stack, Typography} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'
// utils
import {fData} from 'src/utils/formatNumber'
// components
import {UploadAvatar, UploadMultiFile} from 'src/components/upload'
import PropTypes from 'prop-types'

Upload.propTypes = {
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

import onboard_api from 'src/lib/onboard'
export default function Upload({onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [avatarUrl, setAvatarUrl] = useState('')
  const [files, setFiles] = useState([])
  const [isLoading, setLoading] = useState(false)

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

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            file: file
          })
        )
      )
    },
    [setFiles]
  )

  const handleRemoveAll = () => {
    setFiles([])
  }

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file)
    setFiles(filteredItems)
  }

  const handleContinue = async () => {
    setLoading(true)
    let documents = []
    if (!avatarUrl.file) {
      setLoading(false)
      return enqueueSnackbar('No Profile image selected', {variant: 'warning'})
    }

    if (!files || files.length <= 0) {
      setLoading(false)
      return enqueueSnackbar('No Documents selected', {variant: 'warning'})
    }

    const upload_image = await onboard_api.request_upload_url(avatarUrl.file)
    if (!upload_image) {
      setLoading(false)
      return enqueueSnackbar('Something went wrong in uploading your image.', {variant: 'warning'})
    }

    await Promise.all(
      files.map(async (value) => {
        const upload = await onboard_api.request_upload_url(value.file)
        if (!upload) console.log(upload)
        documents.push(upload)
      })
    )

    if (documents.length !== files.length) {
      return enqueueSnackbar('Something went wrong in uploading your documents.', {variant: 'warning'})
    }

    let format_document = documents.join('=>')
    onStoreData(format_document, 'documents')
    onStoreData(upload_image, 'photo')
    onNext()
    setLoading(false)
  }

  return (
    <>
      <Stack spacing={5}>
        <Typography variant="body1" sx={{mt: 3, fontWeight: 'bold'}}>
          Company Logo & Permits
        </Typography>
        <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold', textAlign: 'center'}}>
          Please upload a professional portrait that clearly shows your face
        </Typography>
        <Box sx={{textAlign: 'center', marginTop: '1rem !important', mb: 10}}>
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
        </Box>

        <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold', textAlign: 'center', mt: 10}}>
          Please upload a document to indicate your business
        </Typography>
        <Box sx={{textAlign: 'center', marginTop: '1rem !important'}}>
          <UploadMultiFile
            files={files}
            onDrop={handleDropMultiFile}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
          />
        </Box>
        <LoadingButton fullWidth size="large" onClick={handleContinue} variant="contained" loading={isLoading}>
          Continue
        </LoadingButton>
      </Stack>
    </>
  )
}
