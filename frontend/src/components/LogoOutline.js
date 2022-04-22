import PropTypes from 'prop-types'
// material
import {Box} from '@mui/material'

LogoOutline.propTypes = {
  sx: PropTypes.object
}

export default function LogoOutline({sx}) {
  return (
    <Box
      component="img"
      src="/static/favicon/starjobs-blue-outline-preloader.png"
      sx={{width: 80, height: 80, ...sx, objectFit: 'contain', mr: 'auto', mb: 2}}
    />
  )
}
