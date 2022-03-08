import PropTypes from 'prop-types'
// material
import {Box} from '@material-ui/core'

// ----------------------------------------------------------------------

LogoOutline.propTypes = {
  sx: PropTypes.object,
}

export default function LogoOutline({sx}) {
  return (
    <Box
      component="img"
      src="/static/favicon/starjobs-outline.png"
      sx={{width: 120, height: 120, ...sx, objectFit: 'contain'}}
    />
  )
}
