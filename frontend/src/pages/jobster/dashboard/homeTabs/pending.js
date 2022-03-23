import {Box, Stack, Typography, Link, Card} from '@material-ui/core'
import moment from 'moment'
import {PendingCard} from './cards'

export default function PendingTab({gigs}) {
  return (
    <Box sx={{my: 5}}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{alignItems: 'center', mb: 2}}>
          <Typography variant="h4" sx={{borderLeft: '4px solid #FF3030', pl: 2, flexGrow: 1}}>
            Pending{' '}
          </Typography>
          {gigs.filter(
            (obj) =>
              !moment(obj.date).isBefore(moment(), 'day') && (obj.status === 'Waiting' || obj.status === 'Applying'),
          ).length > 5 && (
            <Link href="/pending" sx={{textDecoration: 'none', fontWeight: 400, mb: 0, mr: 2}}>
              More
            </Link>
          )}
        </Stack>
      </Stack>
      {gigs.length === 0 && gigs.filter((obj) => obj.status !== 'Applying' || obj.status !== 'Waiting') && (
        <Card sx={{px: 2, py: 3, textAlign: 'center'}}>
          <Typography variant="overline">No Pending gigs yet.</Typography>
        </Card>
      )}

      <Stack sx={{}}>
        {gigs &&
          gigs.map((v, key) => {
            const {status, date} = v
            if (status === 'Waiting' || status === 'Applying') {
              if (!moment(date).isBefore(moment(), 'day')) {
                return (
                  <Box sx={{mb: 1}} key={key}>
                    <PendingCard gig={v} />
                  </Box>
                )
              } else {
                return ''
              }
            } else {
              return ''
            }
          })}
      </Stack>
    </Box>
  )
}
