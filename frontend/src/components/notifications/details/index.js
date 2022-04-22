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

const ListWrapperStyle = styled(Paper)(() => ({
  width: '100%'
}))

const NotificationDetailsCard = ({details}) => {
  if (!details || details === undefined) return ''

  let {_id, status, position, from, time, fee, hours, history, locationRate} = details

  let {serviceCost} = calculations(hours, fee, locationRate)

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

      <Card sx={{p: {xs: 1, sm: 2}, my: 3}}>
        <Typography variant="overline" sx={{py: 2, px: 3}}>
          Gid ID
        </Typography>
        <Typography variant="h6" sx={{py: 1, px: 3, fontWeight: 'bold', wordBreak: 'break-all', width: '100%'}}>
          {_id}
        </Typography>
      </Card>
      {(status === 'Applying' || status === 'Waiting') && (
        <Button
          component="a"
          href={`/client/gigs/applicants/${_id}`}
          variant="contained"
          sx={{
            backgroundColor: 'starjobs.main',
            boxShadow: 'none',
            color: 'common.white',
            py: 2,
            mt: {xs: 5, sm: 5}
          }}
        >
          View Gig details
        </Button>
      )}
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
    </Stack>
  )
}

export default NotificationDetailsCard
