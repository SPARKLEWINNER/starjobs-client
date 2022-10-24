import {Box, Card, CardContent, Typography, Accordion, AccordionSummary, CardMedia, Stack} from '@mui/material'
import {Icon} from '@iconify/react'
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill'
import moment from 'moment'
import {calculations} from 'src/utils/gigComputation'

import PropTypes from 'prop-types'

BillingCard.propTypes = {
  gig: PropTypes.object,
  _type: PropTypes.string
}

const default_url = process.env.REACT_APP_IMAGE_URL

export default function BillingCard({gig}) {
  let {position, hours, fee, time, from, _id, account, late, locationRate} = gig
  fee = parseFloat(fee)
  const {firstName, middleInitial, lastName, photo} = account[0]
  let {serviceCost} = calculations(hours, fee, locationRate)
  const name = `${firstName} ${middleInitial} ${lastName};`
  const hrShift = parseInt(hours) > 1 ? hours + ' hrs' : hours + ' hr'
  return (
    <Card sx={{p: 0, my: 2}}>
      <Accordion sx={{p: 0}} key={_id}>
        <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
          <Stack direction="column" sx={{alignItems: 'flex-start', px: 1}}>
            <Typography variant="h5" sx={{fontWeight: 'bold'}}>
              {position}
            </Typography>
            <Typography variant="body2">
              Pending for billing: Your company shall receive a billing statement in your email within the day.
              <b>You are given three (3) days to settle today’s gig. </b>. Thank you for using Starjobs.
            </Typography>
          </Stack>
        </AccordionSummary>
        <Box sx={{p: 3}}>
          <CardContent sx={{px: 0, paddingBottom: '0 !important', pt: 0, alignItems: 'flex-start'}}>
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
                    <Typography variant="body2">Late</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {late}
                    </Typography>
                  </Stack>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">No. of Hours</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {hrShift}
                    </Typography>
                  </Stack>

                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Total Service Cost</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {serviceCost?.toFixed(2)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Box>
            </Stack>
          </CardContent>
        </Box>
      </Accordion>
    </Card>
  )
}
