import React, {useEffect, useState} from 'react'
import {useParams} from '@reach/router'
import moment from 'moment'

// material
import {Box, Stack, Typography, Card, Grid} from '@mui/material'
import {styled} from '@mui/material/styles'
import {CalendarTodayOutlined, LocationOnOutlined, AccessTime, AccessAlarm, Timelapse, Paid} from '@mui/icons-material'

// components
import Page from 'components/Page'
import LoadingScreen from 'components/LoadingScreen'
import {capitalCase} from 'change-case'

// api
import gigs_api from 'libs/endpoints/gigs'
import {calculations} from 'utils/gigComputation'

// variables
const DRAWER_WIDTH = 280

const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

const FullDetails = () => {
  const params = useParams()
  const [isLoading, setLoading] = useState(false)
  const [gig, setGigDetails] = useState([])
  const [jobsterFee, setJobsterFee] = useState(null)

  useEffect(
    () => {
      let componentMounted = true
      const load = async () => {
        setLoading(true)
        if (!params.id) return setLoading(false)
        const request = await gigs_api.get_gig_details(params.id)
        if (!request.ok) return setLoading(false)

        if (componentMounted) {
          let {hours, fee, locationRate} = request.data
          fee = parseFloat(fee)
          let {jobsterTotal: calculatedFee} = calculations(hours, fee, locationRate)

          setLoading(false)
          setJobsterFee(calculatedFee)
          setGigDetails(request.data)
        }
      }

      load()
      return () => {
        componentMounted = false
      }
    },
    // eslint-disable-next-line
    []
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
              flexDirection: 'column'
            }}
          >
            <Typography variant="h4" color="primary.main" sx={{fontWeight: 'bold', textAlign: 'center'}}>
              {gig && gig?.position && capitalCase(gig.position)}
            </Typography>

            <Stack direction="row" alignItems="center">
              <Typography variant="body2" sx={{mb: 0, fontWeight: 400}}>
                Posted by:
              </Typography>
              <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold', ml: 1}}>
                {gig && gig?.user && gig?.user.length > 0 && capitalCase(gig?.user[0].companyName)}
              </Typography>
            </Stack>
          </Box>
          <MainStyle
            alignItems="center"
            justify="center"
            sx={{my: 1, paddingLeft: {xs: 3}, paddingRight: {xs: 3}, width: '100%'}}
          >
            <Box sx={{flexDirection: 'column', width: '100%', p: 0}}>
              <Card sx={{borderRadius: 1, mb: 2, px: 2, py: 2}}>
                <Grid container spacing={2}>
                  <Grid item xs={2} sx={{textAlign: 'center'}}>
                    <CalendarTodayOutlined />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold'}}>
                      {gig && gig?.dateCreated && moment(gig.dateCreated).format('MMMM DD,YYYY')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{textAlign: 'center'}}>
                    <LocationOnOutlined />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold'}}>
                      {gig && gig?.user && gig?.user.length > 0 && capitalCase(gig?.user[0].location)}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
              <Card
                sx={{
                  flex: '1 0 auto',
                  px: 2,
                  py: 4,
                  borderRadius: 1,
                  alignItems: 'flex-start'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={2} sx={{textAlign: 'center'}}>
                    <AccessTime />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold'}}>
                      {gig && gig?.from && moment(gig.from).format('MMMM DD,YYYY hh:mm A')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{textAlign: 'center'}}>
                    <AccessAlarm />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold'}}>
                      {gig && gig?.time && moment(gig.time).format('MMMM DD,YYYY hh:mm A')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{textAlign: 'center'}}>
                    <Timelapse />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold'}}>
                      {gig && gig?.hours && parseFloat(gig.hours).toFixed(0)}{' '}
                      {gig && gig.category === 'parcels' ? 'parcels' : ' hrs shift'}{' '}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{textAlign: 'center'}}>
                    <Paid />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body2" sx={{mb: 0, fontWeight: 'bold'}}>
                      {gig && gig?.fee && parseFloat(jobsterFee).toFixed(2)} / hour
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </MainStyle>
        </Page>
      )}
    </>
  )
}

export default FullDetails
