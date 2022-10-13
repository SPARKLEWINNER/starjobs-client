import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import React, {forwardRef} from 'react'
import {Box} from '@mui/material'
import DashboardLayout from 'layouts/dashboard'

const Page = forwardRef(({children, title = '', ...other}, ref) => (
  <Box ref={ref} {...other}>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <DashboardLayout>{children}</DashboardLayout>
  </Box>
))

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
}

export default Page
