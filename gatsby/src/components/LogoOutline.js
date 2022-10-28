// import React from 'react'
import PropTypes from 'prop-types'
// material
import {Box} from '@mui/material'
import BrandLogoOutline from 'assets/static/favicon/starjobs-blue-outline-preloader.png'

LogoOutline.propTypes = {
  sx: PropTypes.object
}

export default function LogoOutline({sx}) {
  return (
    <Box
      component="img"
      src={BrandLogoOutline}
      sx={{width: 80, height: 80, ...sx, objectFit: 'contain', mr: 'auto', mb: 2}}
    />
  )
}
