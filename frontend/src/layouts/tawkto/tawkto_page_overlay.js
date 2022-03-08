import {useLocation} from 'react-router-dom'
import {Dialog, Fab, Slide, Box} from '@material-ui/core'
import LoadingScreen from 'components/LoadingScreen'
import React, {useState} from 'react'

import Draggable from 'react-draggable'
import useWindowDimensions from 'utils/hooks/useWindowDimensions'

import ChatLogo from 'assets/chat_logo.svg'

let listPublic = ['sign-up', 'login', 'verification', '404', 'undefined', 'setup/welcome']

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const TawktoPageOverlay = ({children}) => {
  const {height} = useWindowDimensions()
  const {pathname} = useLocation()
  const [isLoading, setisLoading] = useState(true)

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
                zIndex: '999',
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
            {isLoading && <LoadingScreen />}
            <iframe
              title="tawkto"
              src={process.env.REACT_APP_TAWK_TO}
              height={height - 200}
              frameBorder={0}
              onLoad={() => {
                setisLoading(false)
              }}
            ></iframe>
          </Dialog>
        </>
      )}
      {children}
    </div>
  )
}

export default TawktoPageOverlay
