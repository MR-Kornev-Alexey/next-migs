'use client';
import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignUpFormOrganization } from '@/components/auth/sign-up-form-organization';
import CheckOrganisation from '@/components/auth/check-organization';
import axios from 'axios';

export default function Page(): React.JSX.Element {
  const [initialData, setInitialData] = React.useState(null);
  const [statusInit, setStatusInit] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json'
        };
        const responseCheckOrganization = await axios.post(
          'http://localhost:5000/organization/check_organization',
          JSON.stringify({'inn': "7716852062"}), // Преобразование объекта в JSON-строку
          { headers } // Передача заголовков в конфигурацию запроса
        );
        setInitialData(responseCheckOrganization.data.organization);
        if(responseCheckOrganization.data.statusCode === 200){
          setStatusInit(true)
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
