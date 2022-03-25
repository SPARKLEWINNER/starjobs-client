import {useEffect} from 'react'
import {useNavigate} from 'react-router'

import {useAuth} from 'utils/context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const {currentUser} = useAuth()

  const signedUser = () => {
    if (currentUser.accountType === 0) {
      navigate('/freelancer/message')
    }

    if (currentUser.accountType === 1) {
      navigate('/client/gig/create')
    }
  }

  useEffect(
    () => {
      if (!currentUser.isVerified) return navigate(`/verification`, {replace: true})
      signedUser()
    },

    // eslint-disable-next-line
    [],
  )

  return <></>
}
