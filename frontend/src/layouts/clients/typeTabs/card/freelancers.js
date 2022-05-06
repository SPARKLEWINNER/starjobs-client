import {Icon} from '@iconify/react'
import {Link as RouterLink} from 'react-router-dom'
import map from '@iconify/icons-eva/map-outline'
// material
import {Box, Stack, Card, Avatar, Typography, Link} from '@mui/material'
// component
import Label from 'src/components/Label'

const image_url = process.env.REACT_APP_IMAGE_URL
export default function FreelancerCard({data, onClick, onClickApplicantId}) {
  return (
    <Link underline="none" component={RouterLink} to={`/client/jobster/${data.uuid}`} sx={{cursor: 'pointer'}}>
      <Card sx={{my: 1, px: 2, py: 2, height: 'auto'}}>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Avatar
            alt={`${data.firstName} ${data.middleInitial} ${data.lastName}`}
            src={`${image_url}${data.photo}`}
            sx={{borderRadius: '4px', height: '60px', width: '60px', objectFit: 'cover'}}
          />
          <Box sx={{flexGrow: 1}}>
            <Typography
              variant="body1"
              sx={{color: 'starjobs.main', fontSize: '0.85rem !important'}}
            >{`${data.firstName} ${data.middleInitial} ${data.lastName}`}</Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 0.25,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.85rem !important'
              }}
            >
              <Box component={Icon} icon={map} sx={{width: 16, height: 16, mr: 0.5}} />
              {data.presentCity}
            </Typography>

            <Box>
              {data.expertise.skillOffer &&
                data.expertise.skillOffer.split('=>').map((v, k) => {
                  return <Label color="default">{v}</Label>
                })}
            </Box>
          </Box>
        </Stack>
      </Card>
    </Link>
  )
}
