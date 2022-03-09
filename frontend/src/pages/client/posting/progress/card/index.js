import React from 'react'
import {Icon} from '@iconify/react'
import {capitalCase} from 'change-case'
import {Link as RouterLink} from 'react-router-dom'
import map from '@iconify/icons-eva/map-outline'
// material
import {Box, Stack, Card, Avatar, Typography, Link} from '@material-ui/core'
// component
import Label from 'components/Label'
// import {getUser} from 'utils/hooks/auth'
// import useSendNotif from 'utils/hooks/useSendNotif'

const image_url = process.env.REACT_APP_IMAGE_URL
export default function FreelancerCard({data, onClick, onClickApplicantId}) {
  // const [isSendingInterest, setIsSendingInterest] = useState(false)
  // const {sendInterestNotification} = useSendNotif()

  // let user = JSON.parse(getUser())

  // const sendInterest = async () => {
  //   setIsSendingInterest(true)
  //   await sendInterestNotification({clientId: user._id, clientName: user.name, targetUsers: [data.uuid]})
  //   setIsSendingInterest(false)
  // }

  return (
    <Card sx={{my: 1, px: 2, py: 2}}>
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        <Avatar
          alt={`${data.firstName} ${data.middleInitial} ${data.lastName}`}
          src={`${image_url}${data.photo}`}
          sx={{borderRadius: '4px', height: '60px', width: '60px', objectFit: 'cover'}}
        />
        <Box sx={{flexGrow: 1}}>
          <Link underline="none" component={RouterLink} to={`/client/jobster/${data.uuid}`} sx={{cursor: 'pointer'}}>
            <Typography
              variant="body1"
              sx={{
                color: 'common.black',
                fontWeight: 'bold',
                fontSize: '0.85rem !important',
                wordBreak: 'break-all',
                width: '200px',
              }}
            >
              <Box component={Icon} icon={map} sx={{width: 16, height: 16, mr: 0.5}} />
              {capitalCase(data.presentCity)}
            </Typography>

            <Box>
              {data.expertise.skillOffer &&
                data.expertise.skillOffer.split('=>').map((v, k) => {
                  return <Label color="default">{v}</Label>
                })}
            </Box>
          </Link>
        </Box>
      </Stack>
    </Card>
  )
}
