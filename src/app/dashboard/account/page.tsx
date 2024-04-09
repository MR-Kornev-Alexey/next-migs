
'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { AccountInfo } from '@/components/dashboard/account/account-info';
import {ProfileForm} from "@/components/dashboard/account/profile-form";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useEffect} from "react";
import {addNotifications} from "@/store/notificationReducer";
import {AccountDetailsForm} from "@/components/dashboard/account/account-details-form";

export default function Page(): React.JSX.Element {
  const dataUser:any = JSON.parse(localStorage.getItem('custom-auth-token'));
  let [checkAdditionalData, setCheckAdditionalData] = React.useState(false);

  useEffect(() => {
    if (dataUser?.registration_status === 'COMPLETED') {
      setCheckAdditionalData(true);
    }
  }, []);
  const toggleStatus = () => {
    setCheckAdditionalData(checkAdditionalData=!checkAdditionalData);
  }
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Профиль</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo dataUser={dataUser}/>
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          {checkAdditionalData?<AccountDetailsForm changeData={toggleStatus} dataUser = {dataUser}/>:
            <ProfileForm changeData={toggleStatus} />
          }
        </Grid>
      </Grid>
    </Stack>
  );
}
