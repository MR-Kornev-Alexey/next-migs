'use client';
import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignUpFormOrganization } from '@/components/auth/sign-up-form-organization';
import CheckOrganisation from '@/components/auth/check-organization';
import axios from 'axios';
import {organizationClient} from "@/lib/organizations/organization-client";

export default function Page(): React.JSX.Element {
  const [initialData, setInitialData] = React.useState(null);
  const [statusInit, setStatusInit] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json'
        };
        const responseCheckOrganization = await organizationClient.checkOrganization({'inn': "7716852062"})
        if(responseCheckOrganization?.data.statusCode === 200){
          setStatusInit(true)
          setInitialData(responseCheckOrganization?.data.organization);
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
        {statusInit?<CheckOrganisation initialData={initialData}/>:<SignUpFormOrganization  />
        }
      </GuestGuard>
    </Layout>
  );
}
