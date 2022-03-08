// react
import {useContext} from 'react'

// material
import {Stack} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'

// components
import Page from 'components/Page'
import DocumentsForm from './form'
// context
import {UsersContext} from 'utils/context/users'

const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const EditDocument = () => {
  const {user} = useContext(UsersContext)

  return (
    <Page title="Edit Documents - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        {user.accountType === 1 && <DocumentsForm />}
      </MainStyle>
    </Page>
  )
}

export default EditDocument
