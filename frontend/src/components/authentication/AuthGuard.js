import {useLocation} from 'react-router-dom'

import Login from './../../pages/Login'

import useUser from 'api/users'

const load = async (_url) => {
  if (!_url) return false
  const result = await useUser.get_user(_url)
  if (!result.ok) return false
  return result.data
}
export default function AuthGuard() {
  const {pathname} = useLocation()
  const params = pathname.split('/').filter(function (e) {
    return e
  })
  const page = new Promise(async (resolve, reject) => {
    try {
      const result = await load(params[0])
      if (!result) reject(result)

      resolve(result)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })

  if (page) {
    if (!page) return

    return
  } else {
    return <Login />
  }
}
