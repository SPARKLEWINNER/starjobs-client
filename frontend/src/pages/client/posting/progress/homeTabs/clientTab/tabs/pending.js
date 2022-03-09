import {useState, useEffect} from 'react'
import {Box, Stack, Typography} from '@material-ui/core'
import moment from 'moment'
import LoadingScreen from 'components/LoadingScreen'
import {PendingCard} from 'components/clients/cards'

const pending_status = ['Waiting', 'Applying']
export default function PendingTab({gigs, selected}) {
  const [FILTERED_DATA, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const processFilter = () => {
      setLoading(true)
      const filtered_gig = gigs.filter((obj) => pending_status.includes(obj.status))
      const data = []
      filtered_gig &&
        filtered_gig.map((value) => {
          const {time, status} = value
          if (status !== 'Waiting') return ''
          if (moment(time).isBefore(moment(), 'day')) return ''
          return data.push(value)
        })

      setLoading(false)
      setData(data)
    }

    processFilter()
    // eslint-disable-next-line
  }, [gigs, selected])

  return (
    <Box sx={{my: 2}}>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: '4px solid #FF3030', pl: 2, mb: 2}}>
          Pending
        </Typography>
      </Stack>
      <Box sx={{px: 1}}>
        {loading && <LoadingScreen />}
        {FILTERED_DATA &&
          FILTERED_DATA.map((v, k) => {
            return <PendingCard gig={v} key={k} />
          })}

        {(!FILTERED_DATA || FILTERED_DATA.length === 0) && <Typography variant="body2">No Pending Gig/s</Typography>}
      </Box>
    </Box>
  )
}
