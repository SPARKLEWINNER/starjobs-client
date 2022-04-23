import React, {useState} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import PropTypes from 'prop-types'

// icons
import {Icon} from '@iconify/react'
import map from '@iconify/icons-eva/map-outline'

// material
import {Box, Stack, Card, Avatar, Typography, Link, Button} from '@mui/material'
// component
import Label from 'src/components/Label'

// hooks
import {getUser} from 'src/utils/hooks/auth'
import useSendNotif from 'src/utils/hooks/useSendNotif'

// variables
const image_url = process.env.REACT_APP_IMAGE_URL

const FreelancerCard = ({data}) => {
  const [isSendingInterest, setIsSendingInterest] = useState(false)

  const {sendInterestNotification} = useSendNotif()

  let user = JSON.parse(getUser())

  const sendInterest = async () => {
    setIsSendingInterest(true)
    await sendInterestNotification({clientId: user._id, clientName: user.name, targetUsers: [data.uuid]})
    setIsSendingInterest(false)
  }

  return (
    <Card sx={{my: 1, px: 2, py: 2}} key={data._id}>
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
                width: '200px'
              }}
            >{`${data.firstName} ${data.lastName}`}</Typography>
          </Link>

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
                return (
                  <Label color="default" key={`label-${k}`}>
                    {v}
                  </Label>
                )
              })}
          </Box>
          {user.accountType === 1 && (
            <Box
              sx={{
                mt: 0.85,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                color: 'text.secondary'
              }}
            >
              <Button
                variant="text"
                sx={{
                  zIndex: '999',
                  fontSize: '0.75rem'
                }}
                onClick={() => [sendInterest()]}
              >
                {isSendingInterest ? 'Sending...' : 'Send interest'}
              </Button>
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  )
}

FreelancerCard.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
  onClickApplicantId: PropTypes.func
}

export default FreelancerCard
