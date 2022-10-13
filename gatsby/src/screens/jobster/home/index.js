import React, {useState, useEffect} from 'react'
import {Link as RouterLink} from '@reach/router'

import moment from 'moment'
import {useSnackbar} from 'notistack'

// material
import {Link, Grid, Typography, Box, Avatar, Stack} from '@mui/material'
// import {TabContext, TabList, TabPanel} from '@mui/lab'
import {styled} from '@mui/material/styles'

// components
import Page from 'components/Page'

import PromotionsBanner from 'components/promotions'
import {IncomingNotification, ConfirmArrivedNotification} from 'components/notifications'

// api
import gigs_api from 'api/endpoints/gigs'
import category_api from 'api/endpoints/category'

// theme
import color from 'theme/palette'
import {useAuth} from 'contexts/AuthContext'

import BrandLogo from 'assets/static/favicon/starjobs-outline.png'
import HomeBanner from 'assets/static/home-banner.png'

// Banner
import BannerOne from 'assets/static/home/banner/jobster/banner-one.png'
import BannerTwo from 'assets/static/home/banner/jobster/banner-two.png'
import BannerThree from 'assets/static/home/banner/jobster/banner-three.png'
import BannerFour from 'assets/static/home/banner/jobster/banner-four.png'

// variables
const DRAWER_WIDTH = 280
// styles
const MainStyle = styled(Stack)(({theme}) => ({
  marginTop: '0',
  marginBottom: '280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}))

const TabStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

const BannerStyle = styled(Stack)(({theme}) => ({
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100%',
  backgroundPosition: '100% -110%',
  height: 170,
  alignItems: 'center',
  marginBottom: 24,
  [theme.breakpoints.up('lg')]: {}
}))

const mockBanner = [
  {
    title: 'banner-one',
    image: BannerOne
  },
  {
    title: 'banner-two',
    image: BannerTwo
  },
  {
    title: 'banner-three',
    image: BannerThree
  },
  {
    title: 'banner-four',
    image: BannerFour
  }
]

const Dashboard = () => {
  const {currentUser} = useAuth()
  const {enqueueSnackbar} = useSnackbar()
  const [gigPop, setGigPop] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmArrivedOpen, setConfirmArrivedOpen] = useState(false)
  const [category, setCategory] = useState([
    {
      initial: [],
      dynamic: []
    }
  ])

  useEffect(() => {
    const load = async () => {
      const result = await gigs_api.get_gigs_client()
      if (!result.ok) {
        enqueueSnackbar('Unable to load your Gig History', {variant: 'error'})
        return
      }

      const data = result.data.gigs.sort((a, b) =>
        moment(a.date + ' ' + a.time) > moment(b.date + ' ' + b.time) ? 1 : -1
      )

      const CATEGORY_RESULT = await category_api.get_categories()
      if (!CATEGORY_RESULT.ok) return
      let category_data = CATEGORY_RESULT.data
        .sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
        .filter((obj) => obj.status !== 1)
      setCategory({initial: category_data, dynamic: category_data})
      checkNotice(data)
    }

    load()

    // eslint-disable-next-line
  }, [])

  const checkNotice = (data) => {
    const arrived = data.filter((obj) => obj['status'].includes('Arrived'))
    if (!arrived) return
    Object.values(arrived).forEach((value) => {
      if (value.uid !== currentUser._id) return
      if (moment(value.date).isBefore(moment(), 'day')) return
      if (moment(value.date).isSame(moment(), 'day')) {
        handleNotice(value)
        setGigPop(value)
      }
    })
  }

  const handleNotice = (value) => {
    if (value.status === 'Arrived') {
      setConfirmArrivedOpen(true)
    }
  }

  const handleNoticeClose = () => {
    setOpen(false)
  }

  const handleAccepted = async (value) => {
    let form_data = {
      status: value.new_status,
      uid: currentUser._id
    }

    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }

    enqueueSnackbar('Success informing the client you are pushing through', {variant: 'success'})
    setOpen(false)
    window.location.reload()
  }

  const handleCancelled = async (value) => {
    let form_data = {
      status: value.new_status,
      uid: currentUser._id
    }

    const result = await gigs_api.patch_gigs_apply(value._id, form_data)
    if (!result.ok) {
      enqueueSnackbar('Something went wrong with the actions request', {variant: 'error'})
      return
    }

    enqueueSnackbar('Success informing the client that you are not pushing through', {variant: 'success'})
    setOpen(false)
    window.location.reload()
  }

  return (
    <Page title="Jobster Dashboard |  Starjobs">
      <BannerStyle direction="row" sx={{backgroundImage: `url(${HomeBanner})`}}>
        <Box sx={{width: '80%', paddingLeft: {xs: 3}}}>
          <Typography variant="body2" sx={{letterSpacing: 'initial', color: 'common.black', mt: 4}}>
            Hello
          </Typography>
          <Typography variant="body1" sx={{fontWeight: 'bold', color: 'common.black', letterSpacing: 'initial'}}>
            <div id="jobsterName">{currentUser.name}</div>
          </Typography>
          <Box component="div" sx={{mb: 8}} />
        </Box>
        <Box sx={{justifyContent: 'center', mr: 2}}>
          <Avatar
            key={'Profile Picture'}
            alt="Picture"
            src={BrandLogo}
            sx={{
              margin: '0 auto',
              width: 100,
              height: 100,
              borderRadius: '0 !important ',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        </Box>
      </BannerStyle>
      <MainStyle sx={{paddingLeft: {xs: 3}, paddingRight: {xs: 3}, justifyContent: 'flex-start'}}>
        <TabStyle>
          <Stack direction={{xs: 'column', sm: 'column'}} sx={{my: 1}} spacing={2}>
            {/* Search by Category */}
            <Box>
              <Stack direction="row" sx={{alignItems: 'center', mb: 2}}>
                <Typography
                  variant="h6"
                  sx={{borderLeft: `4px solid ${color.starjobs.main}`, textIndent: 16, flexGrow: 1}}
                >
                  Search by Category
                </Typography>
                <Link
                  underline="none"
                  component={RouterLink}
                  to={`${currentUser.accountType === 1 ? '/client' : '/freelancer'}/search`}
                  sx={{textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem'}}
                  color="starjobs.main"
                >
                  See more
                </Link>
              </Stack>
              <Grid container>
                {category.dynamic &&
                  category.dynamic.map((v, k) => {
                    return (
                      v.status !== 1 && (
                        <Grid item xs={6} sx={{textAlign: 'center', justifyContent: 'center', my: 1}} key={k}>
                          <Link
                            underline="none"
                            key={k}
                            component={RouterLink}
                            to={v.status === 1 ? `#` : `/gigs/${v.slug}`}
                            sx={{textAlign: 'center', display: 'block', mx: 1}}
                          >
                            <Box
                              component="img"
                              src={v.image}
                              alt={v.name.replace(' ', '-')}
                              sx={{
                                height: 55,
                                width: 55,
                                mx: 'auto',
                                my: 1,
                                borderRadius: 30,
                                backgroundColor: 'starjobs.main',
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                            />
                            <Typography variant="caption" sx={{fontWeight: 400, color: 'common.black', flexGrow: 1}}>
                              {v.name}
                            </Typography>
                          </Link>
                        </Grid>
                      )
                    )
                  })}
              </Grid>
            </Box>

            {/* News and Promotion */}
            <Stack sx={{py: 4}}>
              <Stack direction="row" sx={{alignItems: 'center', mb: 2}}>
                <Typography
                  variant="h6"
                  sx={{flexGrow: 1, borderLeft: `4px solid ${color.starjobs.main}`, textIndent: 16}}
                >
                  News and Promotions
                </Typography>
              </Stack>

              <PromotionsBanner banners={mockBanner} />
            </Stack>
          </Stack>

          <ConfirmArrivedNotification
            open={confirmArrivedOpen}
            handleClose={handleNoticeClose}
            gig={gigPop}
            onCommit={handleAccepted}
            onReject={handleCancelled}
          />

          <IncomingNotification
            open={open ?? false}
            handleClose={handleNoticeClose}
            gig={gigPop}
            onCommit={handleAccepted}
            onReject={handleCancelled}
          />
        </TabStyle>
      </MainStyle>
    </Page>
  )
}

export default Dashboard