import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {ArrowFatLineRight, PencilSimpleLine} from "@phosphor-icons/react";
import Link from "@mui/material/Link";



export interface NotificationPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function NotificationPopover({ anchorEl, onClose, open }: NotificationPopoverProps): React.JSX.Element {
  const notifications = useSelector((state: RootState) => state.notifications.value);
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '400px' } } }}
    >
      <Box sx={{ py: 1}}>
        <Typography variant="h6">Уведомления</Typography>
      </Box>
      {notifications.map(item => (
        <Box key={item.id}>
          <Box sx={{marginTop:2}} variant="body1">{item.text} </Box>
          <Link component={RouterLink} href={item.link} underline="hover" variant="subtitle2">
            {item.button}
          </Link>
        </Box>
      ))
      }
      <Box sx={{ py: 1}} display="flex" alignItems="center">
        <PencilSimpleLine fontSize="var(--icon-fontSize-md)" />
        <Typography sx={{marginLeft: 2}} variant="subtitle1">Новое уведомление</Typography>
      </Box>
    </Popover>
  );
}
