import {useState, useEffect} from 'react'
import {Box, Stack, Typography} from '@mui/material'
import moment from 'moment'
import {PendingCard} from '../../../cards'

import ProgressCircle from 'src/components/progressCircle'

// theme
import color from 'src/theme/palette'
import PropTypes from 'prop-types'

PendingTab.propTypes = {
  gigs: PropTypes.array,
  selected: PropTypes.string
}

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
          switch (status) {
            case 'Waiting':
            case 'Applying':
              if (moment(time).isBefore(moment(), 'day')) return ''
              return data.push(value)
            default:
              return ''
          }
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
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Pending
        </Typography>
      </Stack>
      <Box sx={{px: 1}}>
        {loading && <ProgressCircle />}
        {FILTERED_DATA &&
          FILTERED_DATA.map((v, k) => {
            return <PendingCard gig={v} key={k} />
          })}

        {(!FILTERED_DATA || FILTERED_DATA.length === 0) && <Typography variant="body2">No Pending Gig/s</Typography>}
      </Box>
    </Box>
  )
}
