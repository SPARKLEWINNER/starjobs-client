import React from 'react'
import {Icon} from '@iconify/react'
import {useRef, useState} from 'react'
// import editFill from '@iconify/icons-eva/edit-fill'
import archiveOutline from '@iconify/icons-eva/archive-outline'
import {Link as RouterLink} from 'react-router-dom'
import trash2Outline from '@iconify/icons-eva/trash-2-outline'
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill'
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core'

import {useSnackbar} from 'notistack5'

//api

import useUser from 'api/users'
import storage from 'utils/storage'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function UserMoreMenu({id}) {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [openArchive, setOpenArchive] = useState(false)
  const {enqueueSnackbar} = useSnackbar()

  const handleClickOpen = () => {
    setOpen(true)
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setOpen(false)
  }

  const handleClickOpenArchive = () => {
    setOpenArchive(true)
    setIsOpen(false)
  }

  const handleCloseArchive = () => {
    setOpenArchive(false)
    setOpen(false)
  }

  const handleRemove = async () => {
    const local_user = await storage.getUser()

    if (!local_user) {
      setOpen(false)
      return enqueueSnackbar('Unable to process action', {variant: 'error'})
    }

    if (!id) {
      setOpen(false)
      return enqueueSnackbar('Unable to remove the user', {variant: 'error'})
    }

    const user = JSON.parse(local_user)
    const result = await useUser.remove_user(user._id, id)
    if (!result.ok) return enqueueSnackbar(result.data.msg, {variant: 'error'})

    enqueueSnackbar('User deleted success', {variant: 'success'})
    setOpen(false)
    window.location.reload()
  }

  const handleArchive = async () => {
    setOpen(false)
    const local_user = await storage.getUser()

    if (!local_user) {
      setOpen(false)
      return enqueueSnackbar('Unable to process action', {variant: 'error'})
    }

    if (!id) {
      setOpen(false)
      return enqueueSnackbar('Unable to remove the user', {variant: 'error'})
    }
    const user = JSON.parse(local_user)
    const result = await useUser.restore_user(user._id, id)
    if (!result.ok) return enqueueSnackbar(result.data.msg, {variant: 'error'})

    enqueueSnackbar('User restore success', {variant: 'success'})
    setOpen(false)
    window.location.reload()
  }

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
        <MenuItem sx={{color: 'text.secondary'}}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" onClick={handleClickOpen} primaryTypographyProps={{variant: 'body2'}} />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{color: 'text.secondary'}}>
          <ListItemIcon>
            <Icon icon={archiveOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Restore User"
            onClick={handleClickOpenArchive}
            primaryTypographyProps={{variant: 'body2'}}
          />
        </MenuItem>
      </Menu>

      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{'Do you wish to proceed with this action?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Once action processed you may not be able to retrieve the data.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={handleRemove} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={openArchive}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseArchive}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{'Do you wish to restore this User?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Once action processed the User will have access again to the website.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseArchive} color="primary">
              No
            </Button>
            <Button onClick={handleArchive} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}
