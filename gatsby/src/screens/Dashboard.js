import React, {useEffect} from 'react'
import {navigate} from '@reach/router'

import {useAuth} from 'contexts/AuthContext'

export default function Dashboard() {
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
    []
  )

  return <></>
}
