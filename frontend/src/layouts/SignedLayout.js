import {Outlet} from 'react-router-dom'

// material
import PullToRefresh from 'react-simple-pull-to-refresh'
import {styled} from '@mui/material/styles'

// components
import FixedBottomNavigation from 'src/components/BottomNavigation'

// variables
const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 92

// styles
const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  backgroundColor: '#f8fbfb'
})

const MainStyle = styled('div')(({theme}) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  margin: '0 auto',
  paddingTop: APP_BAR_MOBILE + 24,
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}))

export default function SignedLayout() {
  const handleRefresh = () => {
    window.location.reload()
  }
  return (
    <RootStyle>
      <MainStyle>
        <PullToRefresh onRefresh={handleRefresh}>
          <Outlet />
        </PullToRefresh>
        <FixedBottomNavigation />
      </MainStyle>
    </RootStyle>
  )
}
