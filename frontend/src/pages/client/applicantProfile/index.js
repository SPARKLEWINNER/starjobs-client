// material
import {Stack} from '@mui/material'
import {styled} from '@mui/material/styles'

// components
import Page from 'src/components/Page'
import FreelancerProfileTab from 'src/pages/client/applicants/profile'

const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

const ApplicantProfile = () => {
  return (
    <Page title="Applicants Profile - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        <FreelancerProfileTab />
      </MainStyle>
    </Page>
  )
}

export default ApplicantProfile
