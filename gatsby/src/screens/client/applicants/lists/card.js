import {Icon} from '@iconify/react'
import {Link as RouterLink} from '@reach/router'
import map from '@iconify/icons-eva/map-outline'
// material
import {alpha, styled} from '@mui/material/styles'
import {Box, Stack, Card, Avatar, Button, Typography, Link} from '@mui/material'
import PropTypes from 'prop-types'

const IconWrapperStyle = styled('div')(({theme}) => ({
  width: 200,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.starjobs.main,
  position: 'absolute',
  bottom: '1rem',
  right: '1rem',
  backgroundColor: alpha(theme.palette.starjobs.main, 0.08)
}))

export default function ApplicantCard({data, onClick, gigDetails}) {
  if (!data && data.length === 0) return ''

  const handleAccept = (value) => {
    onClick(value)
  }

  let applicant_id = data && data.uid
  if (gigDetails.isExtended) {
    data.gid = gigDetails._id
    applicant_id = data && data.auid
  }

  return (
    <>
      {data && (
        <Card sx={{my: 1, px: 2, py: 2, height: '160px'}}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={`${data && data.firstName} ${data && data.lastName}`}
              src={data && data.photo}
              sx={{borderRadius: '4px', height: '60px', width: '60px', objectFit: 'cover'}}
            />
            <Box sx={{flexGrow: 1}}>
              <Link
                underline="none"
                component={RouterLink}
                to={`/client/gigs/applicant/profile/${data.uuid}/${data.gid}`}
                sx={{cursor: 'pointer'}}
              >
                <Typography variant="body1">{`${data && data.firstName} ${data && data.lastName}`}</Typography>
              </Link>
              <Typography
                variant="body1"
                sx={{
                  mt: 0.25,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary'
                }}
              >
                <Box component={Icon} icon={map} sx={{width: 16, height: 16, mr: 0.5}} />
                {data && data.presentCity}
              </Typography>
            </Box>

            <IconWrapperStyle>
              <Button variant="contained" fullWidth onClick={() => handleAccept(applicant_id)}>
                Accept
              </Button>

              <Button variant="outlined" sx={{ml: 2, px: 3}}>
                Decline
              </Button>
            </IconWrapperStyle>
          </Stack>
        </Card>
      )}
    </>
  )
}

ApplicantCard.propTypes = {
  data: PropTypes.object,
  gigDetails: PropTypes.object,
  onClick: PropTypes.func
}
