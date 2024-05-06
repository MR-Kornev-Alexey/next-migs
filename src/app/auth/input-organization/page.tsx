'use client';
import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignUpFormOrganization } from '@/components/auth/sign-up-form-organization';
import CheckOrganisation from '@/components/auth/check-organization';
import { organizationClient } from "@/lib/organizations/organization-client";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

function Page(): React.JSX.Element {
  const [initialData, setInitialData] = React.useState(null);
  const [statusInit, setStatusInit] = React.useState(false);
  const [isMain, setIsMain] = React.useState(true);
  const [isMessage, setIsMessage] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await organizationClient.checkOrganization({'inn': "7716852062"});
        if (result?.data.statusCode === 200) {
          setStatusInit(true);
          setIsMain(false);
          setInitialData(result?.data.organization);
          setIsMessage("");
        }
      } catch (error) {
        console.error('Ошибка при записи данных:', error);
        setIsMessage("Ошибка проверки данных");
        setIsError(true);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (isError) {
      return <Alert sx={{marginTop:2}} color="error">{isMessage}</Alert>;
    } else {
      return statusInit ? <CheckOrganisation initialData={initialData}/> : <SignUpFormOrganization isMain={isMain} onRegistrationSuccess={handleRegistrationSuccess} />;
    }
  };
  const handleRegistrationSuccess = (result) => {
    setStatusInit(true);
    setInitialData(result?.data.organization);
  };

  return (
    <Layout>
      <GuestGuard>
        <Box>
          {renderContent()}
        </Box>
      </GuestGuard>
    </Layout>
  );
}

export default Page;

