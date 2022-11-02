import React, {useEffect, useState, createContext} from 'react'
import PropTypes from 'prop-types'
// components
import {Box, Typography, SwipeableDrawer, Stack, Button} from '@mui/material'
import {Global} from '@emotion/react'
import {styled} from '@mui/styles'
import {grey} from '@mui/material/colors'

// icons
import {Icon} from '@iconify/react'
import closeIcon from '@iconify/icons-eva/close-circle-outline'

// components
import {FreelancerRating} from 'components/gigRatings'

// hooks
import {useAuth} from 'contexts/AuthContext'

// variables
const drawerBleeding = 56

// styles
const StyledBox = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800]
}))

const Puller = styled(Box)(({theme}) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)'
}))

const RatingsContext = createContext()

const RatingsProvider = ({children}) => {
  const {currentUser} = useAuth()
  const [open, setOpen] = useState(false)
  const [rating, setRatings] = useState([])
  const [GIG_ID, setGigId] = useState(undefined)

  const toggleDrawer = (newOpen, gigId) => {
    if (!gigId) return
    setGigId(gigId)
    setOpen(newOpen)
  }

  const closeRatingModal = () => {
    setOpen(false)
    setGigId(undefined)
  }

  const onOpen = () => {}

  useEffect(() => {}, [open])
  return (
    <RatingsContext.Provider value={{rating, setRatings, toggleDrawer}}>
      {children}
      <Global
        styles={{
          '.rating-drawer > .MuiPaper-root': {
            height: `calc(80%)`,
            overflow: 'visible'
          }
        }}
      />
      <Box
        sx={{
          zIndex: !open ? 999 : -1,
          backgroundColor: '#FFF',
          overflow: 'hidden',
          borderRadius: '6px',
          border: '2px solid white'
        }}
      >
        <SwipeableDrawer
          anchor="bottom"
          open={open || false}
          onClose={closeRatingModal}
          onOpen={onOpen}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={true}
          ModalProps={{
            keepMounted: true
          }}
          className="rating-drawer"
        >
          <StyledBox
            sx={{
              position: 'absolute',
              top: open ? -drawerBleeding : 0,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0
            }}
          >
            <Puller />
            <Box sx={{mt: 3}}>
              <br />
              <br />
            </Box>
          </StyledBox>
          <StyledBox
            sx={{
              px: 2,
              pb: 2,
              height: '100%',
              overflow: 'auto'
            }}
          >
            <Box sx={{py: 1}}>
              <Stack direction="row" sx={{width: '100%'}}>
                <Box>
                  <Typography variant="h3" sx={{color: 'text.secondary'}}>
                    Rate your <br />
                    experience
                  </Typography>
                </Box>
                <Button sx={{ml: 'auto'}} onClick={() => toggleDrawer(false)}>
                  <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{display: 'block', mt: 1, fontWeight: '600'}}>
                We would like to know what was your experience in this gig?
              </Typography>
            </Box>
            <Box sx={{py: 2, '& > legend': {mt: 2}}}>
              {currentUser.accountType === 1 && (
                <FreelancerRating user={currentUser} gigId={GIG_ID} onClose={closeRatingModal} />
              )}
            </Box>
          </StyledBox>

          <Button variant="text" onClick={closeRatingModal}>
            Skip Rating
          </Button>
        </SwipeableDrawer>
      </Box>
    </RatingsContext.Provider>
  )
}

RatingsProvider.propTypes = {
  children: PropTypes.node
}

export {RatingsContext, RatingsProvider}
