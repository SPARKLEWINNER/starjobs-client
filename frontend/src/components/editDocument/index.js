import {useState, useCallback, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import {Box, Stack, Typography, Link} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack5'
// components
import {UploadMultiFile} from 'src/components/upload'

import {useAuth} from 'src/contexts/AuthContext'

import users_api from 'src/lib/users'
import onboard_api from 'src/lib/onboard'

const image_bucket = process.env.REACT_APP_IMAGE_URL

EditDocument.propTypes = {
  onNext: PropTypes.func,
  onStoreData: PropTypes.object
}

export default function EditDocument({onNext, onStoreData}) {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const [files, setFiles] = useState([])
  const [isLoading, setLoading] = useState(false)
  const {currentUser} = useAuth()

  const [EXISTING_DOCUMENTS, setDocuments] = useState([])

  useEffect(() => {
    const load = async () => {
      const request = await users_api.get_user_profile_client(currentUser._id)

      if (!request.ok) {
        return
      }

      let {data} = request

      let details = data['details']

      let documents = details[0].documents.split('=>')
      setDocuments(documents)
    }
    load()
  }, [currentUser])

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

    if (!files || files.length <= 0) {
      setLoading(false)
      return enqueueSnackbar('No Documents selected', {variant: 'warning'})
    }

    await Promise.all(
      files.map(async (value, k) => {
        const upload = await onboard_api.request_upload_url(value.file)
        if (!upload) console.log(upload)
        documents.push(upload)
      })
    )

    if (documents.length !== files.length) {
      return enqueueSnackbar('Something went wrong in uploading your documents.', {variant: 'warning'})
    }

    let format_document = documents.join('=>')
    handleSubmit(format_document, 'documents')
    setLoading(false)
  }

  const handleSubmit = async (format_document) => {
    setLoading(true)

    const form_data = {
      documents: format_document
    }

    const result = await onboard_api.patch_client_documents(form_data, currentUser._id)
    if (!result.ok) {
      enqueueSnackbar('Unable to process your edit documents', {variant: 'error'})
      return setLoading(false)
    }

    let {data} = result
    enqueueSnackbar(data.msg, {variant: 'success'})
    navigate('/client/app', {replace: true})
    setLoading(false)
  }

  return (
    <>
      <Stack spacing={5} sx={{mb: 20}}>
        <Typography variant="h4" sx={{mb: 0, fontWeight: 'bold', textAlign: 'center', mt: 5}} component="h2">
          Edit Documents
        </Typography>
        <Typography variant="h6" sx={{mb: 0, fontWeight: 'bold', textAlign: 'left'}}>
          Existing documents
        </Typography>
        <Box sx={{width: '25%', display: 'block', mt: '0 !important'}}>
          {EXISTING_DOCUMENTS &&
            EXISTING_DOCUMENTS.map((value, index) => (
              <Link
                key={index}
                href={`${image_bucket}/${value}`}
                rel="noreferrer"
                target="_blank"
                sx={{display: 'block', mt: '16px !important'}}
              >
                {value}
              </Link>
            ))}
        </Box>
        <Typography variant="h6" sx={{mb: 0, fontWeight: 'bold', textAlign: 'left', mt: 3}}>
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
          Submit for Review
        </LoadingButton>
      </Stack>
    </>
  )
}
