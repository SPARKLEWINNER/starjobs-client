import {useEffect, useState, useContext} from 'react'
import {useParams} from 'react-router'
import moment from 'moment'
// material
import {Box, Stack, Typography, CardContent, Card} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'

// components
import Page from 'components/Page'
import LoadingScreen from 'components/LoadingScreen'
import Label from 'components/Label'

// api
import gigs_api from 'utils/api/gigs'
import {UsersContext} from 'utils/context/users'

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
  const {user} = useContext(UsersContext)

  const load = async () => {
    setLoading(true)
    if (!params.id) return setLoading(false)
    const request = await gigs_api.get_gig_details(params.id)
    if (!request.ok) return setLoading(false)

    console.log(user)
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
    <Page title="Gig Full details - Starjobs">
      <MainStyle
        alignItems="center"
        justify="center"
        sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}, width: '100%'}}
      >
        {isLoading && <LoadingScreen />}
        {!isLoading && (
          <Card sx={{py: 2, px: 3, display: 'flex', my: 2}}>
            <Box sx={{flexDirection: 'column', width: '100%', p: 0}}>
              <CardContent
                sx={{flex: '1 0 auto', px: 0, pt: 0, alignItems: 'flex-start', paddingBottom: '0 !important'}}
              >
                <Stack direction="row" sx={{alignItems: 'center', mb: 1}}>
                  <Typography variant="overline" sx={{fontWeight: 'bold'}}>
                    {gig.position}
                  </Typography>
                  <Label sx={{fontSize: 10, ml: 1}} color="info">
                    <span>&#8369;</span>
                    {/* {parseFloat(jobsterTotal).toFixed(2)} / {gig.type} */}
                  </Label>
                </Stack>

                <Typography variant="body2" sx={{fontSize: 13, mb: 0}}>
                  Location: {gig.location}
                </Typography>

                <Stack direction="row" sx={{my: 1}}>
                  <Typography variant="overline" color="default" sx={{fontSize: 10}}>
                    Start: {moment(gig.from).format('MMM-DD hh:mm A')}
                  </Typography>
                  <Typography variant="overline" color="default" sx={{fontSize: 10, ml: 2}}>
                    End: {moment(gig.time).format('MMM-DD hh:mm A')}
                  </Typography>
                </Stack>
                <Stack direction="row" className="d-flex p-0 align-item-center w-100">
                  <Label color="secondary" sx={{fontSize: 10}}>
                    {' '}
                    {gig.hours} {gig.category === 'parcels' ? 'parcels' : ' hrs shift'}{' '}
                  </Label>
                </Stack>

                {/* {users.accountType !== 1 && (
                  <Box sx={{position: 'absolute', bottom: 0, right: 16}}>
                    <Button
                      onClick={() => handleClick(gig)}
                      variant="contained"
                      sx={{textTransform: 'uppercase', fontWeight: 'bold', mb: 1, fontSize: '0.75rem'}}
                    >
                      Apply <Icon icon={arrowRight} width={12} height={12} sx={{ml: 2}} />
                    </Button>
                  </Box>
                )} */}
              </CardContent>
            </Box>
          </Card>
        )}
      </MainStyle>
    </Page>
  )
}

export default FullDetails
