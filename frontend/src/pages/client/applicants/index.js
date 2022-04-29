import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
// material
import {Divider, Typography, Box} from '@mui/material'
import {styled} from '@mui/material/styles'

// components
import Page from 'src/components/Page'
import ListApplicants from './lists'
import ClientProfile from './details'

// api
import gigs_api from 'src/lib/gigs'

const DRAWER_WIDTH = 280
const MainStyle = styled(Box)(({theme}) => ({
  marginTop: '0',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '280px',
  display: 'block',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

const Applicants = () => {
  const params = useParams()
  const [data, setData] = useState({
    applicants: [],
    details: [],
    shift: undefined
  })

  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      const result = await gigs_api.get_gigs_applicant(params.id)
      if (!result.ok) return

      if (componentMounted) {
        setData({details: result.data, shift: result.data.shift, applicants: result.data.applicants})
      }
    }
    load()
    return () => {
      componentMounted = false
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Page title="Gig Applicants - Starjobs">
      <MainStyle alignItems="center" justify="center" sx={{paddingLeft: {xs: 3}, paddingRight: {xs: 3}}}>
        <ClientProfile details={data.details} shift={data.shift} />
        <Divider sx={{mt: 3}}>
          <Typography variant="overline">Applicants</Typography>
        </Divider>
        <ListApplicants details={data.details} applicants={data.applicants} />
      </MainStyle>
    </Page>
  )
}

export default Applicants
