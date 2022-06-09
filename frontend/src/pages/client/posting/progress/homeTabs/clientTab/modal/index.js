import React from 'react'
import {Global} from '@emotion/react'
import {styled} from '@mui/styles'
import {grey} from '@mui/material/colors'
import moment from 'moment'
import {
  Box,
  Paper,
  Typography,
  SwipeableDrawer,
  Stack,
  Button,
  CardContent,
  CardMedia,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material'

// icons
import {Icon} from '@iconify/react'
import CheckIcon from '@mui/icons-material/CheckCircle'
import closeIcon from '@iconify/icons-eva/close-circle-outline'

// components
import {LoadingButton} from '@mui/lab'

// utils
import {calculations} from 'src/utils/gigComputation'
import PropTypes from 'prop-types'

CurrentModalPopup.propTypes = {
  gig: PropTypes.object,
  open: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onEndShift: PropTypes.func,
  onArrived: PropTypes.func,
  loading: PropTypes.bool
}

// variable
const drawerBleeding = 56
const default_url = process.env.REACT_APP_IMAGE_URL

const ListWrapperStyle = styled(Paper)(({theme}) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`
}))
// style
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

export default function CurrentModalPopup({gig, open, onClose, onEndShift, onArrived, loading}) {
  let {history, position, hours, fee, time, from, status, category, account, locationRate} = gig

  const {firstName, middleInitial, lastName, photo} = account[0]

  let {serviceCost} = calculations(hours, fee, locationRate)

  const name = `${firstName} ${middleInitial} ${lastName};`
  fee = parseFloat(fee)

  const handleEndShift = (value) => {
    try {
      onEndShift(value)
    } catch (error) {
      console.log(error)
    }
  }

  const _label = (_status) => {
    switch (_status) {
      case 'Confirm-Gig':
        return 'Confirm-Arrived'
      case 'End-Shift':
        return 'Confirm-End-Shift'
      default:
        return ''
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
                  <Typography variant="h3" sx={{color: 'text.secondary'}}>
                    Current Gig Details
                  </Typography>
                </Box>
                <Button sx={{ml: 'auto'}} onClick={onClose}>
                  <Icon icon={closeIcon} width={32} height={32} color="#b2b2b2" />
                </Button>
              </Stack>

              <Box sx={{p: 1}}>
                <CardContent sx={{flex: '1 0 auto', p: 0, alignItems: 'flex-start'}}>
                  <Stack direction="row">
                    <Box sx={{p: 3, textAlign: 'center'}}>
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
                        image={`${default_url}${photo}`}
                        alt={position}
                      />
                    </Box>
                    <Box sx={{p: 1}}>
                      <CardContent sx={{flex: '1 0 auto', p: 0, alignItems: 'flex-start'}}>
                        <Stack sx={{my: 1}}>
                          <Typography variant="body2">Name</Typography>
                          <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                            {name}
                          </Typography>
                        </Stack>

                        <Stack sx={{my: 1}}>
                          <Typography variant="body2">Date & Time</Typography>
                          <Typography variant="body1" color="default" sx={{fontWeight: 'bold'}}>
                            Start: {moment(from).format('MMM-DD hh:mm A')}
                          </Typography>
                          <Typography variant="body1" color="default" sx={{fontWeight: 'bold'}}>
                            End: {moment(time).format('MMM-DD hh:mm A')}
                          </Typography>
                        </Stack>

                        <Stack sx={{my: 1}}>
                          <Typography variant="body2">No. of {category === 'parcels' ? 'Parcels' : 'Hours'}</Typography>
                          <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                            {hours && hours} {category && category === 'parcels' ? 'Parcels' : 'Hours'}
                          </Typography>
                        </Stack>

                        <Stack sx={{my: 1}}>
                          <Typography variant="body2">Total Service Cost</Typography>
                          <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                            {serviceCost.toFixed(2)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Box>
                  </Stack>
                  <Stack>
                    <ListWrapperStyle>
                      <List>
                        {history &&
                          history.length > 0 &&
                          Object.values(history).map((v, k) => {
                            return (
                              <ListItem key={k}>
                                <ListItemAvatar>
                                  <Avatar>
                                    <CheckIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={v.status}
                                  secondary={`${new Date(v.updatedAt).toDateString()} ${new Date(
                                    v.updatedAt
                                  ).toLocaleTimeString()}`}
                                />
                              </ListItem>
                            )
                          })}
                      </List>
                    </ListWrapperStyle>

                    {/* {status === 'Confirm-Gig' && (
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
                    )} */}
                    {status === 'Confirm-Gig' && (
                      <Stack sx={{mt: 3, mb: 5}}>
                        <LoadingButton size="large" variant="contained" onClick={() => onArrived()} loading={loading}>
                          {_label(status)}
                        </LoadingButton>
                      </Stack>
                    )}
                    {status === 'End-Shift' && (
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
                  </Stack>
                </CardContent>
              </Box>
            </Box>
          </StyledBox>
        </SwipeableDrawer>
      </Box>
    </>
  )
}
