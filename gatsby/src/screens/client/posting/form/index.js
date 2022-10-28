import {useState, useEffect} from 'react'
// material
import {Stack, Select, Typography} from '@mui/material'

// components
import CreatGigForm from './gigs'
import CreateParcelForm from './parcel'

// api
import category_api from 'libs/endpoints/category'
import {useAuth} from 'contexts/AuthContext'
const GigsForm = () => {
  const {currentUser} = useAuth()
  const [category, setCategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [areaNotification, setAreaNotification] = useState([])

  const handleSelectedCategory = (value) => {
    setSelectedCategory(value)
  }

  useEffect(() => {
    const load = async () => {
      const categories_result = await category_api.get_categories()
      const notification_area_result = await category_api.get_notification_area()
      if (!categories_result.ok) return
      let category_data = categories_result.data.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
      setCategory(category_data.filter((obj) => obj['status'] !== 1))

      if (notification_area_result.ok) {
        setAreaNotification(notification_area_result.data.data)
      }
    }

    load()
  }, [])

  const renderTab = (type) => {
    if (!type)
      return (
        <Typography variant="h6" sx={{textAlign: 'center', my: 4}}>
          Select Gig Category
        </Typography>
      )

    switch (type) {
      case 'parcels':
        return <CreateParcelForm user={currentUser} category={selectedCategory} />
      default:
        return <CreatGigForm user={currentUser} category={selectedCategory} notificationArea={areaNotification} />
    }
  }

  return (
    <>
      <Stack direction={{xs: 'column', sm: 'column'}} spacing={2} sx={{mt: 4}}>
        <Select
          id="gigCategorySelect"
          native
          onChange={(e) => handleSelectedCategory(e.target.value)}
          defaultValue={''}
        >
          <option value="" disabled key="initial">
            Select Gig Category
          </option>
          {category &&
            category.map((v) => {
              return (
                <option key={v.slug} value={v.slug}>
                  {v.name}
                </option>
              )
            })}
        </Select>
      </Stack>
      <Stack sx={{mb: 6}}>{renderTab(selectedCategory)}</Stack>
    </>
  )
}

export default GigsForm
