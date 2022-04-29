import {Stack, Grid, Typography, Divider} from '@mui/material'
import {parcel_calculations} from 'src/utils/gigComputation'

import PropTypes from 'prop-types'

export default function BillingForm({storeData}) {
  if (!storeData) return

  const {fee, hours} = storeData

  let {computedFeeByHr, transactionFee, grossGigFee, grossVAT, grossWithHolding, serviceCost} = parcel_calculations(
    hours,
    fee
  )

  return (
    <Stack>
      <Typography variant="h5" sx={{fontWeight: 'bold', mb: 3}}>
        Billing Summary
      </Typography>

      <Stack direction="column">
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">Gig Fee per parcel</Typography>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {Number(fee).toFixed(2)} / parcel
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">Total Gig Fee</Typography>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {`(${fee} X ${parseInt(hours) > 1 ? hours + 'parcels' : hours + 'parcel'})`} -{' '}
              {computedFeeByHr.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">Transaction Fee</Typography>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {transactionFee.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{my: 3}} />

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">Gross Gig Fee</Typography>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {grossGigFee.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">VAT</Typography>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {grossVAT.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">Withholding Tax</Typography>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {grossWithHolding.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">Total Gig Service Cost:</Typography>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: 'right'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
              {serviceCost.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Stack>

      <Typography variant="body1" sx={{fontWeight: 'bold', my: 3, justifyContent: 'center'}}>
        Note: Each daily gig should have a separate billing, all billing shall be forwarded to your registered email.
        You have 3 days to settle daily gigs and all transaction should be made online.
      </Typography>
    </Stack>
  )
}

BillingForm.propTypes = {
  storeData: PropTypes.object
}
