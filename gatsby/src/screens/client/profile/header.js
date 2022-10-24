import React from 'react'
import {Box, Stack, Grid, Typography} from '@mui/material'
import {Icon} from '@iconify/react'
import checkmark from '@iconify/icons-eva/checkmark-circle-2-fill'
import map from '@iconify/icons-eva/map-outline'
import envelope from '@iconify/icons-eva/email-outline'
import globe from '@iconify/icons-eva/globe-outline'

import MAvatar from 'components/@material-extend/MAvatar'

// theme
import color from 'theme/palette'

const image_bucket = process.env.REACT_APP_IMAGE_URL
const ProfileHeader = ({user}) => {
  return (
    <Stack
      direction={{xs: 'column', sm: 'column', md: 'row'}}
      sx={{
        zIndex: 999,
        mb: {sm: 3, xs: 3},
        mt: {xs: '-140px !important', sm: '0 !important', md: '0 !important'},
        width: '100%',
        alignItems: {md: 'flex-start', sm: 'center', xs: 'center'},
        px: '0 !important'
      }}
    >
      <Box
        sx={{
          mr: 1,
          display: 'flex',
          alignItems: {md: 'flex-start', sm: 'flex-start', xs: 'center'},
          px: {sm: 0, xs: 0},
          mb: 1
        }}
      >
        <MAvatar
          key={'Profile Picture'}
          alt="Picture"
          src={`${image_bucket}${user.photo}`}
          sx={{margin: '0 auto', width: 120, height: 120, backgroundColor: '#FFFFFF'}}
        />
      </Box>
      <Box sx={{my: 1, width: '100%'}}>
        <Grid container sx={{alignItems: 'center', mb: 1, width: '100%'}}>
          <Icon icon={checkmark} width={16} height={16} color={`${color.starjobs.main}`} />
          <Typography variant="body2" sx={{ml: 1, wordBreak: 'break-all', width: '200px'}}>
            {user.firstName} {user.middleInitial} {user.lastName}
          </Typography>
        </Grid>
        <Grid container sx={{alignItems: 'center', mb: 1, width: '100%'}}>
          <Icon icon={map} width={16} height={16} color={`${color.starjobs.main}`} />
          <Typography variant="body2" sx={{ml: 1, wordBreak: 'break-all', width: '200px'}}>
            {' '}
            {user.location}
          </Typography>
        </Grid>
        <Grid container sx={{alignItems: 'center', mb: 1, width: '100%'}}>
          <Icon icon={globe} width={16} height={16} color={`${color.starjobs.main}`} />
          <Typography variant="body2" sx={{ml: 1, wordBreak: 'break-all', width: '200px'}}>
            {' '}
            {user.website}
          </Typography>
        </Grid>
        <Grid container sx={{alignItems: 'center', mb: 1, width: '100%'}}>
          <Icon icon={envelope} width={16} height={16} color={`${color.starjobs.main}`} />
          <Typography variant="body2" sx={{ml: 1, wordBreak: 'break-all', width: '200px'}}>
            {user.email}
          </Typography>
        </Grid>
      </Box>
    </Stack>
  )
}

export default ProfileHeader
