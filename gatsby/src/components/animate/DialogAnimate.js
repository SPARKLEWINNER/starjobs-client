import React from 'react'
import PropTypes from 'prop-types'
import {motion, AnimatePresence} from 'framer-motion'
// material
import {Dialog} from '@mui/material'
//
import {varFadeInUp} from './variants'

export default function DialogAnimate({open = false, animate, onClose, children, ...other}) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={onClose}
          PaperComponent={motion.div}
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: 'background.paper'
            },
            ...(animate || varFadeInUp)
          }}
          {...other}
        >
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  )
}

DialogAnimate.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  animate: PropTypes.object,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired
}
