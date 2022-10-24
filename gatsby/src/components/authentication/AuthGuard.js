import Login from 'pages/Login'

import useUser from 'libs/endpoints/users'

const load = async (_url) => {
  if (!_url) return false
  const result = await useUser.get_user(_url)
  if (!result.ok) return false
  return result.data
}
export default function AuthGuard() {
  const {pathname} = window.location
  const params = pathname.split('/').filter(function (e) {
    return e
  })
  const page = new Promise((resolve, reject) => {
    try {
      const result = load(params[0])
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
