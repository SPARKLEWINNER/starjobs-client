import {Icon} from '@iconify/react'
import {Link as RouterLink} from 'react-router-dom'
import map from '@iconify/icons-eva/map-outline'
// material
import {alpha, styled} from '@material-ui/core/styles'
import {Box, Stack, Card, Avatar, Button, Typography, Link} from '@material-ui/core'

const IconWrapperStyle = styled('div')(({theme}) => ({
  width: 200,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  position: 'absolute',
  bottom: '1rem',
  right: '1rem',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
}))

export default function ApplicantCard({data, onClick, onClickApplicantId}) {
  console.log(data)
  const handleAccept = (value) => {
    onClick(value)
  }

  return (
    <Card sx={{my: 1, px: 2, py: 2, height: '160px'}}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          alt={`${data.firstName} ${data.middleInitial} ${data.lastName}`}
          src={data.photo}
          sx={{borderRadius: '4px', height: '60px', width: '60px', objectFit: 'cover'}}
        />
        <Box sx={{flexGrow: 1}}>
          <Link
            underline="none"
            component={RouterLink}
            to={`/client/gigs/applicant/profile/${data.uuid}/${data.gid}`}
            sx={{cursor: 'pointer'}}
          >
            <Typography variant="body1">{`${data.firstName} ${data.middleInitial} ${data.lastName}`}</Typography>
          </Link>
          <Typography
            variant="body1"
            sx={{
              mt: 0.25,
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
            }}
          >
            <Box component={Icon} icon={map} sx={{width: 16, height: 16, mr: 0.5}} />
            {data.presentCity}
          </Typography>
        </Box>

        <IconWrapperStyle>
          <Button variant="contained" fullWidth onClick={() => handleAccept(data.uid)}>
            Accept
          </Button>

          <Button variant="outlined" sx={{ml: 2, px: 3}}>
            Decline
          </Button>
        </IconWrapperStyle>
      </Stack>
    </Card>
  )
}
