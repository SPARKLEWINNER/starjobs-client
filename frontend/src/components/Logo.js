import PropTypes from 'prop-types'
// material
import {Box} from '@material-ui/core'

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
}

export default function Logo({sx}) {
  return (
    <Box
      component="img"
      src="/static/favicon/starjobs-outline-preloader.png"
      sx={{width: 120, height: 120, ...sx, objectFit: 'contain'}}
    />
  )
}
