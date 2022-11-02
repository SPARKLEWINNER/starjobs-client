import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import {useLocation} from '@reach/router'
import React, {forwardRef} from 'react'
import {Box} from '@mui/material'
import DashboardLayout from 'layouts/dashboard'

const unauthenticatedPages = ['login', 'sign-up', 'forgot-password', 'reset-password']
const Page = forwardRef(({children, title = '', ...other}, ref) => {
  const location = useLocation()
  return (
    <Box ref={ref} {...other}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {location.pathname.split('/').filter(function (e) {
        return e
      }).length > 1 &&
      !unauthenticatedPages.includes(
        location.pathname.split('/').filter(function (e) {
          return e
        })
      ) ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        <>{children}</>
      )}
    </Box>
  )
})

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
}

export default Page
