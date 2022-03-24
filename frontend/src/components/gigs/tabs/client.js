import {useState, useEffect} from 'react'
import {
  Stack,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  DialogActions,
  Radio,
  FormControlLabel,
} from '@material-ui/core'
import {styled} from '@material-ui/core/styles'
import Sort from '@material-ui/icons/Sort'
import moment from 'moment'
// api
import gigs_api from 'api/gigs'

// component
import {WaitingCard} from 'components/gigCards'

// variable
const DRAWER_WIDTH = 280

const MainStyle = styled(Stack)(({theme}) => ({
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

export default function ClientTab({category}) {
  const [data, setData] = useState([])
  const [FILTERED_DATA, setRenderData] = useState([])
  const [RENDER_LENGTH, setRenderLength] = useState(3)
  const [openFilterDialog, setOpenFilterDialog] = useState(false)

  const load = async () => {
    const result = await gigs_api.get_gigs_categorized(category)
    if (!result.ok) {
      return
    }

    let {data} = result
    if (!data || data.length === 0) {
      setData([])
      setRenderData([])
      return
    }

    data.sort((a, b) => (moment(a.date + ' ' + a.time) > moment(b.date + ' ' + b.time) ? 1 : -1))
    const FILTERED = data.filter((obj) => (moment(obj.from).isValid() ? obj : ''))

    setData(FILTERED)
    setRenderData(FILTERED.slice(0, 3))
  }

  const loadMore = () => {
    let renderCount = RENDER_LENGTH
    renderCount += 5
    setRenderLength(renderCount)
    setRenderData(data.slice(0, renderCount))
  }

  //#############FILTER CODE################

  const handleFilterDialogClose = () => {
    setOpenFilterDialog(false)
  }

  const [sortType, setSortType] = useState('')
  const handleRadioChange = (event) => {
    setSortType(event.target.value)
  }

  const filterHandler = () => {
    let finalSortedData = []

    switch (sortType) {
      case 'N-O':
        finalSortedData = data.sort((a, b) =>
          a.dateCreated > b.dateCreated ? -1 : a.dateCreated < b.dateCreated ? 1 : 0,
        )
        setData(finalSortedData)
        //Needs to put this here cause for some reason useEffect doesn't execute even if the [data] is changed
        setRenderData(data.slice(0, 3))
        break
      case 'O-N':
        finalSortedData = data.sort((a, b) =>
          a.dateCreated < b.dateCreated ? -1 : a.dateCreated > b.dateCreated ? 1 : 0,
        )
        setData(finalSortedData)
        setRenderData(data.slice(0, 3))
        break

      default:
        break
    }

    handleFilterDialogClose()
  }

  //#############FILTER CODE################

  useEffect(
    () => {
      load()
    },
    // eslint-disable-next-line
    [],
  )

  useEffect(() => {
    data && setRenderData(data.slice(0, 3))
  }, [data])

  return (
    <MainStyle>
      <Stack direction={{xs: 'column', md: 'column'}}>
        {FILTERED_DATA.length > 0 && (
          <Stack>
            <Button
              variant="outlined"
              startIcon={<Sort />}
              onClick={() => {
                setOpenFilterDialog(true)
              }}
            >
              Filter/Sort
            </Button>
            {FILTERED_DATA.map((v, k) => {
              const now = moment(new Date())
              if (!v || v.length === 0) return ''
              if (moment(v.time).isBefore(moment(), 'day')) return ''
              const diff = moment(v.from).diff(now)
              //express as a duration
              const diffDuration = moment.duration(diff)
              if (diffDuration.asDays() > 2) return ''

              if (!moment(v.from).isValid()) return ''
              return <WaitingCard gig={v} type="view" category={v.category} key={k} />
            })}
          </Stack>
        )}

        {FILTERED_DATA.length !== data.length && (
          <Button variant="text" onClick={() => loadMore()} sx={{mt: 5}}>
            Load more
          </Button>
        )}
        {(!FILTERED_DATA || FILTERED_DATA.length === 0) && <Typography variant="body2">No Posted Gig/s</Typography>}
      </Stack>

      <Dialog open={openFilterDialog} onClose={handleFilterDialogClose} fullWidth>
        <DialogTitle>Sort</DialogTitle>
        <DialogContent>
          <Stack>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={sortType}
              name="radio-buttons-group"
              onChange={handleRadioChange}
            >
              <FormControlLabel value="N-O" control={<Radio />} label="Newest to oldest" />
              <FormControlLabel value="O-N" control={<Radio />} label="Oldest to newest" />
            </RadioGroup>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              filterHandler()
            }}
          >
            Run sort / filter
          </Button>
        </DialogActions>
      </Dialog>
    </MainStyle>
  )
}
