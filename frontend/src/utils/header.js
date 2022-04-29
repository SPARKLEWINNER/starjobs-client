import {create} from 'apisauce'
import authStorage from 'src/utils/storage'
// import cache from './cache'

// const base_url = 'https://sparkle-time-in.herokuapp.com/api'
const base_url = process.env.REACT_APP_API_URL
const apiClient = create({
  baseURL: base_url
})

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken()
  // const socketId = sessionStorage.getItem('socket_id')
  if (!authToken) return
  request.headers['Authorization'] = `Bearer ${authToken}`
  // request.headers['X-Socket-ID'] = socketId
})

// const get = apiClient.get
// apiClient.get = async (url, params, axiosConfig) => {
//   const response = await get(url, params, axiosConfig)

//   if (response.ok) {
//     cache.store(url, response.data)
//     return response
//   }

//   const data = await cache.get(url)
//   return data ? {ok: true, ...data} : response
// }

export default apiClient
