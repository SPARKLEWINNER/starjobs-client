import {useEffect, useState} from 'react'
import {useParams} from 'react-router'
import moment from 'moment'

// material
import {Box, Stack, Typography, Card, Grid} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {CalendarTodayOutlined, LocationOnOutlined} from '@material-ui/icons'

// components
import Page from 'components/Page'
import LoadingScreen from 'components/LoadingScreen'
import Label from 'components/Label'
import {capitalCase} from 'change-case'

// api
import gigs_api from 'api/gigs'

// variables
const DRAWER_WIDTH = 280

const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const FullDetails = () => {
  const params = useParams()
  const [isLoading, setLoading] = useState(false)
  const [gig, setGigDetails] = useState([])

  const load = async () => {
    setLoading(true)
    if (!params.id) return setLoading(false)
    const request = await gigs_api.get_gig_details(params.id)
    if (!request.ok) return setLoading(false)

    setLoading(false)
    setGigDetails(request.data)
  }

  useEffect(
    () => {
      load()
    },
    // eslint-disable-next-line
    [],
  )

  return (
    <>
      {isLoading && <LoadingScreen />}
      {!isLoading && gig && (
        <Page title={`${gig.position} Gig - Starjobs`}>
          <Box
            sx={{
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" color="primary.main" sx={{fontWeight: 'bold', textAlign: 'center'}}>
              {capitalCase(gig.position)}
            </Typography>
          </Box>
          <MainStyle
            alignItems="center"
            justify="center"
            sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}, width: '100%'}}
          >
            <Box sx={{flexDirection: 'column', width: '100%', p: 0}}>
              <Card>
                <Grid container spacing={2}>
                  <Grid items xs={4}>
                    <CalendarTodayOutlined />
                  </Grid>
                  <Grid items xs={8}></Grid>
                  <Grid items xs={4}>
                    <LocationOnOutlined />
                  </Grid>
                  <Grid items xs={8}>
                    <Typography variant="body2" sx={{mb: 0}}>
                      {gig.location}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
              <Card sx={{flex: '1 0 auto', px: 0, pt: 0, alignItems: 'flex-start', paddingBottom: '0 !important'}}>
                <Stack sx={{my: 1}}>
                  <Typography variant="body2" color="default">
                    Start date & time: {moment(gig.from).format('MMM-DD hh:mm A')}
                  </Typography>
                  <Typography variant="body2" color="default">
                    End date & time: {moment(gig.time).format('MMM-DD hh:mm A')}
                  </Typography>
                </Stack>
                <Stack direction="row" className="d-flex p-0 align-item-center w-100">
                  <Label color="secondary" sx={{fontSize: 10}}>
                    {gig.hours} {gig.category === 'parcels' ? 'parcels' : ' hrs shift'}{' '}
                  </Label>
                </Stack>
              </Card>
            </Box>
          </MainStyle>
        </Page>
      )}
    </>
  )
}

export default FullDetails
