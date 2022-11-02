import React from 'react'
import PropTypes from 'prop-types'
// material
import {Box} from '@mui/material'
import BrandLogo from 'assets/static/favicon/starjobs-blue-black-outline.png'

Logo.propTypes = {
  sx: PropTypes.object
}

export default function Logo({sx}) {
  return <Box component="img" src={BrandLogo} sx={{width: 120, height: 120, ...sx, objectFit: 'contain'}} />
}
