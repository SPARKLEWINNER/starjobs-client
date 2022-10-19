import React, {useEffect, useState} from 'react'
import {navigate} from 'gatsby'
import PropTypes from 'prop-types'
import {useAuth} from 'contexts/AuthContext'

const PrivateRoute = ({Component, location, ...rest}) => {
  const {currentUser} = useAuth()
  if (!currentUser && location.pathname !== `/app/login`) {
    navigate('/login')
    return null
  }

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  Component: PropTypes.any,
  location: PropTypes.any,
  rest: PropTypes.any
}

export default PrivateRoute
