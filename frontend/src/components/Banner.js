import {useLocation} from 'react-router-dom'
// material
import {styled} from '@mui/material/styles'

const APPBAR_DESKTOP = 92
const InfoStyle = styled('div')(({theme}) => ({
  zIndex: 99,
  position: 'absolute',
  overflow: 'hidden',
  left: 0,
  right: 0,
  top: 0,
  width: '100%',
  backgroundColor: '#000',
  padding: 0,
  marginTop: APPBAR_DESKTOP,
  height: '200px',
  [theme.breakpoints.up('lg')]: {
    height: '200px'
  },
  [theme.breakpoints.up('xs')]: {
    marginTop: 0
  }
}))

const CoverImgStyle = styled('img')({
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.5
})

export default function Banner({cover, title, button}) {
  let {pathname} = useLocation()
  return (
    <InfoStyle>
      {pathname !== '/freelancer/profile' ? '' : ''}
      <CoverImgStyle alt="profile cover" src="/static/illustrations/profile-banner.jpg" />
    </InfoStyle>
  )
}
