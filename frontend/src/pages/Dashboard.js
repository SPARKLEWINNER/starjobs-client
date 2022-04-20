import {useEffect} from 'react'
import {useNavigate} from 'react-router'

import {useAuth} from 'utils/context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const {currentUser} = useAuth()

  useEffect(
    () => {
      const signedUser = () => {
        if (currentUser.accountType === 0) {
          navigate('/freelancer/app')
        }

        if (currentUser.accountType === 1) {
          navigate('/client/app')
        }
      }

      if (!currentUser.isVerified) return navigate(`/verification`, {replace: true})

      signedUser()
    },

    // eslint-disable-next-line
    [],
  )

  return <></>
}
