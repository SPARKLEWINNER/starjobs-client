import {useState} from 'react'
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom'
import {useSnackbar} from 'notistack'
import {Card, Typography, Link} from '@mui/material'

// component
import ApplicantCard from './card'
import {ConfirmDialog} from './dialog'

// api
import gigs_api from 'src/lib/gigs'
import useSendNotif from 'src/utils/hooks/useSendNotif'
import PropTypes from 'prop-types'

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
      uid: applicantId
    }

    const result = await gigs_api.patch_gigs_apply(params.id, data)
    if (!result.ok) return enqueueSnackbar('Unable to process action', {variant: 'error'})

    await sendGigNotification({
      title: 'You have been accepted',
      body: 'View gig in progress',
      targetUsers: [applicantId],
      additionalData: result
    })

    enqueueSnackbar('Applicant accepted and notified', {variant: 'success'})
    navigation('/client/gig/create?tab=2')
  }

  return (
    <>
      <>
        {applicants &&
          applicants.length > 0 &&
          applicants.map((v, k) => {
            if (gig.status === 'Applying' || (gig.isExtended && v.status === 'Applying'))
              return (
                <div key={k}>{gig && v && <ApplicantCard data={v} onClick={handleConfirm} gigDetails={gig} />}</div>
              )

            return ''
          })}

        {gig.status !== 'Applying' ||
          (applicants && applicants.length <= 0 && (
            <Card
              sx={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
                py: 10
              }}
            >
              <Typography variant="h6">
                No applicants{' '}
                <Link
                  component={RouterLink}
                  to="/client/gig/create?tab=3"
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
ListApplicants.propTypes = {
  details: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  applicants: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default ListApplicants
