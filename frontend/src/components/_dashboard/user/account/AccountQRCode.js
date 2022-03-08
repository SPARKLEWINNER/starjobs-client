import {Link} from '@material-ui/core'
import QRCode from 'react-qr-code'
import {Grid, Card, Stack} from '@material-ui/core'

const {REACT_APP_CLIENT_URL} = process.env
const AccountQRCode = ({_data}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{p: 3}}>
          <Stack spacing={{xs: 2, md: 3}}>
            <QRCode value={`${REACT_APP_CLIENT_URL}/${_data._id}/login`} />
            <Link href={`${REACT_APP_CLIENT_URL}/${_data._id}/login`}>Go to link</Link>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AccountQRCode
