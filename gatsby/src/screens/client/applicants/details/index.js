import {useState, useEffect} from 'react'
import {Link as RouterLink, useParams, useNavigate} from '@reach/router'
import moment from 'moment'
import {useSnackbar} from 'notistack'

// material
import {Stack, Typography, Link, Grid, Card, Button} from '@mui/material'

// utils
import {fCamelCase} from 'utils/formatCase'

// component
import ConfirmDeleteGig from './confirmDelete'

// api
import storage from 'utils/storage'
import gigs_api from 'libs/endpoints/gigs'

import PropTypes from 'prop-types'

export default function GigsDetailsLayout({details, shift}) {
  const params = useParams()
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const [gig, setGig] = useState([])
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [hoursShift, setHrShift] = useState(undefined)

  const onClick = () => {
    setDeleteOpen(true)
  }

  const onConfirm = async () => {
    if (!params || !params.id) {
      return enqueueSnackbar('Unable to edit this gig', {variant: 'error'})
    }

    const local_user = await storage.getUser()
    if (!local_user) {
      return
    }

    const user = JSON.parse(local_user)
    if (!user) {
      return
    }

    const request = await gigs_api.remove_gig(params.id, user._id)
    if (!request.ok) {
      enqueueSnackbar('Unable to remove this gig', {variant: 'error'})
      return
    }

    enqueueSnackbar('Gig removed success', {variant: 'success'})
    navigate('/client')
  }

  const handleCloseDeleteDialog = () => {
    setDeleteOpen(false)
  }

  useEffect(() => {
    setGig(details)
    setHrShift(shift)
    // eslint-disable-next-line
  }, [details, shift])

  return (
    <>
      <Stack sx={{mb: 3}}>
        <Typography variant="h4" sx={{display: 'block', textAlign: 'center', mb: 2}}>
          {gig.position}
        </Typography>

        {/* actions */}
        <Stack direction="row">
          <Link component={RouterLink} sx={{mb: 3, ml: 'auto', mr: 1}} to={`/gigs/edit/${gig._id}`}>
            <Button variant="contained">Edit Gig details</Button>
          </Link>
          <Button variant="outlined" sx={{mb: 3, mr: 1}} onClick={onClick}>
            Delete Gig
          </Button>
        </Stack>

        <Card sx={{p: 2}}>
          <Grid container>
            {/* category */}
            <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
              <Typography variant="overline">Category</Typography>
            </Grid>
            <Grid item xs={8} sm={8}>
              <Typography variant="body1" sx={{fontWeight: 'bold', fontSize: {sm: '1.2rem', xs: '0.85rem !important'}}}>
                {gig.category && fCamelCase(gig.category).replace('-', ' ')}
              </Typography>
            </Grid>

            {/* name */}
            <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
              <Typography variant="overline">Name</Typography>
            </Grid>
            <Grid item xs={8} sm={8}>
              <Typography variant="body1" sx={{fontWeight: 'bold', fontSize: {sm: '1.2rem', xs: '0.85rem !important'}}}>
                {gig.position}
              </Typography>
            </Grid>

            {/* start & end date */}
            <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
              <Typography variant="overline">Date</Typography>
            </Grid>
            <Grid item xs={8} sm={8}>
              <Stack direction="row" sx={{my: 1}}>
                <Typography variant="overline" color="default" sx={{fontSize: 10}}>
                  Start: {moment(gig.from).format('MMM-DD HH:mm A')}
                </Typography>
                <Typography variant="overline" color="default" sx={{fontSize: 10, ml: 2}}>
                  End: {moment(gig.time).format('MMM-DD HH:mm A')}
                </Typography>
              </Stack>
            </Grid>

            {/* fee */}
            <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
              <Typography variant="overline">Fee</Typography>
            </Grid>
            <Grid item xs={8} sm={8}>
              <Typography variant="body1" sx={{fontWeight: 'bold', fontSize: {sm: '1.2rem', xs: '0.85rem !important'}}}>
                P {gig.fee}
              </Typography>
            </Grid>

            {/* hours */}
            <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
              <Typography variant="overline">No. of hours</Typography>
            </Grid>
            <Grid item xs={8} sm={8}>
              <Typography variant="body1" sx={{fontWeight: 'bold', fontSize: {sm: '1.2rem', xs: '0.85rem !important'}}}>
                {gig.hours}
              </Typography>
            </Grid>

            {/* shift */}
            <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
              <Typography variant="overline">Shift</Typography>
            </Grid>
            <Grid item xs={8} sm={8}>
              <Typography variant="body1" sx={{fontWeight: 'bold', fontSize: {sm: '1.2rem', xs: '0.85rem !important'}}}>
                {hoursShift}
              </Typography>
            </Grid>

            {/* notes */}
            <Grid item xs={4} sm={4} sx={{pl: {xs: 0, sm: 2}}}>
              <Typography variant="overline">Notes</Typography>
            </Grid>
            <Grid item xs={8} sm={8}>
              <Typography variant="body1" sx={{fontWeight: 'bold', fontSize: {sm: '1.2rem', xs: '0.85rem !important'}}}>
                {gig.notes ? gig.notes : 'n/a'}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Stack>

      <ConfirmDeleteGig open={deleteOpen} onConfirm={onConfirm} handleClose={handleCloseDeleteDialog} />
    </>
  )
}

GigsDetailsLayout.propTypes = {
  details: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  shift: PropTypes.string
}
