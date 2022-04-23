import {useState, useEffect} from 'react'
import {Box, Stack, Typography, Card} from '@mui/material'
import moment from 'moment'
import {IncomingCard} from '../../../cards'

// theme
import color from 'src/theme/palette'
import PropTypes from 'prop-types'

IncomingTab.propTypes = {
  gigs: PropTypes.array,
  user: PropTypes.array,
  selected: PropTypes.string
}

const incoming_status = ['Accepted']

export default function IncomingTab({gigs, selected}) {
  const [FILTERED_DATA, setData] = useState([])

  useEffect(() => {
    const processFilter = () => {
      const filtered_gig = gigs.filter((obj) => incoming_status.includes(obj.status))
      const data = []
      filtered_gig &&
        filtered_gig.map((value) => {
          const {from} = value
          if (moment(from).isBefore(moment(), 'day')) return ''
          return data.push(value)
        })
      setData(data)
    }

    processFilter()
    // eslint-disable-next-line
  }, [gigs, selected])

  return (
    <Box sx={{my: 2}}>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          Incoming
        </Typography>
      </Stack>
      <Box sx={{px: 1}}>
        {FILTERED_DATA &&
          FILTERED_DATA.map((v, k) => {
            return <IncomingCard gig={v} key={k} />
          })}

        {(!FILTERED_DATA || FILTERED_DATA.length === 0) && (
          <Card sx={{my: 2, p: 4, borderRadius: 1}}>
            <Typography variant="body2" sx={{fontWeight: 'bold', textAlign: 'center'}}>
              No Incoming gigs
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  )
}
