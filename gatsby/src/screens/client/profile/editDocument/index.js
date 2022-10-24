// material
import {Stack} from '@mui/material'
import {styled} from '@mui/material/styles'

// components
import Page from 'src/components/Page'
import DocumentsForm from './form'
// context
import {useAuth} from 'src/contexts/AuthContext'

const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

const EditDocument = () => {
  const {currentUser} = useAuth()

  return (
    <Page title="Edit Documents - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        {currentUser.accountType === 1 && <DocumentsForm />}
      </MainStyle>
    </Page>
  )
}

export default EditDocument
