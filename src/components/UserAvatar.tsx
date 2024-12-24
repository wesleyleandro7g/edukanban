import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { SignOut } from 'phosphor-react'
import { MouseEvent, useState } from 'react'

import { useAuth } from './../contexts/AuthContext'

export function UserAvatar() {
  const { logOut } = useAuth()

  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null)
  const userMenuOpen = Boolean(userMenuAnchor)

  function handleUserMenuClick(event: MouseEvent<HTMLElement>) {
    setUserMenuAnchor(event.currentTarget)
  }

  function handleUserMenuClose() {
    setUserMenuAnchor(null)
  }

  return (
    <>
      <Tooltip title="Configurações">
        <IconButton
          onClick={handleUserMenuClick}
          size="small"
          aria-controls={userMenuOpen ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={userMenuOpen ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={userMenuAnchor}
        id="account-menu"
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <SignOut />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </>
  )
}
