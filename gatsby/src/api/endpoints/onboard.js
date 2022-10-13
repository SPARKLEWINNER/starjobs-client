import request from 'utils/header'
import storage from 'utils/storage'

const base_url = process.env.REACT_APP_API_URL

const request_upload_url = async (_file) => {
  if (!_file) return false

  const to_base64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  let blob = await to_base64(_file)
  const token = await storage.getToken()
  const get_url = await fetch(`${base_url}/upload`, {
    headers: {
      'Content-Type': _file.type,
      Authorization: `Bearer ${token}`
    }
  }).then((r) => {
    return r.json()
  })

  if (!get_url) return false

  const {photoFilename, uploadURL} = get_url
  let binary = atob(blob.split(',')[1])

  let array = []
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }

  let blobData = new Blob([new Uint8Array(array)], {
    type: _file.type
  })

  const result = await fetch(uploadURL, {
    method: 'PUT',
    body: blobData
  }).then((response) => {
    return response
  })

  if (result.status === 200) {
    return photoFilename
  } else {
    return false
  }
}

const post_freelancer_onboard = (form_data, id) => request.post(`/accounts/${id}`, form_data)

const patch_freelancer_profile = (form_data, id) => request.patch(`/accounts/${id}`, form_data)

const post_client_onboard = (form_data, id) => request.post(`/clients/${id}`, form_data)

const patch_client_profile = (form_data, id) => request.patch(`/clients/${id}`, form_data)

const patch_client_documents = (form_data, id) => request.patch(`/clients/documents/${id}`, form_data)

const _expObject = {
  request_upload_url,
  post_freelancer_onboard,
  post_client_onboard,
  patch_client_profile,
  patch_freelancer_profile,
  patch_client_documents
}

export default _expObject
