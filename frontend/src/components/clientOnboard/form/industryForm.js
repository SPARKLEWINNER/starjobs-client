/* eslint-disable no-unused-vars */
import * as Yup from 'yup'
import {useState, useEffect} from 'react'
import {useFormik, Form, FormikProvider} from 'formik'
// material
import {Stack, TextField, FormControlLabel, Typography, Checkbox, Box} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {useSnackbar} from 'notistack5'
import Select from 'react-select'
import {FreelancerCategory} from 'src/utils/data'

export default function IndustryForm({user, stored, onNext, onStoreData}) {
  const {enqueueSnackbar} = useSnackbar()
  const [isLoading, setLoading] = useState(false)
  const [SKILL_QUALIFICATION, setSkillQualification] = useState(FreelancerCategory.SKILL_QUALIFICATION)
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
      industryType: '',
      skillLooking: '',
      salesMarketing: '',
      skillQualificationOthers: '',
      skillsOfferOthers: '',
      salesMarketingOthers: ''
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
        if (selected.SKILL_QUALIFICATION.length > 1) {
          Object.values(selected.SKILL_QUALIFICATION).forEach((item) => {
            if (item !== undefined) return skillQualification.push(item.label)
          })
        } else {
          if (selected.SKILL_QUALIFICATION.length > 0) {
            skillQualification.push(selected.SKILL_QUALIFICATION.pop().label)
          }
        }
      }

      if (selected.SKILL_OFFER.length === 0) {
        enqueueSnackbar('Select Skills to Offer', {variant: 'warning'})
        return setLoading(false)
      } else {
        // support multiple selected skill offer
        if (selected.SKILL_OFFER.length > 1) {
          await Object.values(selected.SKILL_OFFER).forEach((item) => {
            if (item !== undefined) {
              if (values.salesMarketing[item.value].length === 0) {
                delete values.salesMarketing[item.value]
              } else {
                workType.push(`${item.value}||${values.salesMarketing[item.value].join('=>')}//`)
              }

              return skillOffer.push(item.label)
            }
          })
          // support one selected skill offer
        } else {
          if (selected.SKILL_OFFER.length > 0) {
            const skill_offer = selected.SKILL_OFFER.pop()
            skillOffer.push(skill_offer.label)
            await Object.keys(values.salesMarketing).forEach((item) => {
              if (values.salesMarketing[item].length > 0) {
                workType.push(`${skill_offer.value}||${values.salesMarketing[item].join('=>')}//`)
              }
            })
          }
        }
      }

      let string_marketing_others = ''
      if (values.salesMarketingOthers.length > 0) {
        let isMultiple = values.salesMarketingOthers.includes(',')
        if (isMultiple) {
          string_marketing_others = values.salesMarketingOthers.replace(/,/g, '=>')
        } else {
          if (typeof values.salesMarketingOthers === 'object') {
            isMultiple = string_marketing_others = values.salesMarketingOthers.toString()
            if (isMultiple) {
              string_marketing_others = values.salesMarketingOthers.toString().replace(/,/g, '=>')
            }
          } else {
            string_marketing_others = values.salesMarketingOthers
          }
        }
      }

      const string_qualification = skillQualification.join('=>')
      const string_offer = skillOffer.join('=>')

      let data = {
        othersExpertise: string_marketing_others,
        industryType: string_qualification,
        skillLooking: string_offer,
        workType: workType.join()
      }

      onStoreData(data, 'industry')
      setLoading(false)
      onNext()
    }
  })

  const {values, handleSubmit, setFieldValue, getFieldProps} = formik

  const handleChange = (e, checkboxKey) => {
    const {checked, value} = e.target

    let newValue = CHECKBOX

    if (checked) {
      newValue[checkboxKey].push(value)
      // setChecked((prev) => ({...prev, [checkboxKey]: [...prev[checkboxKey], value]}))
    } else {
      newValue[checkboxKey] = arrayRemove(newValue[checkboxKey], value)
      // setChecked(newValue)
    }

    setChecked(newValue)
    setFieldValue('salesMarketing', newValue)
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

      setFieldValue('salesMarketing', existingCheckbox)
      setChecked(existingCheckbox)
    }

    setFieldValue(type, selectedItem)
    setSelected((prev) => ({...prev, [selectedKey]: selectedItem}))
  }

  const handleSort = (object) => {
    return object.sort((a, b) => (a.label > b.label ? 1 : -1))
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let store = stored.industry ? stored.industry : undefined
      let skill = []
      let offer = []
      let marketing = CHECKBOX

      let split_other_expertise = []
      if (store.othersExpertise && store.othersExpertise.length > 0) {
        split_other_expertise = store.othersExpertise.split('=>')
      }

      if (store.industryType && store.skillLooking) {
        // skill qualification
        await Object.values(store.industryType.split('=>')).forEach((item) => {
          const list = SKILL_QUALIFICATION.filter((obj) => obj.label === item)[0]
          if (typeof list === 'undefined') return ''
          skill.push(list)
        })

        // skill offer
        await Object.values(store.skillLooking.split('=>')).forEach((item) => {
          const list = SKILL_OFFER.filter((obj) => obj.label === item)[0]
          if (typeof list === 'undefined') return ''
          offer.push(list)
        })

        if (store.workType && store.workType.length > 0) {
          // supports multiple skill offer
          if (offer.length > 1) {
            await Object.values(store.workType.split('//').filter(String)).forEach((item) => {
              const value = item.split('||')
              const parent = value[0].replace(',', '')

              Object.values(value).forEach((loop, index) => {
                if (index !== 0) {
                  setChecked((prev) => ({...prev, [parent]: loop.replace(',', '').split('=>')}))
                }
              })
            })
          } else {
            let parent = store.workType.split('||')[0]
            let value

            await Object.values(store.workType.split('||').filter(String)).forEach((item) => {
              value = item.replace('//', '').split('=>')
            })
            marketing[parent] = value
            setChecked((prev) => ({...prev, [parent]: value}))
          }
        }
      }

      setSelected({SKILL_QUALIFICATION: skill, SKILL_OFFER: offer})
      setFieldValue('skillQualification', skill)
      setFieldValue('skillOffer', offer)
      setFieldValue('salesMarketing', marketing)
      setFieldValue('salesMarketingOthers', split_other_expertise)
      setLoading(false)
    }
    load()

    // eslint-disable-next-line
  }, [stored])

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="body1" sx={{mb: 0, mt: 0, fontWeight: 'bold'}}>
            Industry
          </Typography>

          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
              Type of industry do you belong
            </Typography>
            <Select
              onChange={(e) => handleChangeSelect('industryType', e, 'SKILL_QUALIFICATION')}
              value={selected.SKILL_QUALIFICATION}
              isMulti={true}
              options={handleSort(SKILL_QUALIFICATION)}
            />
          </Stack>

          <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
              What skills/ profiles/ services are you looking for
            </Typography>

            <Select
              onChange={(e) => handleChangeSelect('skillLooking', e, 'SKILL_OFFER')}
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
              key="salesMarketingOthers"
              rows={6}
              fullWidth
              multiline
              sx={{mt: 3}}
              defaultValue={values.salesMarketingOthers}
              {...getFieldProps('salesMarketingOthers')}
            />
            <Typography variant="body2" sx={{mb: 1, marginTop: '0.5rem !important'}}>
              (ex. Encoding, Excel Computations)
            </Typography>
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
            Continue
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
