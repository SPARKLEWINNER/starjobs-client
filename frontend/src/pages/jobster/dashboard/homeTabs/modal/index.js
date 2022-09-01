import PropTypes from 'prop-types'

import React from 'react'
import {Global} from '@emotion/react'
import {styled} from '@mui/styles'
import {grey} from '@mui/material/colors'
import moment from 'moment'
import {Box, Typography, SwipeableDrawer, Stack, Button, CardContent, CardMedia} from '@mui/material'

import {Icon} from '@iconify/react'
import closeIcon from '@iconify/icons-eva/close-circle-outline'
import {LoadingButton} from '@mui/lab'

const drawerBleeding = 56

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

const CurrentModalPopup = ({gig, open, onClick, onClose, onEndShift, loading}) => {
  let {user, shift, position, hours, fee, time, from, status, category} = gig

  fee = parseFloat(fee)
  let computedGigFee = parseFloat(fee * hours)
  let voluntaryFee = parseFloat(computedGigFee * 0.112421) / hours
  let _total = parseFloat(fee + voluntaryFee)

  const handleEndShift = (value) => {
    try {
      onEndShift(value)
    } catch (error) {
      console.log(error)
    }
  }

  const _label = (_status) => {
    switch (_status) {
      case 'Applying':
      case 'Waiting':
        return ''
      case 'Accepted':
        return 'Confirm-Gig'
      case 'Confirm-Gig':
        return 'Confirm-Arrived'
      case 'Confirm-Arrived':
      case 'Arrived':
        return 'End-Shift'
      case 'No Appearance':
        return 'No Appearance'
      case 'Cancelled':
        return 'Cancel'
      default:
        return ''
    }
  }

  const handleClick = (value) => {
    try {
      let form_data = {
        new_status: _label(value.status),
        ...value
      }
      onClick(form_data, value)
    } catch (error) {
      console.log(error)
    }
  }

  const onOpen = () => {}

  return (
    <>
      <Global
        styles={{
          '.current-gig-details-drawer > .MuiPaper-root': {
            height: `calc(85%)`,
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
          onClose={onClose}
          onOpen={onOpen}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={true}
          ModalProps={{
            keepMounted: true
          }}
          className="current-gig-details-drawer"
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
                  <Typography variant="h2" sx={{color: 'text.secondary', textAlign: 'center'}}>
                    Current Gig Details
                  </Typography>
                </Box>
                <Button sx={{ml: 'auto'}} onClick={onClose}>
                  <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
                </Button>
              </Stack>
              <Typography variant="h3" sx={{mb: 3, textAlign: 'center'}}>
                <br></br>Are you sure that you have arrived in the store location ? Kindly ensure your arrival before
                clicking "Confirm Arrived".
              </Typography>
              <Box sx={{p: 3, textAlign: 'center'}}>
                {Object.keys(user).length !== 0 && (
                  <CardMedia
                    component="img"
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderRadius: '8px',
                      width: '130px',
                      height: '130px',
                      margin: '0 auto'
                    }}
                    image={`${user['thumbnail']}`}
                    alt={position}
                  />
                )}
              </Box>

              <Box sx={{p: 1}}>
                <CardContent sx={{flex: '1 0 auto', p: 0, alignItems: 'flex-start'}}>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Company name</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {Object.keys(user).length !== 0 ? user[0]['companyName'] : ''}
                    </Typography>
                  </Stack>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Status</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {status}
                    </Typography>
                  </Stack>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Location</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {Object.keys(user).length !== 0 ? user[0]['location'] : ''}
                    </Typography>
                  </Stack>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Position</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {position}
                    </Typography>
                  </Stack>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Date & Time</Typography>
                    <Stack direction="row" sx={{my: 1}}>
                      <Typography variant="body1" color="default" sx={{fontWeight: 'bold'}}>
                        Start: {moment(from).format('MMM-DD hh:mm A')}
                      </Typography>
                      <Typography variant="body1" color="default" sx={{ml: 2, fontWeight: 'bold'}}>
                        End: {moment(time).format('MMM-DD hh:mm A')}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">No. of {category === 'parcels' ? 'Parcels' : 'Hours'}</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {hours} {category === 'parcels' ? 'Parcels' : 'Hour'}
                    </Typography>
                  </Stack>

                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Gig fee</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      Php {_total.toFixed(2)} / {category === 'parcels' ? 'parcel' : 'hour'}
                    </Typography>
                  </Stack>

                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Shift</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {shift}
                    </Typography>
                  </Stack>

                  {status === 'Applying' && (
                    <Stack sx={{mt: 3, mb: 5}}>
                      <Button size="large" variant="text" sx={{textTransform: 'initial !important'}}>
                        For Client review
                      </Button>
                    </Stack>
                  )}

                  {status === 'On-the-way' ||
                    (status === 'Accepted' && (
                      <Stack sx={{mt: 3, mb: 5}}>
                        <LoadingButton
                          size="large"
                          variant="contained"
                          onClick={() => handleClick(gig)}
                          loading={loading}
                        >
                          {_label(status)}
                        </LoadingButton>
                      </Stack>
                    ))}

                  {status === 'Confirm-Gig' && (
                    <Stack sx={{mt: 3, mb: 5}}>
                      <LoadingButton
                        size="large"
                        variant="contained"
                        onClick={() => handleClick(gig)}
                        loading={loading}
                      >
                        {_label(status)}
                      </LoadingButton>
                    </Stack>
                  )}

                  {status === 'Confirm-Arrived' && (
                    <Stack sx={{mt: 3, mb: 5}}>
                      <LoadingButton
                        size="large"
                        variant="contained"
                        onClick={() => handleEndShift(gig)}
                        loading={loading}
                      >
                        {_label(status)}
                      </LoadingButton>
                    </Stack>
                  )}

                  {status === 'End-Shift' && (
                    <Stack sx={{mt: 3, mb: 5}}>
                      <Button size="large" variant="text">
                        Waiting for Client to Confirm
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Box>
            </Box>
          </StyledBox>
        </SwipeableDrawer>
      </Box>
    </>
  )
}

CurrentModalPopup.propTypes = {
  gig: PropTypes.object,
  open: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onEndShift: PropTypes.func,
  loading: PropTypes.bool
}

export default CurrentModalPopup
