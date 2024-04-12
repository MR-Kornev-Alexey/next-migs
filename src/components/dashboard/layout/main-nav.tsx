'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import {AppDispatch, RootState} from "@/store/store";
import {useDispatch, useSelector} from "react-redux";
import {addNotifications} from "@/store/notificationReducer";

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [dataUserInComponent, setDataUserInComponent] = React.useState('');
  const userPopover = usePopover<HTMLDivElement>();
  const dispatch: AppDispatch = useDispatch();
  const dataUser = JSON.parse(localStorage.getItem('custom-auth-token'))
  let registrationStatus;
  if (dataUser !== null) {
    registrationStatus = dataUser.registration_status;
  }
  const [notificationSent, setNotificationSent] = React.useState(false);
  function setNotification() {
    if (registrationStatus === "NOT_COMPLETED" && !notificationSent) {
      const message = { id: '549377a0-c92a-4e7f-a45f-f71c807844f0', label: 'Внимание! В данном профиле не заполнены все данные.', link: '/dashboard/account' }
      dispatch(addNotifications(message));
      setNotificationSent(true); // Обновление состояния на основе предыдущего состояния
    }
  }
  React.useEffect(() => {
    setNotification();
  }, []);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/migs/user_avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover  anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open}  />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
