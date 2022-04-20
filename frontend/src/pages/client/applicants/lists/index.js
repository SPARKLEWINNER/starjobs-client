import {useState} from 'react'
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom'
import {useSnackbar} from 'notistack5'
import {Card, Typography, Link} from '@material-ui/core'

// component
import ApplicantCard from './card'
import {ConfirmDialog} from './dialog'

// api
import gigs_api from 'api/gigs'
import useSendNotif from 'utils/hooks/useSendNotif'

const ListApplicants = ({details: gig, applicants}) => {
  const {enqueueSnackbar} = useSnackbar()
  const navigation = useNavigate()
  const params = useParams()
  const [open, setOpen] = useState(false)
  const [applicantId, setApplicantId] = useState('')
  const {sendGigNotification} = useSendNotif()

  // const load = async () => {
  //   const result = await gigs_api.get_gigs_applicant(params.id)
  //   if (!result.ok) return
  //   setGig(result.data)
  //   setApplicants(result.data.applicants)
  // }

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
    navigation('/client/gig/create?tab=1')
  }

  return (
    <>
      <>
        {applicants &&
          applicants.length > 0 &&
          [applicants].map((v, k) => {
            if (gig.status === 'Applying' || (gig.isExtended && v.status === 'Applying'))
              return (
                <div key={k}>
                  <ApplicantCard data={v} onClick={handleConfirm} gigDetails={gig} />
                </div>
              )

            return ''
          })}

        {gig.status !== 'Applying' ||
          (applicants && [applicants].length <= 0 && (
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
      </>
      <ConfirmDialog open={open} handleClose={handleClose} onConfirm={handleSubmit} />
    </>
  )
}

export default ListApplicants
