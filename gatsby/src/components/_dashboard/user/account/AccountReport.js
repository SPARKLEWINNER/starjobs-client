import {Grid, Card, Stack} from '@mui/material'

export default function AccountReport({_data}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{p: 3}}>
          <Stack spacing={{xs: 2, md: 3}}></Stack>
        </Card>
      </Grid>
    </Grid>
  )
}
