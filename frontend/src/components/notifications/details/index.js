import moment from 'moment'
// material
import {
  Stack,
  Card,
  Typography,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button
} from '@mui/material'
import {styled} from '@mui/material/styles'
import CheckIcon from '@mui/icons-material/CheckCircle'
import ChevronIconRight from '@mui/icons-material/ChevronRight'
import Label from '../../Label'

// utils
import {calculations} from 'src/utils/gigComputation'

import PropTypes from 'prop-types'

const ListWrapperStyle = styled(Paper)(() => ({
  width: '100%'
}))

const NotificationDetailsCard = ({details, currentUser}) => {
  if (!details || details === undefined) return ''

  let {_id, status, position, from, time, fee, hours, history, locationRate} = details

  let {serviceCost} = calculations(hours, fee, locationRate)

  const renderJobster = (status) => {
    let link = '/freelancer/dashboard?tab=1'
    let button_label = 'View Gig'
    switch (status) {
      case 'Waiting':
        link = `/gigs/details/${details?.uid}/${details?.category}#${details._id}`
        break
      case 'Applying':
        link = '/freelancer/dashboard?tab=3'
        break
      case 'Accepted':
        button_label = 'View Gig progress'
        link = '/freelancer/dashboard?tab=2'
        break
      case 'Confirm-Gig':
      case 'Confirm-Arrived':
      case 'End-Shift':
        button_label = 'View Gig progress'
        link = '/freelancer/dashboard?tab=1'
        break
      case 'Confirm-End-Shift':
        button_label = 'View Gig billing'
        link = '/freelancer/dashboard?tab=4'
        break
      default:
        break
    }
    return (
      <Button
        component="a"
        href={link}
        variant="contained"
        sx={{
          backgroundColor: 'starjobs.main',
          boxShadow: 'none',
          color: 'common.white',
          py: 2,
          mt: {xs: 5, sm: 5},
          mb: 20
        }}
      >
        {button_label}
      </Button>
    )
  }

  const renderClient = (status) => {
    let link = '/client/gig/create?tab=1'
    let button_label = 'View Gig'
    switch (status) {
      case 'Waiting':
        link = '/client/gig/create?tab=3'
        break
      case 'Applying':
        button_label = 'View Gig proposals'
        link = `/client/gigs/applicants/${_id}`
        break
      case 'Accepted':
        button_label = 'View Gig progress'
        link = '/client/gig/create?tab=2'
        break
      case 'Confirm-Gig':
      case 'Confirm-Arrived':
      case 'End-Shift':
        button_label = 'View Gig progress'
        link = '/client/gig/create?tab=1'
        break
      case 'Confirm-End-Shift':
        button_label = 'View Gig billing'
        link = '/client/gig/create?tab=4'
        break
      default:
        break
    }
    return (
      <Button
        component="a"
        href={link}
        variant="contained"
        sx={{
          backgroundColor: 'starjobs.main',
          boxShadow: 'none',
          color: 'common.white',
          py: 2,
          mt: {xs: 5, sm: 5}
        }}
      >
        {button_label}
      </Button>
    )
  }

  return (
    <Stack sx={{mt: 3, mb: 5}}>
      <Label
        variant="filled"
        sx={{
          textTransform: 'uppercase',
          width: '50%',
          my: 2,
          py: 2
        }}
      >
        {status}
      </Label>
      <Card sx={{p: 2}}>
        <Grid container>
          <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
            <Typography variant="overline">Name</Typography>
          </Grid>
          <Grid item xs={8} sm={8}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {position}
            </Typography>
          </Grid>
          <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
            <Typography variant="overline">Date</Typography>
          </Grid>
          <Grid item xs={8} sm={8}>
            <Stack direction="row" sx={{my: 1}}>
              <Typography variant="overline" color="default" sx={{fontSize: 10}}>
                Start: {moment(from).format('MMM-DD hh:mm A')}
              </Typography>
              <Typography variant="overline" color="default" sx={{fontSize: 10, ml: 2}}>
                End: {moment(time).format('MMM-DD hh:mm A')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
            <Typography variant="overline">Fee</Typography>
          </Grid>
          <Grid item xs={8} sm={8}>
            <Typography variant="body1" sx={{fontWeight: 'bold', fontSize: {sm: '1.2rem', xs: '0.85rem !important'}}}>
              P {serviceCost.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Card>
      {currentUser && status !== 'Waiting' && (
        <Card sx={{p: {xs: 1, sm: 2}, my: 3}}>
          <ListWrapperStyle>
            <List>
              {history &&
                history.map((v, k) => {
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
                        sx={{fontSize: {xs: '0.85rem !important'}}}
                      />
                    </ListItem>
                  )
                })}
            </List>
          </ListWrapperStyle>
        </Card>
      )}
      <Card sx={{p: {xs: 1, sm: 2}, my: 3}}>
        <Typography variant="overline" sx={{py: 2, px: 3}}>
          Gid ID
        </Typography>
        <Typography variant="h6" sx={{py: 1, px: 3, fontWeight: 'bold', wordBreak: 'break-all', width: '100%'}}>
          {_id}
        </Typography>
      </Card>
      {currentUser && currentUser.accountType === 0 && renderJobster(status)}
      {currentUser && currentUser.accountType === 1 && renderClient(status)}
      {currentUser && currentUser.accountType !== 0 && (status === 'Applying' || status === 'Waiting') && (
        <Button
          endIcon={<ChevronIconRight />}
          variant="text"
          sx={{
            backgroundColor: '#FFF',
            boxShadow: 'none',
            color: 'text.primary',
            py: 2,
            mt: {xs: 5, sm: 10},
            opacity: 0.35
          }}
        >
          Report an Issue
        </Button>
      )}
    </Stack>
  )
}

NotificationDetailsCard.propTypes = {
  details: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  currentUser: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default NotificationDetailsCard
