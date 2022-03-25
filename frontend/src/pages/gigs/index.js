import {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
// material
import {Box, Tab, Stack} from '@material-ui/core'
import {TabContext, TabList, TabPanel} from '@material-ui/lab'
import {styled} from '@material-ui/core/styles'
import {makeStyles} from '@material-ui/styles'

// components
import Page from 'components/Page'
import {FreelancerTab, ClientTab} from './gigTabs'
import {UsersContext} from 'utils/context/users'

// theme
import color from 'theme/palette'

// variables
const DRAWER_WIDTH = 280
const SIMPLE_TAB = [
  {value: 1, label: 'Jobsters', disabled: false, keys: 'jobster'},
  {value: 2, label: 'Clients', disabled: false, keys: 'clients'},
]

// styles
const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const useStyles = makeStyles({
  root: {
    width: 'auto',
  },
  nav_item: {
    width: '48.33%',
    maxWidth: '48.33%',
    textTransform: 'uppercase',
    margin: '0 4px',
    border: '1px solid #727272',
    borderRadius: '8px',
    minHeight: '42px',
    '@media (max-width: 500px)': {
      width: '47.33%',
      maxWidth: 'auto',
      padding: '6px 0',
      margin: '0 3px',
      fontSize: 12,
    },
    '@media (max-width: 475px)': {
      fontSize: 11,
    },
    '&.Mui-selected': {
      backgroundColor: `${color.starjobs.main}`,
      border: 'none',
      color: `${color.common.white}`,
    },
  },
  icon: {
    width: 27,
    height: 27,
  },
})

const Gigs = () => {
  const params = useParams()
  const classes = useStyles()

  const [value, setValue] = useState('0')
  const {user} = useContext(UsersContext)

  useEffect(() => {
    const load = () => {
      if (user.accountType === 0) return setValue('1')
    }

    load()

    // eslint-disable-next-line
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const renderTab = (type) => {
    if (type === 2) {
      return <ClientTab category={params.category} />
    } else {
      return <FreelancerTab category={params.category} />
    }
  }

  return (
    <Page title="Gigs - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{my: 3, paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        <Stack direction={{xs: 'column', md: 'column'}} sx={{width: '100%'}}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              TabIndicatorProps={{
                style: {
                  display: 'none',
                },
              }}
            >
              {SIMPLE_TAB.map((tab, index) => (
                <Tab className={classes.nav_item} key={tab.value} label={tab.label} value={String(index)} />
              ))}
            </TabList>
            <Box
              sx={{
                p: 1,
                mt: 2,
                mb: 10,
                width: '100%',
              }}
            >
              {SIMPLE_TAB.map((panel, index) => (
                <TabPanel key={panel.value} value={String(index)} sx={{p: 0}}>
                  {renderTab(panel.value)}
                </TabPanel>
              ))}
            </Box>
          </TabContext>
        </Stack>
      </MainStyle>
    </Page>
  )
}

export default Gigs
