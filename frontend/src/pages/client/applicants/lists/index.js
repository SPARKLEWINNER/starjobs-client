import {useState, useEffect} from 'react'
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom'
import {useSnackbar} from 'notistack5'
import {Stack, Card, Typography, Link} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'

// component
import ApplicantCard from './card'
import {ConfirmDialog} from './dialog'

// api
import gigs_api from 'utils/api/gigs'
import useSendNotif from 'utils/hooks/useSendNotif'

// variables
const DRAWER_WIDTH = 280

const MainStyle = styled(Stack)(({theme}) => ({
  marginHorizontal: 'auto',
  marginTop: 20,
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

export default function ListApplicants({details, applicants}) {
  const {enqueueSnackbar} = useSnackbar()
  const navigation = useNavigate()
  const params = useParams()
  const [applicant, setApplicants] = useState(applicants)
  const [open, setOpen] = useState(false)
  const [applicantId, setApplicantId] = useState('')
  const [gig, setGig] = useState([])

  const {sendGigNotification} = useSendNotif()

  // const load = async () => {
  //   const result = await gigs_api.get_gigs_applicant(params.id)
  //   if (!result.ok) return
  //   setGig(result.data)
  //   setApplicants(result.data.applicants)
  // }

  useEffect(() => {
    // load()
    setGig(details)
    setApplicants(applicants)

    if (!details.isExtended) {
      console.log(details)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicants])

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = (value) => {
    if (!value) return
    setOpen(true)
    setApplicantId(value)
  }

  const handleSubmit = async () => {
    setOpen(false)
    let data = {
      status: 'Accepted',
      uid: applicantId,
    }

    const result = await gigs_api.patch_gigs_apply(params.id, data)
    if (!result.ok) return enqueueSnackbar('Unable to process action', {variant: 'error'})

    await sendGigNotification({
      title: 'You have been accepted',
      body: 'Please report to the location at the correct time',
      targetUsers: [applicantId],
      additionalData: result,
    })

    enqueueSnackbar('Applicant accepted and notified', {variant: 'success'})
    navigation('/client')
  }

  return (
    <>
      <>
        <MainStyle>
          <Stack>
            {applicant &&
              Object.values(applicant).map((v, k) => {
                if (gig.status === 'Applying' || (gig.isExtended && v.status === 'Applying')) {
                  return <ApplicantCard data={v} key={k} onClick={handleConfirm} gigDetails={gig} />
                }

                return ''
              })}

            {gig.status !== 'Applying' ||
              (Object.values(applicant).length <= 0 && (
                <Card
                  sx={{
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 3,
                    py: 10,
                  }}
                >
                  <Typography variant="h6">
                    No applicants{' '}
                    <Link
                      component={RouterLink}
                      to="/client/app"
                      underline="none"
                      sx={{display: 'block', mt: 2, fontSize: '1.25rem'}}
                    >
                      Go back
                    </Link>
                  </Typography>
                </Card>
              ))}
          </Stack>
        </MainStyle>
      </>
      <ConfirmDialog open={open} handleClose={handleClose} onConfirm={handleSubmit} />
    </>
  )
}
