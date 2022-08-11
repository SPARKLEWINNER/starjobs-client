import {useLayoutEffect, useRef} from 'react'
import {Link as RouterLink, useLocation} from 'react-router-dom'
import moment from 'moment'
import {capitalCase} from 'change-case'

// material
import {Box, Card, CardContent, Button, Link, Typography, Stack} from '@mui/material'

// icons
import {Icon} from '@iconify/react'
import arrowRight from '@iconify/icons-eva/arrow-circle-right-outline'

// components
import Label from 'src/components/Label'

import {calculations} from 'src/utils/gigComputation'

import PropTypes from 'prop-types'

const ApplyCard = ({path, gig, currentUser, onClick}) => {
  const myRef = useRef(null)
  const params = useLocation()

  useLayoutEffect(() => {
    if (params.hash) {
      myRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [])

  let {position, hours, fee, user, time, from, category, uid, _id, locationRate} = gig
  const isApplied =
    gig.applicants &&
    gig.applicants.length > 0 &&
    gig.applicants.filter((obj) => {
      if (obj.uid === currentUser._id && obj.status === 'Applying') return true
      return false
    })

  const {location} = user[0]
  const type = category === 'parcels' ? 'parcels' : 'gig'

  fee = parseFloat(fee)
  let {jobsterTotal} = calculations(hours, fee, locationRate)

  const handleClick = (values) => {
    onClick(values)
  }

  return (
    <Card
      sx={{
        py: 3,
        px: 3,
        display: 'flex',
        my: 2,
        border: '2px solid',
        borderColor: params?.hash?.replace('#', '') === gig._id ? 'primary.main' : 'common.white'
      }}
      id={gig._id}
      ref={myRef}
    >
      <Box id="applyContainer" sx={{display: 'flex', flexDirection: 'column', width: '100%', p: 0}}>
        <CardContent sx={{flex: '1 0 auto', px: 0, pt: 0, alignItems: 'flex-start', paddingBottom: '0 !important'}}>
          <Stack direction="row" sx={{alignItems: 'center', mb: 1}}>
            <Typography variant="overline" sx={{fontWeight: 'bold'}}>
              {path.split('/')[1] === '/gigs' ? (
                <Link underline="none" component={RouterLink} to={`/client/details/${uid}`}>
                  {position}
                </Link>
              ) : (
                <Link underline="none" component={RouterLink} to={`/gigs/det/${_id}`}>
                  {position}
                </Link>
              )}
            </Typography>
            <Label sx={{fontSize: 10, ml: 1}} color="info">
              <span>&#8369;</span>
              {parseFloat(jobsterTotal).toFixed(2)} / {type}
            </Label>
          </Stack>

          <Typography variant="body2" sx={{fontSize: 13, mb: 0}}>
            Location:{' '}
            {gig && type !== 'parcels'
              ? gig.location
                ? capitalCase(gig.location)
                : capitalCase(location)
              : capitalCase(location)}
          </Typography>

          <Stack direction="row" sx={{my: 1}}>
            <Typography variant="overline" color="default" sx={{fontSize: 10}}>
              Start: {moment(from).format('MMM-DD hh:mm A')}
            </Typography>
            <Typography variant="overline" color="default" sx={{fontSize: 10, ml: 2}}>
              End: {moment(time).format('MMM-DD hh:mm A')}
            </Typography>
          </Stack>
          <Stack direction="row" className="d-flex p-0 align-item-center w-100">
            <Label color="secondary" sx={{fontSize: 10}}>
              {' '}
              {hours} {category === 'parcels' ? 'parcels' : ' hrs shift'}{' '}
            </Label>
          </Stack>
          {currentUser.isActive && currentUser.accountType !== 1 && (
            <Box sx={{textAlign: 'right'}}>
              {!isApplied ? (
                <Button
                  id="apply"
                  onClick={() => handleClick(gig)}
                  variant="contained"
                  sx={{textTransform: 'uppercase', fontWeight: 'bold', mb: 1, fontSize: '0.75rem'}}
                >
                  Apply <Icon icon={arrowRight} width={12} height={12} sx={{ml: 2}} />
                </Button>
              ) : (
                <>
                  <Typography
                    variant="overline"
                    component="h6"
                    color="common.black"
                    sx={{mb: 1, mr: 1, textAlign: 'right'}}
                  >
                    For client review
                  </Typography>
                  <Link underline="none" component={RouterLink} to="/freelancer/dashboard?tab=3">
                    <Button
                      id="viewGigInProgressButton"
                      fullWidth={true}
                      variant="contained"
                      sx={{mb: 1, mr: 1, textTransform: 'uppercase'}}
                    >
                      View gig in progress
                    </Button>
                  </Link>
                </>
              )}
            </Box>
          )}

          {!currentUser.isActive && currentUser.accountType !== 1 && (
            <Box sx={{position: 'absolute', bottom: 10, right: 16, textAlign: 'right'}}>
              <Link
                sx={{textDecoration: 'none'}}
                component={RouterLink}
                to={user.accountType === 1 ? '/client/onboard' : '/freelancer/onboard'}
              >
                <Button
                  id="apply"
                  variant="contained"
                  sx={{textTransform: 'uppercase', fontWeight: 'bold', mb: 1, fontSize: '0.75rem'}}
                >
                  Apply <Icon icon={arrowRight} width={12} height={12} sx={{ml: 2}} />
                </Button>
              </Link>
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  )
}

ApplyCard.propTypes = {
  path: PropTypes.string,
  gig: PropTypes.object,
  currentUser: PropTypes.object,
  onClick: PropTypes.func
}

export default ApplyCard
