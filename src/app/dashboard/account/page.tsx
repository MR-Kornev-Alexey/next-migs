
'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { AccountInfo } from '@/components/dashboard/account/account-info';
import {ProfileForm} from "@/components/dashboard/account/profile-form";
import {useEffect, useState} from "react";
import {AccountDetailsForm} from "@/components/dashboard/account/account-details-form";
import {customersClient} from "@/lib/customers/customers-client";
import Alert from "@mui/material/Alert";
import SpinnerWithAlert from "@/lib/common/SpinnerWithAlert";

export default function Page(): React.JSX.Element {
  let [checkAdditionalData, setCheckAdditionalData] = React.useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('error');
  const [receivedData, setReceivedData] = React.useState<string>('');
  const [flagEdit, setFlagEdit] = useState<boolean>(false);

  const dataUser = localStorage.getItem('custom-auth-token');
  let token = '', email = '';
  if (dataUser !== null) {
    email = JSON.parse(dataUser).email;
  }
  useEffect(() => {
    setLoading(false);
    setIsMessage("");

    fetchDataOfUser(email)
      .then((usersData) => {
        switch (usersData?.data?.statusCode) {
          case 200:
            setAlertColor("success");
            setIsMessage(usersData?.data?.message || "");
            setReceivedData(usersData?.data?.customer);
            if (usersData?.data?.customer?.registration_status === "COMPLETED") {
              setCheckAdditionalData(true);
            } else {
              setCheckAdditionalData(false);
            }
            clearMessageWithDelay();
            setLoading(true);
            break;
          case 400:
          case 500:
            setAlertColor("error");
            setIsMessage(usersData?.data?.message || "");
            clearMessageWithDelay();
            break;
          default:
            // Обрабатываем ошибку
            setAlertColor("error");
            setIsMessage(
              usersData?.error?.message || "Произошла ошибка обработки данных"
            );
            clearMessageWithDelay();
            break;
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
      });
  }, []);

  async function fetchDataOfUser(email): Promise<any> {
    return await customersClient.getDataAboutOneCustomer(email);
  }

  const successRecorded = (data) => {
    setReceivedData(data.customer)
    toggleStatus()
  };

  const clearMessageWithDelay = () => {
    setTimeout(() => {
      setIsMessage("");
    }, 2000);
  };

  const toggleStatus = () => {
    setCheckAdditionalData(checkAdditionalData=!checkAdditionalData);
    if(!checkAdditionalData){
      setFlagEdit(true)
    }
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Профиль</Typography>
      </div>
      {!loading ? <SpinnerWithAlert isMessage={isMessage} alertColor={alertColor}/> :
        <Stack spacing={3}>

          <Grid container spacing={3}>
            <Grid lg={4} md={6} xs={12}>
              <AccountInfo dataUser={receivedData}/>
            </Grid>
            <Grid lg={8} md={6} xs={12}>
              {checkAdditionalData ? <AccountDetailsForm changeData={toggleStatus} dataUser={receivedData}/> :
                <ProfileForm changeData={toggleStatus} flagEdit={flagEdit} receivedData={receivedData} successRecorded={successRecorded}/>
              }
            </Grid>
          </Grid>
        </Stack>}
      {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
    </Stack>
  );
}
