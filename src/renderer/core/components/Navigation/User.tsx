import React from 'react'
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles'
import {
  Tooltip,
  Typography,
  MenuItem,
  Divider,
  Avatar,
  Badge,
} from '@material-ui/core'

import useAuth from '@shared/hooks/useAuth'
import useSynchronousRecords from '@shared/hooks/useSynchronousRecords'

import Login from './Login'

const StyledBadge = withStyles((theme) =>
  createStyles({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  })
)(Badge)

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: '#4f4f4f',
    cursor: 'pointer',
  },
  item: {
    fontSize: 14,
    '&:hover': {
      background: '#323945',
    },
  },
  profile: {
    color: '#7ec3e2',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '&:hover': {
      background: 'none',
    },
  },
}))

const User: React.FC = () => {
  const classes = useStyles()
  const { hasAuth, user, resetAuth } = useAuth()
  const { loading } = useSynchronousRecords()

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem('hbt_token')
    resetAuth()
  }, [resetAuth])

  const AvatarBadge = loading ? StyledBadge : Badge

  if (hasAuth) {
    return (
      <Tooltip
        title={
          <div>
            <MenuItem
              className={classes.profile}
              classes={{ root: classes.item }}
              style={{ cursor: 'default' }}
              dense={false}
            >
              <Typography>{user?.bnetTag}</Typography>
            </MenuItem>
            <Divider light />
            <MenuItem classes={{ root: classes.item }} onClick={handleLogout}>
              退出登录
            </MenuItem>
          </div>
        }
        placement="right"
        arrow
        interactive
      >
        <AvatarBadge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          variant="dot"
        >
          <Avatar className={classes.small}>{user?.bnetTag?.[0]}</Avatar>
        </AvatarBadge>
      </Tooltip>
    )
  }
  return <Login />
}

export default User
