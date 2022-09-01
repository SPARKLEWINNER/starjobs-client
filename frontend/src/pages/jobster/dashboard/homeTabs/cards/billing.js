import PropTypes from 'prop-types'
import {Box, Card, CardContent, Typography, Accordion, AccordionSummary, Stack} from '@mui/material'
import {Icon} from '@iconify/react'
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill'

import {calculations} from 'src/utils/gigComputation'

BillingCard.propTypes = {
  gig: PropTypes.object,
  user: PropTypes.object
}

export default function BillingCard({gig, user}) {
  let {position, hours, breakHr, locationRate, fee, late, _id, location} = gig
  fee = parseFloat(fee)
  let {jobsterTotal} = calculations(hours, fee, locationRate)
  return (
    <Card sx={{p: 0, my: 2}}>
      <Accordion sx={{p: 0}} key={_id}>
        <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
          <Stack direction="column" sx={{alignItems: 'flex-start', px: 1}}>
            <Typography variant="h5" sx={{fontWeight: 'bold'}}>
              {position}
            </Typography>
            <Typography variant="body2">
              {' '}
              Pending for remittance: <b>You will receive your gig fee in the next three (3) days</b>. Thank you for
              using Starjobs.
            </Typography>
          </Stack>
        </AccordionSummary>
        <Box sx={{px: 3}}>
          <CardContent sx={{px: 0, paddingBottom: '0 !important', pt: 0, alignItems: 'flex-start'}}>
            <Stack direction="row">
              <Box sx={{p: 1}}>
                <CardContent sx={{flex: '1 0 auto', p: 0, alignItems: 'flex-start'}}>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Jobster Name</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {user?.name}
                    </Typography>
                  </Stack>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Location</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {location}
                    </Typography>
                  </Stack>

                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Position</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      {position}
                    </Typography>
                  </Stack>

                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">No. of actual work</Typography>
                    <Typography variant="body1" color="default" sx={{fontWeight: 'bold'}}>
                      {hours && parseFloat(hours).toFixed(2)}
                    </Typography>
                  </Stack>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Break hours</Typography>
                    <Typography variant="body1" color="default" sx={{fontWeight: 'bold'}}>
                      {breakHr && parseFloat(breakHr).toFixed(2)}
                    </Typography>
                  </Stack>
                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Proposed & Approved rate</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      P {fee && parseFloat(fee).toFixed(2)} / hour
                    </Typography>
                  </Stack>
                  {late && (
                    <Stack sx={{my: 1}}>
                      <Typography variant="body2">Late</Typography>
                      <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                        {late && parseFloat(late).toFixed(2)} / hour
                      </Typography>
                    </Stack>
                  )}

                  <Stack sx={{my: 1}}>
                    <Typography variant="body2">Total Service Payment</Typography>
                    <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                      P {jobsterTotal && (parseFloat(jobsterTotal).toFixed(2) * hours).toFixed(2)}
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
