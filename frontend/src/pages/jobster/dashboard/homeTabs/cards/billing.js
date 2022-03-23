import {Box, Card, CardContent, Typography} from '@material-ui/core'

export default function BillingCard({gig, _type}) {
  let {position, fee, hours} = gig
  fee = parseFloat(fee)
  let computedGigFee = parseFloat(fee * hours)
  let voluntaryFee = parseFloat(computedGigFee * 0.112421) / hours
  let _total = parseFloat(fee + voluntaryFee)

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
            <br /> Gig Fee: <b>{_total.toFixed(2)}</b> / <b>{gig.user[0].rateType}</b>
          </Typography>
        </CardContent>
      </Box>
    </Card>
  )
}
