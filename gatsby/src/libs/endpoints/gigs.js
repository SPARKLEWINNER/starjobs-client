import request from 'utils/header'
import storage from 'utils/storage'

const get_gigs_categorized = (category) => request.get(`/gigs/list/${category}`)

const get_gigs_no_category = () => request.get(`/gigs`)

const patch_gigs_apply = (gig_id, form_data) => request.patch(`/gigs/apply/${gig_id}`, form_data)

const get_gigs_history = async () => {
  const current_user = await storage.getUser()
  if (!current_user) return false
  const {_id} = JSON.parse(current_user)
  return request.get(`/gigs/history/${_id}`)
}

const post_gig = (user_id, form_data) => request.post(`/gigs/${user_id}`, form_data)

const get_gigs_client = async () => {
  const current_user = await storage.getUser()
  if (!current_user) return false
  const {_id} = JSON.parse(current_user)
  return request.get(`/clients/${_id}`)
}

const get_gigs_applicant = (gig_id) => request.get(`/applicants/${gig_id}`)

const get_gig_details = (gig_id) => request.get(`/gigs/${gig_id}`)

const post_rating_gig = async (gig_id, form_data) => {
  const current_user = await storage.getUser()
  if (!current_user) return false
  const {_id, accountType} = JSON.parse(current_user)

  form_data['uid'] = _id
  form_data['accountType'] = accountType

  return await request.post(`/rating/new/${gig_id}`, form_data)
}

const patch_gig_details = (gig_id, user_id, form_data) => request.patch(`/gigs/edit/${gig_id}/${user_id}`, form_data)

const remove_gig = (gig_id, user_id) => request.patch(`/gigs/remove/${gig_id}/${user_id}`, {status: 'Archived'})

const exp_object = {
  get_gigs_no_category,
  get_gigs_categorized,
  get_gigs_history,
  get_gigs_client,
  get_gigs_applicant,
  get_gig_details,
  patch_gigs_apply,
  patch_gig_details,
  post_gig,
  post_rating_gig,
  remove_gig
}

export default exp_object
