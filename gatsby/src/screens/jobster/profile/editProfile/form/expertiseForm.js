import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import * as Yup from 'yup'
import {useFormik, Form, FormikProvider} from 'formik'
// material
import {Stack, TextField, FormControlLabel, Typography, Checkbox, Box} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack'
import Select from 'react-select'
import {FreelancerCategory} from 'utils/data'

ExpertiseForm.propTypes = {
  user: PropTypes.object,
  stored: PropTypes.object,
  onNext: PropTypes.func,
  onStoreData: PropTypes.func
}

export default function ExpertiseForm({stored, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const store = stored.expertise ? stored.expertise : undefined
  // eslint-disable-next-line no-unused-vars
  const [SKILL_QUALIFICATION, setSkillQualification] = useState(FreelancerCategory.SKILL_QUALIFICATION)
  // eslint-disable-next-line no-unused-vars
  const [SKILL_OFFER, setSkillOffer] = useState(FreelancerCategory.SKILL_OFFER)
  const [selected, setSelected] = useState({
    SKILL_QUALIFICATION: [],
    SKILL_OFFER: [],
    SKILL_CATEGORY: []
  })

  const [CHECKBOX, setChecked] = useState({
    INDIVIDUAL_ERRANDS: [],
    FOOD_RESTAURANT: [],
    PARCELS_LOGISTICS: [],
    WAREHOUSING_MANUFACTURING: [],
    SALES_MARKETING: [],
    MUSIC_BAND: [],
    HOTEL_HOSPITALITY_MANAGEMENT: [],
    IT_COMPUTER_SYSTEMS: [],
    DESIGN_GRAPHICS: [],
    TUTORIAL_CONSULTATION: [],
    RETAIL_MERCHANDISING: []
  })

  const ExpertiseForm = Yup.object().shape({})

  const arrayRemove = (arr, value) => {
    return arr.filter(function (ele) {
      return ele !== value
    })
  }

  const formik = useFormik({
    initialValues: {
      skillQualification: '',
      skillOffer: '',
      salesMarketing: '',
      salesMarketingOthers: store.othersExpertise ? store.othersExpertise.replace('=>', ',') : ''
    },
    enableReinitialize: true,
    validationSchema: ExpertiseForm,
    onSubmit: async (values) => {
      setLoading(true)

      let skillQualification = []
      let skillOffer = []
      let workType = []

      if (selected.SKILL_QUALIFICATION.length === 0) {
        enqueueSnackbar('Select Skill Qualification to Offer', {variant: 'warning'})
        return setLoading(false)
      } else {
        selected.SKILL_QUALIFICATION.length > 1
          ? Object.values(selected.SKILL_QUALIFICATION).forEach((item) => {
              if (item !== undefined) return skillQualification.push(item.label)
            })
          : skillQualification.push(values.skillQualification.pop().label)
      }

      if (selected.SKILL_OFFER.length === 0) {
        enqueueSnackbar('Select Skills to Offer', {variant: 'warning'})
        return setLoading(false)
      } else {
        selected.SKILL_OFFER.length > 1
          ? Object.values(selected.SKILL_OFFER).forEach((item) => {
              if (item !== undefined) return skillOffer.push(item.label)
            })
          : skillOffer.push(values.skillOffer.pop().label)
      }

      Object.values(selected.SKILL_OFFER).forEach((skill_offer) => {
        if (CHECKBOX[skill_offer.value].length === 0) {
          delete CHECKBOX[skill_offer.value]
        } else {
          workType.push(`${skill_offer.value}||${CHECKBOX[skill_offer.value].join('=>')}//`)
        }
      })

      const string_marketing_others = values.salesMarketingOthers.replace(',', '=>')
      const string_qualification = skillQualification.join('=>')
      const string_offer = skillOffer.join('=>')

      let data = {
        othersExpertise: string_marketing_others,
        skillQualification: string_qualification,
        skillOffer: string_offer,
        skillQualificationOthers: values.skillQualificationOthers || 'N/A',
        workType: workType.join()
      }

      onStoreData(data, 'expertise')
      setLoading(false)
      onNext()
    }
  })

  const {handleSubmit, setFieldValue, getFieldProps} = formik

  const handleChange = (e, checkboxKey) => {
    const {checked, value} = e.target

    let existingCheckbox = CHECKBOX

    if (checked) {
      setChecked((prev) => ({...prev, [checkboxKey]: [...prev[checkboxKey], value]}))
    } else {
      existingCheckbox[checkboxKey] = arrayRemove(existingCheckbox[checkboxKey], value)
      setChecked(existingCheckbox)
    }

    setFieldValue('salesMarketing', CHECKBOX)
  }

  let split_other_expertise = []
  if (store.othersExpertise && store.othersExpertise.length > 0) {
    split_other_expertise = store.othersExpertise.split('=>')
  }

  const handleChangeSelect = (type, selectValue, selectedKey) => {
    let selectedItem = selected[selectedKey]
    let difference = selectedItem.filter((x) => !selectValue.includes(x))

    if (difference.length === 0) {
      if (selectedItem.length > 2) {
        enqueueSnackbar(`Kindly select only three(3) for each expertise`, {variant: 'warning'})
        return
      }

      selectedItem.push(selectValue.pop())
    } else {
      let diffLabel = difference.pop()
      selectedItem = selectedItem.filter((obj) => obj.value !== diffLabel.value)

      let existingCheckbox = CHECKBOX

      Object.keys(existingCheckbox).forEach((value) => {
        const a = selectedItem.filter((obj) => obj.value === value)

        if (a.length > 0) return
        return (existingCheckbox[value] = [])
      })

      setChecked(existingCheckbox)
    }

    setFieldValue(type, selectedItem)
    setSelected((prev) => ({...prev, [selectedKey]: selectedItem}))
  }

  const handleSort = (object) => {
    return object.sort((a, b) => (a.label > b.label ? 1 : -1))
  }

  useEffect(() => {
    const load = () => {
      let skill = []
      let offer = []

      if (store.skillOffer && store.skillQualification) {
        // skill qualification
        Object.values(store.skillQualification.split('=>')).forEach((item) => {
          const list = SKILL_QUALIFICATION.filter((obj) => obj.label === item)[0]
          if (typeof list === 'undefined') return ''
          skill.push(list)
        })

        // skill offer
        Object.values(store.skillOffer.split('=>')).forEach((item) => {
          const list = SKILL_OFFER.filter((obj) => obj.label === item)[0]
          if (typeof list === 'undefined') return ''
          offer.push(list)
        })

        if (skill.length > 0) {
          setSelected((prev) => ({...prev, SKILL_QUALIFICATION: skill}))
        }

        if (offer.length > 0) {
          setSelected((prev) => ({...prev, SKILL_OFFER: offer}))
        }
      }

      if (store.workType && store.workType.length > 0) {
        store.workType &&
          Object.values(store.workType.split('//').filter(String)).forEach((item) => {
            const value = item.split('||')
            const parent = value[0].replace(',', '')
            Object.values(value).forEach((loop, index) => {
              if (index !== 0) {
                setChecked((prev) => ({...prev, [parent]: loop.split('=>')}))
              }
            })
          })
      }

      setFieldValue('skillQualification', skill)
      setFieldValue('skillOffer', offer)
    }
    load()

    // eslint-disable-next-line
  }, [stored])

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="body1" sx={{mb: 0, mt: 0, fontWeight: 'bold'}}>
            Expertise
          </Typography>

          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
              Type of industry do you belong
            </Typography>
            <Select
              id="industry"
              onChange={(e) => handleChangeSelect('skillQualification', e, 'SKILL_QUALIFICATION')}
              value={selected.SKILL_QUALIFICATION}
              isMulti={true}
              options={handleSort(SKILL_QUALIFICATION)}
            />
          </Stack>

          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
              What skills/ profiles/ services do you offer
            </Typography>

            <Select
              id="skills"
              onChange={(e) => handleChangeSelect('skillOffer', e, 'SKILL_OFFER')}
              value={selected.SKILL_OFFER}
              isMulti={true}
              options={handleSort(SKILL_OFFER)}
            />
          </Stack>
          <Stack>
            {selected.SKILL_OFFER &&
              selected.SKILL_OFFER.map((v, key) => {
                if (typeof v === 'undefined') return ''
                return (
                  <Box component="div" sx={{my: 2}} key={key}>
                    <Typography variant="body2" sx={{mb: 1, marginTop: '0.5rem !important'}}>
                      What types of <strong>{v.label}</strong> do you do?
                    </Typography>
                    {selected.SKILL_OFFER &&
                      FreelancerCategory[v.value].map((item, idx) => {
                        return (
                          <Box
                            component="div"
                            key={idx}
                            sx={{display: 'inline-block', width: {xs: '50%', sm: '33%', lg: '33%'}}}
                          >
                            <FormControlLabel
                              sx={{marginTop: '0 !important'}}
                              control={
                                <Checkbox
                                  color="primary"
                                  checked={CHECKBOX[v.value].length > 0 && CHECKBOX[v.value].indexOf(item) !== -1}
                                  onChange={(e) => handleChange(e, v.value)}
                                  value={item}
                                />
                              }
                              label={
                                <Typography
                                  variant="body2"
                                  align="left"
                                  sx={{color: 'text.secondary', marginTop: '0 !important'}}
                                >
                                  {item}
                                </Typography>
                              }
                            />
                          </Box>
                        )
                      })}
                  </Box>
                )
              })}

            <TextField
              id="otherSkills"
              key="salesMarketingOthers"
              rows={6}
              fullWidth
              multiline
              sx={{mt: 3}}
              defaultValue={split_other_expertise}
              {...getFieldProps('salesMarketingOthers')}
            />
            <Typography variant="body2" sx={{mb: 1, marginTop: '0.5rem !important'}}>
              (ex. Encoding, Excel Computations)
            </Typography>
          </Stack>

          <LoadingButton
            id="continueExpertiseForm"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
          >
            Continue
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
