import {Icon} from '@iconify/react'
import {useRef, useState} from 'react'
import editFill from '@iconify/icons-eva/edit-fill'
import {Link as RouterLink} from 'react-router-dom'
import trash2Outline from '@iconify/icons-eva/trash-2-outline'
import eyeOutline from '@iconify/icons-eva/eye-outline'
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill'
// material
import {Menu, MenuItem, IconButton, ListItemIcon, ListItemText} from '@material-ui/core'

export default function UserMoreMenu({user}) {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {width: 200, maxWidth: '100%'},
        }}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <MenuItem sx={{color: 'text.secondary'}} component={RouterLink} to={`/dashboard/store/view/${user._id}`}>
          <ListItemIcon>
            <Icon icon={eyeOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="View" primaryTypographyProps={{variant: 'body2'}} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`/dashboard/store/edit/${user._id}`} sx={{color: 'text.secondary'}}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{variant: 'body2'}} />
        </MenuItem>

        <MenuItem sx={{color: 'text.secondary'}}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{variant: 'body2'}} />
        </MenuItem>
      </Menu>
    </>
  )
}
