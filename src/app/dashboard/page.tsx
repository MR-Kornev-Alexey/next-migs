
'use client';
import * as React from 'react';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {Notifications} from "@/components/dashboard/settings/notifications";

export default function Page(): React.JSX.Element {
  const usersData = useSelector((state: RootState) => state.user.value);
  console.log('usersData - ', usersData)
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Уведомления</Typography>
      </div>
      <Notifications />
      {/*<UpdatePasswordForm />*/}
    </Stack>
  );
}
