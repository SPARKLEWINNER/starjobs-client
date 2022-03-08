import * as Yup from 'yup'
import {useState} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
// material
import {Stack, TextField, Typography, Rating} from '@material-ui/core'
import {LoadingButton} from '@material-ui/lab'
import {useSnackbar} from 'notistack5'

// api
import gigs_api from 'utils/api/gigs'

import {fCamelCase} from 'utils/formatCase'

export default function FreelancerRating({user, gigId, onClose}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const [RATING, setRating] = useState({
    efficiency: 0,
    onTime: 0,
    completeness: 0,
    showRate: 0,
  })

  const GigSchema = Yup.object().shape({
    comments: Yup.string(),
  })

  const formik = useFormik({
    initialValues: {},
    enableReinitialize: true,
    validationSchema: GigSchema,
    onSubmit: async (values) => {
      setLoading(true)
      let isComplete = true

      Object.keys(RATING).forEach((item) => {
        let field = RATING[item]
        if (item === 'notes') return

        if (!field) {
          isComplete = false
          enqueueSnackbar(`Required field ${fCamelCase(item)}`, {variant: 'warning'})
        }
      })

      if (!isComplete) {
        return setLoading(false)
      }

      let data = {
        ...RATING,
        comments: values.comments || '',
        _id: gigId,
      }

      const request = await gigs_api.post_rating_gig(data._id, data)
      if (!request.ok) {
        enqueueSnackbar(`Something went wrong in submitting  your rating/feedback`, {variant: 'error'})
        return setLoading(false)
      }

      setLoading(false)
      enqueueSnackbar(`Thank you for your feedback/rating!`, {variant: 'success'})
      onClose()
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    },
  })

  const {handleSubmit, getFieldProps} = formik

  const handleRating = (value, type) => {
    setRating((prev) => ({...prev, [type]: value}))
  }
  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{mb: 1}}>
          <Typography variant="h5" color="text.secondary" sx={{display: 'block', mt: 1, fontWeight: '600'}}>
            Efficiency
          </Typography>
          <Rating
            name="efficiency"
            defaultValue={0}
            size="large"
            value={RATING.efficiency}
            max={5}
            min={1}
            onChange={(event, newValue) => {
              handleRating(newValue, 'efficiency')
            }}
            sx={{mt: '6px !important'}}
          />
        </Stack>
        <Stack spacing={3} sx={{mb: 1}}>
          <Typography variant="h5" color="text.secondary" sx={{display: 'block', mt: 1, fontWeight: '600'}}>
            On-time
          </Typography>
          <Rating
            name="onTime"
            defaultValue={0}
            size="large"
            value={RATING.onTime}
            max={5}
            min={1}
            onChange={(event, newValue) => {
              handleRating(newValue, 'onTime')
            }}
            sx={{mt: '6px !important'}}
          />
        </Stack>
        <Stack spacing={3} sx={{mb: 1}}>
          <Typography variant="h5" color="text.secondary" sx={{display: 'block', mt: 1, fontWeight: '600'}}>
            Completeness
          </Typography>
          <Rating
            name="completeness"
            value={RATING.completeness}
            size="large"
            defaultValue={0}
            max={5}
            min={1}
            onChange={(event, newValue) => {
              handleRating(newValue, 'completeness')
            }}
            sx={{mt: '6px !important'}}
          />
        </Stack>
        <Stack spacing={3} sx={{mb: 1}}>
          <Typography variant="h5" color="text.secondary" sx={{display: 'block', mt: 1, fontWeight: '600'}}>
            Show Rate
          </Typography>
          <Rating
            name="showRate"
            value={RATING.showRate}
            size="large"
            defaultValue={0}
            max={5}
            min={1}
            onChange={(event, newValue) => {
              handleRating(newValue, 'showRate')
            }}
            sx={{mt: '6px !important'}}
          />
        </Stack>
        <Stack spacing={3} sx={{mb: 1}}>
          <TextField
            label="Comments (optional)"
            key="comments"
            rows={6}
            fullWidth
            multiline
            sx={{mt: 3}}
            {...getFieldProps('comments')}
          />
        </Stack>

        <Stack spacing={3} sx={{my: 2}}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
            Submit
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
