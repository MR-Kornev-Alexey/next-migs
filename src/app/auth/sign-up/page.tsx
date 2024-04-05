'use client';
import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignUpForm } from '@/components/auth/sign-up-form';
import {organizationClient} from "@/lib/organizations/organization-client";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import RouterLink from "next/link";
import {paths} from "@/paths";
import Box from "@mui/material/Box";
import {customersClient} from "@/lib/customers/customers-client";


export default function Page(): React.JSX.Element {
  const [statusInit, setStatusInit] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json'
        };
        const responseCheckOrganization = await customersClient.findRoleCustomer({"role":"supervisor"})
        if(responseCheckOrganization?.data.statusCode === 200){
          setStatusInit(true)
        } else {
          setStatusInit(false)
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <Layout>
      <GuestGuard>
        {statusInit?
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4" sx={{textAlign: "center"}}>Регистрация Supervisor произведена</Typography>
            </Stack>
            <Box>
              <Link component={RouterLink} href={paths.auth.signIn} variant="body1">
                 Перейти >>
              </Link>
            </Box>
          </Stack> : <SignUpForm/>
        }
      </GuestGuard>
    </Layout>
  );
}
