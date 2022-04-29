import {useNavigate} from 'react-router-dom'
import {useRef, useState} from 'react'
import {Icon} from '@iconify/react'
import menu2Fill from '@iconify/icons-eva/menu-2-fill'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
// material
import {alpha} from '@mui/material/styles'
import {Button, Box, SwipeableDrawer, Typography, Avatar, IconButton} from '@mui/material'
import PersonIcon from '@mui/icons-material/PersonOutline'
import DocumentScannerOutlined from '@mui/icons-material/DocumentScannerOutlined'
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined'
import ArrowRightIcon from '@mui/icons-material/ChevronRightOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined'
// import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';

// component
// import MenuPopover from '../../components/MenuPopover'
import DiscordDialog from 'src/components/discord/DiscordDialog'

// hooks
import storage from 'src/utils/storage'

// style
import {LoadingButtonStyle} from 'src/theme/style'
import PropTypes from 'prop-types'

const image_bucket = process.env.REACT_APP_IMAGE_URL
export default function AccountPopover({user}) {
  const anchorRef = useRef(null)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleSignOut = async (e) => {
    e.preventDefault()
    await storage.remove()
    navigate(`/login`, {replace: true})
  }

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleRoute = (url) => {
    setOpen(false)
    navigate(`${url}`, {replace: true})
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          bottom: '0 !important',
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bottom: '0 !important',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Icon
          icon={menu2Fill}
          style={{
            width: 30,
            height: 30,
            color: '#FFFFFF'
          }}
        />
      </IconButton>
      <SwipeableDrawer
        anchor={'right'}
        open={open || false}
        onOpen={handleOpen}
        onClose={handleClose}
        sx={{my: 0, backgroundColor: 'rgba(255,255,255,0) !important'}}
      >
        <Box sx={{width: '100vw', height: '100vh', position: 'relative', mb: 0}}>
          <Box
            sx={{
              px: 2.5,
              textAlign: 'center',
              backgroundColor: 'starjobs.main',
              my: 0,
              py: 3,
              borderBottomLeftRadius: 80,
              borderBottomRightRadius: 80
            }}
          >
            <Box
              sx={{
                mr: 1,
                display: 'flex',
                alignItems: {md: 'flex-start', sm: 'flex-start', xs: 'center'},
                px: {sm: 0, xs: 0},
                mb: 1
              }}
            >
              <Avatar
                key={'Profile Picture'}
                alt="Picture"
                src={`${image_bucket}${user.photo}`}
                sx={{margin: '0 auto', width: 80, height: 80, borderRadius: '1rem !important'}}
              />
            </Box>

            <Typography variant="h3" color="common.white" noWrap>
              {user.name}
            </Typography>

            <Typography variant="body2" color="common.white" noWrap>
              {user.email}
            </Typography>

            <Typography variant="body2" color="common.white" noWrap>
              {user.accountType === 0 ? 'Freelancer' : 'Client '}
            </Typography>

            {user.accountType === 0 && (
              <Button variant="outlined" fullWidth sx={{my: 2, ...LoadingButtonStyle, width: '50%'}}>
                Be a Client
              </Button>
            )}
          </Box>
          <Box sx={{p: 2, pt: 1.5}}>
            <nav aria-label="secondary mailbox folders">
              <List>
                {user.isActive && (
                  <ListItem sx={{paddingLeft: '0 !important', paddingRight: '0 !important'}}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Edit profile"
                        onClick={() => handleRoute(`${user.accountType === 1 ? `/client` : `/freelancer`}/edit`)}
                      />
                      <ArrowRightIcon />
                    </ListItemButton>
                  </ListItem>
                )}
                {user.isActive && user.accountType === 1 && (
                  <ListItem sx={{paddingLeft: '0 !important', paddingRight: '0 !important'}}>
                    <ListItemButton>
                      <ListItemIcon>
                        <DocumentScannerOutlined />
                      </ListItemIcon>
                      <ListItemText primary="Edit Documents" onClick={() => handleRoute(`/client/edit/document`)} />
                      <ArrowRightIcon />
                    </ListItemButton>
                  </ListItem>
                )}
                <ListItem sx={{paddingLeft: '0 !important', paddingRight: '0 !important'}}>
                  <ListItemButton>
                    <ListItemIcon>
                      <PasswordOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Change password" onClick={() => handleRoute(`/account/change-password`)} />
                    <ArrowRightIcon />
                  </ListItemButton>
                </ListItem>
                <ListItem sx={{paddingLeft: '0 !important', paddingRight: '0 !important'}}>
                  <ListItemButton component="a" onClick={handleClickOpen}>
                    <ListItemIcon>
                      <HelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Need help" />
                    <ArrowRightIcon />
                  </ListItemButton>
                </ListItem>
                <ListItem sx={{paddingLeft: '0 !important', paddingRight: '0 !important'}}>
                  <ListItemButton
                    component="a"
                    onClick={(e) => {
                      handleSignOut(e)
                    }}
                  >
                    <ListItemIcon>
                      <ExitToAppOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sign out" />
                    <ArrowRightIcon />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </Box>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              fontWeight: '400',
              width: '90%',
              fontSize: '0.85rem',
              position: 'absolute',
              bottom: 30,
              left: 0,
              right: 0,
              mx: 'auto',
              opacity: 1
            }}
          >
            Click to Hide
          </Button>
        </Box>
        <DiscordDialog open={openDialog} handleClose={handleCloseDialog} />
      </SwipeableDrawer>

      {/* 
      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.accountType === 0 ? 'Freelancer' : 'Client '}
          </Typography>

          {user.accountType === 0 ?
            <Button variant="outlined" fullWidth sx={{ my: 2 }}>
              Be a Client
            </Button> : ""}

        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <HelpButton />
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={(e) => {
              handleSignOut(e)
            }}
          >
            Sign out
          </Button>
        </Box>
      </MenuPopover>
      */}
    </>
  )
}

AccountPopover.propTypes = {
  user: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
}
