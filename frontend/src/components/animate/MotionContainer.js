import PropTypes from 'prop-types'
import {motion} from 'framer-motion'
// material
import {Box} from '@mui/material'
//
import {varWrapEnter} from './variants'

MotionContainer.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  children: PropTypes.node
}

export default function MotionContainer({open, children, ...other}) {
  return (
    <Box component={motion.div} initial={false} animate={open ? 'animate' : 'exit'} variants={varWrapEnter} {...other}>
      {children}
    </Box>
  )
}
