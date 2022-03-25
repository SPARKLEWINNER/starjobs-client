import {useState, useEffect} from 'react'
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom'
import {useSnackbar} from 'notistack5'
import {Box, Stack, Typography, Link} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'

// component
import LoadingScreen from 'components/LoadingScreen'
import ApplicantCard from './card'
import {ConfirmDialog} from './dialog'

// api
import gigs_api from 'api/gigs'
import useSendNotif from 'utils/hooks/useSendNotif'

// variables
const DRAWER_WIDTH = 280
// const APPBAR_DESKTOP = 200

const MainStyle = styled(Stack)(({theme}) => ({
  marginHorizontal: 'auto',
  marginTop: 20,
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

export default function ClientApplicants() {
  const {enqueueSnackbar} = useSnackbar()
  const navigation = useNavigate()
  const params = useParams()
  const [applicant, setApplicants] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [applicantId, setApplicantId] = useState('')
  const [gig, setGig] = useState([])

  const {sendGigNotification} = useSendNotif()

  const load = async () => {
    setLoading(true)
    const result = await gigs_api.get_gigs_applicant(params.id)
    if (!result.ok) return setLoading(false)
    setGig(result.data)
    setApplicants(result.data.applicants)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = (value) => {
    if (!value) return
    setOpen(true)
    setApplicantId(value)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setOpen(false)

    let data = {
      status: 'Accepted',
      uid: applicantId,
    }

    const result = await gigs_api.patch_gigs_apply(params.id, data)
    if (!result.ok) {
      enqueueSnackbar('Unable to process action', {variant: 'error'})
      return setLoading(false)
    }

    await sendGigNotification({
      title: 'You have been accepted',
      body: 'Please report to the location at the correct time',
      targetUsers: [applicantId],
      additionalData: result,
    })

    enqueueSnackbar('Applicant accepted and notified', {variant: 'success'})
    setLoading(false)
    // navigation('/client')
  }

  return (
    <>
      {isLoading && (
        <Box sx={{height: '50vh'}}>
          <LoadingScreen />
        </Box>
      )}
      {!isLoading && (
        <>
          <MainStyle>
            <Stack>
              {applicant &&
                Object.values(applicant).map((v, k) => {
                  if (gig.status === 'Applying') {
                    return <ApplicantCard data={v} key={k} onClick={handleConfirm} gigDetails={gig} />
                  }
                  return ''
                })}

              {gig.status !== 'Applying' ||
                (Object.values(applicant).length <= 0 && (
                  <Box
                    sx={{
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4">
                      No applicants{' '}
                      <Link
                        component={RouterLink}
                        to="/client/app"
                        underline="none"
                        sx={{display: 'block', my: 2, fontSize: '1.25rem'}}
                      >
                        Go back
                      </Link>
                    </Typography>
                  </Box>
                ))}

              {gig.status !== 'Applying' ||
                (Object.values(applicant).length <= 0 && (
                  <Box
                    sx={{
                      textAlign: 'center',
                      minHeight: '50vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4">
                      No applicants{' '}
                      <Link
                        component={RouterLink}
                        to="/client/app"
                        underline="none"
                        sx={{display: 'block', my: 2, fontSize: '1.25rem'}}
                      >
                        Go back
                      </Link>
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </MainStyle>
        </>
      )}
      <ConfirmDialog open={open} handleClose={handleClose} onConfirm={handleSubmit} />
    </>
  )
}
