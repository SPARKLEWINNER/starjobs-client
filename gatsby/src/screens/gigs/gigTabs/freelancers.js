import React, {useState, useEffect} from 'react'
import {
  Stack,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  Typography,
  RadioGroup,
  Radio
} from '@mui/material'
import {styled} from '@mui/material/styles'
import Sort from '@mui/icons-material/Sort'

// api
import user_api from 'libs/endpoints/users'

// component
import {FreelancerCard} from '../cards'

// variable
const DRAWER_WIDTH = 280

const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}))

export default function FreelancerTab() {
  const [data, setData] = useState([])
  const [renderData, setRenderData] = useState([])
  const [renderLength, setRenderLength] = useState(3)
  const [openFilterDialog, setOpenFilterDialog] = useState(false)

  const RATE_TYPE = [
    {label: 'All', value: 'All'},
    {label: 'Hourly', value: 'Hourly'},
    {label: 'Daily', value: 'Daily'},
    {label: 'Monthly', value: 'Monthly'}
  ]

  const handleFilterDialogClose = () => {
    setOpenFilterDialog(false)
  }

  const loadMore = () => {
    let renderCount = renderLength
    renderCount += 5
    setRenderLength(renderCount)
    setRenderData(data.slice(0, renderCount))
  }

  //Filter params
  const [isVerified, setIsVerifiedOnly] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [rateType, setRateType] = useState('All')

  //Sort Params
  const [AZsortValue, setAZSortValue] = useState('')

  const handleFilterRateTypeChange = (event) => {
    setRateType(event.target.value)
  }

  const handleRadioChange = (event) => {
    setAZSortValue(event.target.value)
  }

  const sortFilterHandler = () => {
    if (data.length > 0) {
      let finalData = []
      let filteredData = []
      let sortedData = []

      //SORT
      if (AZsortValue === 'AZ') {
        sortedData = data.sort((a, b) => {
          return a.details[0].firstName.localeCompare(b.details[0].firstName)
        })

        setData(sortedData)
      } else {
        sortedData = data.sort((a, b) => {
          return b.details[0].firstName.localeCompare(a.details[0].firstName)
        })

        setData(sortedData)
      }

      //Filter loop
      for (let index = 0; index < data.length; index++) {
        if (data[index].isVerified === isVerified && data[index].isActive === isActive) {
          if (rateType !== 'All') {
            if (data[index].details[0].rate.rateType === rateType) {
              filteredData.push(data[index])
            }
          } else {
            filteredData.push(data[index])
          }
        }
      }

      finalData = filteredData

      setRenderData(finalData)
    }

    handleFilterDialogClose()
  }

  useEffect(
    () => {
      let componentMounted = true

      const load = async () => {
        const result = await user_api.get_user_list()
        if (!result.ok) return

        let {data} = result
        if (componentMounted) {
          setData(data)
          setRenderData(data.slice(0, 5))
        }
      }
      load()
      return () => {
        componentMounted = false
      }
    },
    // eslint-disable-next-line
    []
  )

  useEffect(() => {
    let componentMounted = true
    if (componentMounted) {
      data && setRenderData(data.slice(0, 5))
    }
    return () => {
      componentMounted = false
    }
  }, [data])

  return (
    <MainStyle>
      <Stack direction={{xs: 'column', md: 'column'}}>
        {data.length > 0 && (
          <Stack>
            <Button
              variant="outlined"
              sx={{mb: 2}}
              startIcon={<Sort />}
              onClick={() => {
                setOpenFilterDialog(true)
              }}
            >
              Filter/Sort
            </Button>
            {renderData.length > 0 &&
              renderData.map((v, index) => {
                if (v.details.length !== 0)
                  return (
                    <div key={index}>
                      <FreelancerCard data={v.details[0]} />
                    </div>
                  )
                return ''
              })}
          </Stack>
        )}
        {renderData.length !== data.length && (
          <Button variant="text" onClick={() => loadMore()} sx={{mt: 5}}>
            Load more
          </Button>
        )}
      </Stack>

      <Dialog open={openFilterDialog} onClose={handleFilterDialogClose} fullWidth>
        <DialogTitle>Filter</DialogTitle>
        <DialogContent>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={isVerified}
                  onChange={() => {
                    setIsVerifiedOnly(!isVerified)
                  }}
                />
              }
              label="Verified only"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={() => {
                    setIsActive(!isActive)
                  }}
                />
              }
              label="Active only"
            />
            <Typography>Rate type</Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rateType}
              onChange={handleFilterRateTypeChange}
            >
              {RATE_TYPE.map((rate, key) => {
                return (
                  <MenuItem value={rate.value} key={key}>
                    {rate.label}
                  </MenuItem>
                )
              })}
            </Select>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogTitle>Sort</DialogTitle>
        <DialogContent>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={AZsortValue}
            name="radio-buttons-group"
            onChange={handleRadioChange}
          >
            <FormControlLabel value="AZ" control={<Radio />} label="A-Z" />
            <FormControlLabel value="ZA" control={<Radio />} label="Z-A" />
          </RadioGroup>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              sortFilterHandler()
            }}
          >
            Run sort / filter
          </Button>
        </DialogActions>
      </Dialog>
    </MainStyle>
  )
}
