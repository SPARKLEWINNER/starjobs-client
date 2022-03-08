import {useState, useContext, useEffect} from 'react'
// material
import {Stack, Tab} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {makeStyles} from '@material-ui/styles'
import {TabContext, TabList, TabPanel} from '@material-ui/lab'

// components
import Page from 'components/Page'
import LoadingScreen from 'components/LoadingScreen'
import GigForm from './form'
import GigProgress from './progress'

import {UsersContext} from 'utils/context/users'

const DRAWER_WIDTH = 280
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const useStyles = makeStyles({
  nav_item: {
    width: '48%',
    maxWidth: '48%',
    textTransform: 'uppercase',
    margin: '0 4px',
    borderRadius: '8px',
    minHeight: '42px',
    '@media (max-width: 500px)': {
      width: '48%',
      maxWidth: 'auto',
      padding: '6px 0',
      margin: '0 3px',
      fontSize: 12,
    },
    '@media (max-width: 475px)': {
      fontSize: 11,
    },
  },
})

const SIMPLE_TAB = [
  {value: 2, label: 'Create a Gig', disabled: false},
  {value: 1, label: 'Gigs Progress', disabled: false},
]

const GigPosting = () => {
  const classes = useStyles()
  const [value, setValue] = useState('1')
  const {user} = useContext(UsersContext)
  const [isLoading, setLoading] = useState(true)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    setLoading(false)
  }, [user])

  const renderGigForm = () => {
    return <GigForm />
  }

  const renderTab = (type) => {
    if (type === 1) return <GigProgress />
    return renderGigForm()
  }

  return (
    <Page title="Post a Gig - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 0, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        {isLoading && <LoadingScreen />}

        <TabContext value={value}>
          <TabList onChange={handleChange} fullWidth>
            {SIMPLE_TAB.map((tab, index) => (
              <Tab className={classes.nav_item} key={tab.value} label={tab.label} value={String(index + 1)} />
            ))}
          </TabList>
          {SIMPLE_TAB.map((panel, index) => (
            <TabPanel key={panel.value} value={String(index + 1)} sx={{p: '0 !important'}}>
              {renderTab(panel.value)}
            </TabPanel>
          ))}
        </TabContext>
      </MainStyle>
    </Page>
  )
}

export default GigPosting
