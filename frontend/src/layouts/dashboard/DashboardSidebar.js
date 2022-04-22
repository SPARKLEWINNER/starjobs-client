import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'
import {Link as RouterLink, useLocation} from 'react-router-dom'
import {alpha, styled} from '@mui/material/styles'
import {Box, Link, Button, Drawer, Typography, Avatar, Stack, Tooltip, CardActionArea} from '@mui/material'
import Logo from '../../components/Logo'
import Scrollbar from '../../components/Scrollbar'
import NavSection from '../../components/NavSection'
import {MHidden} from '../../components/@material-extend'
import SidebarConfigStore from './SidebarConfigStore'
import SidebarConfigEmployee from './SidebarConfigEmployee'
import useCollapseDrawer from 'src/utils/hooks/drawer'
import {DocIllustration} from '../../assets'
import discord_api from 'src/lib/discord'
const DRAWER_WIDTH = 280
const COLLAPSE_WIDTH = 102

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}))

const AccountStyle = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}))

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
}

IconCollapse.propTypes = {
  onToggleCollapse: PropTypes.func,
  collapseClick: PropTypes.bool
}

function IconCollapse({onToggleCollapse, collapseClick}) {
  return (
    <Tooltip title="Mini Menu">
      <CardActionArea
        onClick={onToggleCollapse}
        sx={{
          width: 18,
          height: 18,
          display: 'flex',
          cursor: 'pointer',
          borderRadius: '50%',
          alignItems: 'center',
          color: 'text.primary',
          justifyContent: 'center',
          border: 'solid 1px currentColor',
          ...(collapseClick && {
            borderWidth: 2
          })
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'currentColor',
            transition: (theme) => theme.transitions.create('all'),
            ...(collapseClick && {
              width: 0,
              height: 0
            })
          }}
        />
      </CardActionArea>
    </Tooltip>
  )
}

export default function DashboardSidebar({isOpenSidebar, onCloseSidebar, account}) {
  const {isCollapse, collapseClick, collapseHover, onHoverEnter, onHoverLeave} = useCollapseDrawer()
  const {pathname} = useLocation()
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, account])

  const handleHelpCenterClick = async (e) => {
    var message = ''
    message = prompt(
      'How can we help you? - <name/phone#/email - branch - [issue/feedback]>',
      'Input name/phone#/email - branch - [issue/problem/inquiry/feedback]'
    )

    if (message === null) return

    let params = JSON.stringify({
      username: 'Captain Sparkle',
      avatar_url: 'https://www.sparkles.com.ph/static/2629bb8535ba6ae5406fc9385dadc2e0/497c6/Spark--noodles.png',
      content: `Starjobs Help - Version 1 \n**Issue:**\n ${message}`
    })

    const result = await discord_api.send_message(params)

    if (!result.ok) return alert('Unable to submit your request for assistance')
    return alert('Thank you for your patience, we will contact you ASAP.')
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: 'center'
          })
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box component={RouterLink} to="/" sx={{display: 'inline-flex'}}>
            <Logo />
          </Box>
        </Stack>

        {isCollapse ? (
          <Avatar sx={{mx: 'auto', mb: 2}} src={account.image} />
        ) : (
          <Link underline="none" component={RouterLink} to={`/stores/app`}>
            <AccountStyle>
              <Avatar src={account.image} />
              <Box sx={{ml: 2}}>
                <Typography variant="subtitle2" sx={{color: 'text.primary'}}>
                  {account?.displayName}
                </Typography>
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                  {account?.role === 1 || account?.role === 4 ? 'Store' : 'Employee'}
                </Typography>
              </Box>
            </AccountStyle>
          </Link>
        )}
      </Stack>

      {account.role === 0 ? (
        <NavSection account={account} navConfig={SidebarConfigEmployee} isShow={!isCollapse} />
      ) : (
        ''
      )}
      {account.role === 1 ? (
        <NavSection account={account} navConfig={SidebarConfigStore._configWOBranch} isShow={!isCollapse} />
      ) : (
        ''
      )}
      {account.role === 4 ? (
        <NavSection account={account} navConfig={SidebarConfigStore._config} isShow={!isCollapse} />
      ) : (
        ''
      )}
      <Box sx={{flexGrow: 1}} />
      {!isCollapse && (
        <Stack spacing={3} alignItems="center" sx={{px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center'}}>
          <DocIllustration sx={{width: 1}} />

          <div>
            <Typography gutterBottom variant="subtitle1">
              Hi, {account?.displayName}
            </Typography>
            <Typography variant="body2" sx={{color: 'text.secondary'}}>
              Need help?
              <br /> Send us an message
            </Typography>
          </div>
          <Button variant="contained" onClick={() => handleHelpCenterClick()}>
            Contact Us
          </Button>
        </Stack>
      )}
    </Scrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {width: DRAWER_WIDTH}
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                borderRight: 0,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
              })
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  )
}
