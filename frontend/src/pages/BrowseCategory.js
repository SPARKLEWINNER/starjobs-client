import React, {useState, useEffect} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {styled} from '@material-ui/core/styles'
import {Link, Stack, Container, Typography, TextField, Box} from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

import Page from '../components/Page'
import LoadingScreen from 'components/LoadingScreen'

import category_api from 'api/category'
const RootStyle = styled(Page)(({theme}) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const default_image = '/static/favicon/starjobs.png'

const ContentStyle = styled('div')(({theme}) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3, 0),
}))

export default function BrowseCategory() {
  const [category, setCategory] = useState([
    {
      initial: [],
      dynamic: [],
    },
  ])
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    let componentMounted = true
    const load = async () => {
      setLoading(true)
      const result = await category_api.get_categories()
      if (!result.ok) return setLoading(false)
      let category_data = result.data.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
      if (componentMounted) {
        setLoading(false)
        setCategory({initial: category_data, dynamic: category_data})
      }
    }

    load()
    return () => {
      componentMounted = false
    }
  }, [])

  const handleSearch = (f) => {
    setLoading(true)
    const search = category.initial.filter((obj) => obj['name'].toLowerCase().includes(f))
    setCategory((prev) => ({...prev, dynamic: search}))
    setLoading(false)
  }

  return (
    <RootStyle title="Browse by Category - Starjobs">
      <Container maxWidth="sm">
        <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
          <TextField
            fullWidth
            onChange={(e) => handleSearch(e.target.value)}
            label={
              <Box sx={{display: 'flex'}}>
                <SearchIcon sx={{fontSize: 20, mr: 2}} />
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                  Search for jobsters and clients
                </Typography>
              </Box>
            }
          />
        </Stack>
        <ContentStyle>
          {isLoading ? (
            <Box sx={{minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <LoadingScreen />
            </Box>
          ) : (
            <>
              <Box spacing={2} sx={{mb: 10}}>
                {category.dynamic &&
                  category.dynamic.map((v, k) => {
                    return v.status === 1 ? (
                      <Box
                        underline="none"
                        key={k}
                        sx={{
                          display: 'inline-block',
                          width: '43%',
                          m: 1,
                          textAlign: 'center',
                          verticalAlign: {xs: 'top'},
                        }}
                        color="#000"
                      >
                        <Box
                          component="img"
                          src={v.image ? v.image : default_image}
                          sx={{height: {sm: 150, xs: 100}, mx: 'auto', my: {xs: 0, sm: 2}}}
                        />
                        <Typography variant="body2">{v.name}</Typography>
                      </Box>
                    ) : (
                      <Box
                        underline="none"
                        key={k}
                        sx={{
                          display: 'inline-block',
                          width: '43%',
                          m: 1,
                          textAlign: 'center',
                          verticalAlign: {xs: 'top'},
                        }}
                        color="#000"
                      >
                        <Link
                          underline="none"
                          key={k}
                          component={RouterLink}
                          to={v.status === 1 ? `#` : `/gigs/${v.slug}`}
                          sx={{textAlign: 'center'}}
                          color="#000"
                        >
                          <Box
                            component="img"
                            src={v.image}
                            sx={{height: {sm: 150, xs: 100}, mx: 'auto', my: {xs: 0, sm: 2}}}
                          />
                          <Typography variant="body2">{v.name}</Typography>
                        </Link>
                      </Box>
                    )
                  })}
              </Box>
            </>
          )}
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
