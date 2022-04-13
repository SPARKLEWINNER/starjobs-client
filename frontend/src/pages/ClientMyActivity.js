import {useEffect, useState} from 'react'
import moment from 'moment'

// material
import {Stack, Button, Box, Card, CardContent, Typography} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'

// components
import Page from '../components/Page'

// api
import user_api from 'api/users'
import storage from 'utils/storage'
import {calculations} from 'utils/gigComputation'

const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

const ClientMyActivity = () => {
  const [data, setData] = useState([])
  const [renderData, setRenderData] = useState([])
  const [renderLength, setRenderLength] = useState(3)

  const load = async () => {
    const local_user = await storage.getUser()
    if (!local_user) return

    const users = JSON.parse(local_user)

    const result = await user_api.get_user_activity_client(users._id)
    if (!result.ok) return

    let {data} = result.data
    data.sort((a, b) => (moment(a.date + ' ' + a.time) > moment(b.date + ' ' + b.time) ? 1 : -1))
    setData(data)
    if (data.length > 0) {
      setRenderData(data.slice(0, 5))
    }
  }

  const loadMore = () => {
    let renderCount = renderLength
    renderCount += 5
    setRenderLength(renderCount)
    setRenderData(data.slice(0, renderCount))
  }

  useEffect(
    () => {
      load()
    },
    // eslint-disable-next-line
    [],
  )

  useEffect(() => {
    data.length > 0 && setRenderData(data.slice(0, 5))
  }, [data])

  const renderCard = (v, index) => {
    if (!v) return ''

    v.fee = parseFloat(v.fee)
    let {serviceCost} = calculations(v.hours, v.fee, v.locationRate)
    const hrShift = parseInt(v.hours) > 1 ? v.hours + ' hrs' : v.hours + ' hr'

    return (
      <Card sx={{p: 0, display: 'flex', my: 1, backgroundColor: '#FFFFFF', boxShadow: 'none'}} key={index}>
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', py: 2}}>
          <CardContent sx={{flex: '1 0 auto', p: '0 !important', alignItems: 'flex-start'}}>
            <Stack direction="row" sx={{alignItems: 'center', p: 0, width: '100%', mt: 1}}>
              <Box
                component="img"
                src="/static/illustrations/my-activity-icon.png"
                sx={{width: 48, objectFit: 'contain', mr: 2, float: 'left', color: '#ff2c2c'}}
              />
              <Stack direction="row" sx={{width: '80%'}}>
                <Box sx={{position: 'relative', width: '100%'}}>
                  <Typography variant="h6" sx={{fontWeight: '400', wordBreak: 'break-word', width: '200px'}}>
                    {v.position}
                  </Typography>
                  <Box>
                    <Typography variant="caption" sx={{fontWeight: '400', wordBreak: 'break-word', width: '200px'}}>
                      Date posted: {moment(v.date).format('DD MMM  YYYY')}
                    </Typography>
                  </Box>
                  <Typography variant="caption">{moment(v.time).format('DD MMM  YYYY hh:mm A')}</Typography>
                  <Box sx={{position: 'absolute', right: 0, top: 0}}>
                    <Typography variant="body1" sx={{fontWeight: '600'}}>
                      ₱ {serviceCost.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">({hrShift})</Typography>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    )
  }

  return (
    <Page title="My Activity |  Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        <Stack direction={{xs: 'column', md: 'column'}} sx={{marginBottom: 30}}>
          {renderData &&
            renderData.map((v, k) => {
              return renderCard(v, k)
            })}
          {data.length > 5 && data.length !== renderLength && (
            <Button variant="text" onClick={() => loadMore()} sx={{mt: 5}}>
              Load more
            </Button>
          )}
        </Stack>
      </MainStyle>
    </Page>
  )
}

export default ClientMyActivity
