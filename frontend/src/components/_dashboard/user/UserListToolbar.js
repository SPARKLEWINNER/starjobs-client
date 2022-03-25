import {Link as RouterLink} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Icon} from '@iconify/react'
import searchFill from '@iconify/icons-eva/search-fill'
import trash2Fill from '@iconify/icons-eva/trash-2-fill'
import archiveOutline from '@iconify/icons-eva/archive-outline'
import roundFilterList from '@iconify/icons-ic/round-filter-list'
// material
import {styled} from '@material-ui/core/styles'
import {Box, Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Link} from '@material-ui/core'

const RootStyle = styled(Toolbar)(({theme}) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}))

const SearchStyle = styled(OutlinedInput)(({theme}) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {width: 320, boxShadow: theme.customShadows.z8},
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}))

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
}

export default function UserListToolbar({numSelected, filterName, onFilterName}) {
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'starjobs.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user by email"
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{color: 'text.disabled'}} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <div>
          <Tooltip title="Filter list">
            <IconButton>
              <Icon icon={roundFilterList} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Archived user list">
            <Link component={RouterLink} to={'/stores/user/archive'} style={{textDecoration: 'none'}}>
              <IconButton>
                <Icon icon={archiveOutline} />
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      )}
    </RootStyle>
  )
}
