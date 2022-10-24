import {useEffect, useState} from 'react'
import {Box, Stack, Typography, Grid, Card} from '@mui/material'

// components
import {BillingCard} from '../../../cards'

// theme
import color from 'src/theme/palette'
import PropTypes from 'prop-types'

const Moment = require('moment')
const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(Moment)

// status
const current_status = [
  'Confirm-Gig',
  'On-the-way',
  'Arrived',
  'Confirm-Arrived',
  'On-going',
  'End-Shift',
  'Confirm-End-Shift'
]

const CurrentTab = ({gigs}) => {
  const [FILTERED_DATA, setData] = useState([])
  useEffect(() => {
    const processFilter = () => {
      const filtered_gig = gigs.filter((obj) => current_status.includes(obj.status))
      const data = []
      filtered_gig &&
        filtered_gig.map((value) => {
          const {date} = value

          const previousDays = moment().subtract(3, 'days')
          const aheadDays = moment().add(3, 'days')
          const range = moment().range(previousDays, aheadDays)

          if (!range.contains(moment(date))) return false
          return data.push(value)
        })
      setData(data)
    }

    processFilter()
    // eslint-disable-next-line
  }, [gigs])

  return (
    <Box sx={{my: 2}}>
      <Stack spacing={3}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
              For Billing
            </Typography>
          </Grid>
        </Grid>
      </Stack>

      {FILTERED_DATA &&
        FILTERED_DATA.map((v, k) => {
          if (v.status !== 'Confirm-End-Shift') return ''
          return <BillingCard key={k} gig={v} />
        })}

      {(!FILTERED_DATA || FILTERED_DATA.length === 0) && (
        <Card sx={{my: 2, p: 4, borderRadius: 1}}>
          <Typography variant="body2" sx={{fontWeight: 'bold', textAlign: 'center'}}>
            No for billing gigs
          </Typography>
        </Card>
      )}
    </Box>
  )
}

CurrentTab.propTypes = {
  gigs: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
}

export default CurrentTab
