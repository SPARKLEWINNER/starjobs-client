import PropTypes from 'prop-types'

import {Box, Stack, Typography, Card} from '@mui/material'
import moment from 'moment'
// import {useSnackbar} from 'notistack'
import {IncomingCard} from './cards'

// theme
import color from 'src/theme/palette'

const IncomingTab = ({gigs, user}) => {
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Incoming
        </Typography>
      </Stack>
      {gigs.length === 0 && (
        <Card sx={{px: 2, py: 3, textAlign: 'center'}}>
          <Typography variant="overline">No Incoming Gigs yet.</Typography>
        </Card>
      )}
      {gigs &&
        gigs.map((v, k) => {
          const {status, from} = v
          if (status === 'Accepted' || status === 'Confirm-Gig') {
            if (moment(from).isBefore(moment(), 'day')) return ''
            if (moment(from).isSame(moment(), 'day')) {
              if (v.auid !== user._id) return ''
              //if incoming in less than four hours alert the user
              // hours remaining = gig_time - time_today
              let hours = moment(from).diff(new Date(), 'hours', true)

              if (hours <= 4) {
                return ''
              }

              return (
                <Box sx={{my: 1}} key={`box - ${k}`}>
                  <IncomingCard gig={v} />
                </Box>
              )
            } else {
              if (moment(from).isBefore()) return ''
            }
            if (!moment(from).isBefore(moment(), 'day')) {
              return (
                <Box sx={{my: 2}}>
                  <IncomingCard gig={v} />
                </Box>
              )
            } else {
              return ''
            }
          } else {
            return ''
          }
        })}
    </Box>
  )
}

IncomingTab.propTypes = {
  gigs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  user: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
}

export default IncomingTab
