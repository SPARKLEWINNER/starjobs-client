import {useState, useEffect} from 'react'
// material
import {Stack, Select, Typography} from '@material-ui/core'

// components
import CreatGigForm from './gigs'
import CreateParcelForm from './parcel'

// api
import category_api from 'api/category'
import {useAuth} from 'utils/context/AuthContext'
const GigsForm = () => {
  const {currentUser} = useAuth()
  const [category, setCategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleSelectedCategory = (value) => {
    setSelectedCategory(value)
  }

  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      const result = await category_api.get_categories()
      if (!result.ok) return
      let category_data = result.data.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
      if (componentMounted) {
        setCategory(category_data.filter((obj) => obj['status'] !== 1))
      }
    }

    load()

    return () => {
      componentMounted = false
    }
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
        return <CreatGigForm user={currentUser} category={selectedCategory} />
    }
  }

  return (
    <>
      <Stack direction={{xs: 'column', sm: 'column'}} spacing={2} sx={{mt: 4}}>
        <Select native onChange={(e) => handleSelectedCategory(e.target.value)} defaultValue={''}>
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
