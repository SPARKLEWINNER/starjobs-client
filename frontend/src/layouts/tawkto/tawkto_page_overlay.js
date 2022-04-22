import {useLocation} from 'react-router-dom'
import PropTypes from 'prop-types'

import {Dialog, Fab, Slide, Box} from '@mui/material'
import React, {useState} from 'react'

import Draggable from 'react-draggable'
import useWindowDimensions from 'src/utils/hooks/useWindowDimensions'

import ChatLogo from 'src/assets/chat_logo.svg'

let listPublic = ['sign-up', 'login', 'verification', '404', 'undefined', 'setup/welcome']

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

TawktoPageOverlay.propTypes = {
  children: PropTypes.node
}

const TawktoPageOverlay = ({children}) => {
  const {height} = useWindowDimensions()
  const {pathname} = useLocation()

  const [open, setOpen] = useState(false)

  const [isDragging, setIsDragging] = useState(false)

  const handleClickOpen = () => {
    if (isDragging === false) {
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      {!listPublic.includes(pathname.replace('/', '')) && (
        <>
          <Draggable
            onDrag={() => {
              setIsDragging(true)
            }}
            onStop={() => {
              setIsDragging(false)
              handleClickOpen()
            }}
          >
            <Fab
              color="primary"
              style={{
                position: 'fixed',
                bottom: '5em',
                right: 16,
                padding: '10px',
                zIndex: '999'
              }}
            >
              <Box
                component="img"
                sx={{transition: 'all 300ms ease-in-out', fill: 'white'}}
                src={ChatLogo}
                alt="Chat-Logo"
                height={'100%'}
                width={'100%'}
              />
            </Fab>
          </Draggable>
          <Dialog open={open} keepMounted onClose={handleClose} fullWidth TransitionComponent={Transition}>
            <object data={process.env.REACT_APP_TAWK_TO} height={height - 200} type="text/html">
              Alternative Content
            </object>
          </Dialog>
        </>
      )}
      {children}
    </div>
  )
}

export default TawktoPageOverlay
