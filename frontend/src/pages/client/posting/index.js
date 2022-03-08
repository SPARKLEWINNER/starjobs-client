import {useState, useContext, useEffect} from 'react'
import {Link as RouterLink} from 'react-router-dom'
// material
import {Stack, Box, Tab, Link, Button, Typography} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import {makeStyles} from '@material-ui/styles'
import {TabContext, TabList, TabPanel} from '@material-ui/lab'

// components
import Page from 'components/Page'
import CreatGigForm from './gigs'
import CreateParcelForm from './parcel'
import LoadingScreen from 'components/LoadingScreen'

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
    border: '1px solid #727272',
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
    '&.Mui-selected': {
      backgroundColor: '#FF3030',
      border: 'none',
      color: '#FFF',
    },
  },
})

const SIMPLE_TAB = [
  {value: 2, label: 'Gig form', disabled: false},
  {value: 1, label: 'Parcel form', disabled: false},
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

  const renderTab = (type) => {
    if (type === 1) return <CreateParcelForm />
    return <CreatGigForm />
  }

  return (
    <Page title="Post a Gig - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        {isLoading && <LoadingScreen />}
        {user.isActive && (
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
        )}
        {!isLoading && !user.isActive && (
          <Box
            sx={{
              height: {sm: '50vh', xs: '65vh'},
              width: {sm: '50%', xs: '100%'},
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{padding: {xs: 3}}}>
              <Typography variant="h4" sx={{textAlign: 'center'}}>
                You haven't completed your profile details.
              </Typography>
              <Box
                component="img"
                src="/static/illustrations/profile-not-active.png"
                sx={{height: 'auto', width: {xs: '100%'}, mx: 'auto', my: {xs: 5, sm: 5}}}
              />
              <Link
                component={RouterLink}
                sx={{textDecoration: 'none', width: '100%', display: 'block'}}
                to={user.accountType === 1 ? '/client/onboard' : '/freelancer/onboard'}
              >
                <Button variant="contained" sx={{width: '100%'}} size="large">
                  Complete my details
                </Button>
              </Link>
            </Box>
          </Box>
        )}
      </MainStyle>
    </Page>
  )
}

export default GigPosting
