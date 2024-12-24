import { Badge, IconButton, Popover, Tooltip } from '@mui/material'
import { Bell } from 'phosphor-react'
import { MouseEvent, useEffect, useState } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { UserNotification } from '../models'
import { getUserNotifications } from '../services/notification.service'
import { dateFormatter } from '../utils/formatter'

export function UserNotifications() {
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    const subscription = getUserNotifications(user!.uid).subscribe({
      next: (notifications) => {
        setNotifications(notifications)
      },
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleNotificationRead() {}

  const open = Boolean(anchorEl)
  const id = open ? 'notifications-popover' : undefined

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton onClick={handleClick}>
          <Badge color="primary" badgeContent={notifications.length}>
            <Bell size={20} weight="fill" color="#ffffff" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="w-64 p-4">
          <div className="text-center text-lg font-semibold">Notificações</div>
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="space-y-2"
                onFocus={handleNotificationRead}
              >
                <div className="flex justify-between items-center">
                  <strong className="text-sm">{notification.title}</strong>{' '}
                  <span className="text-xs">
                    {dateFormatter.format(new Date(notification.created_at))}
                  </span>
                </div>
                <p className="text-sm text-justify">{notification.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Popover>
    </>
  )
}
