import {Box, Card, CardContent, Typography} from '@mui/material'
import {calculations} from 'src/utils/gigComputation'
export default function BillingCard({gig}) {
  let {position, hours, fee, locationRate} = gig

  fee = parseFloat(fee)
  let {jobsterTotal} = calculations(hours, fee, locationRate)

  return (
    <Card sx={{p: 0, my: 2}}>
      <Box sx={{p: 3}}>
        <CardContent sx={{px: 0, paddingBottom: '0 !important', pt: 0, alignItems: 'flex-start'}}>
          <Typography variant="h5" sx={{fontWeight: 'bold'}}>
            {position}
          </Typography>
          <Typography variant="body2">
            Pending for remittance: <b>You will receive your gig fee in the next three (3) days</b>. Thank you for using
            Starjobs.
            <br /> Gig Fee: <b> P {parseFloat(jobsterTotal).toFixed(2)} / hr</b>
          </Typography>
        </CardContent>
      </Box>
    </Card>
  )
}
