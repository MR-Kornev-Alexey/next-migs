'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';
import {useEffect, useState} from 'react';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { sensorsClient } from '@/lib/sensors/sensors-client';
import {AppDispatch} from "@/store/store";
import {useDispatch} from "react-redux";
import {addSensors} from "@/store/sensorsReducer";
import {objectClient} from "@/lib/objects/object-client";
import {addObjects} from "@/store/objectReducer";
import {SvgSpinnersBarsRotateFade} from "@/lib/animated-icon/bar-rotate-fade";
import Alert from "@mui/material/Alert";
import {addTypeOfSensors} from "@/store/typeOfSensorsReducer";

interface LayoutProps {
  children: React.ReactNode;
}

async function fetchAllSensors(): Promise<Customer[]> {
  return await sensorsClient.getAllSensors();
}
async function fetchAllObjects(): Promise<Customer[]> {
  return await objectClient.getAllObjects();
}

async function fetchAllTypeSensors(): Promise<Customer[]> {
  return await sensorsClient.getAllTypeOfSensors();
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('');
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sensorsData, objectsData, sensorsTypeData] = await Promise.all([
          fetchAllSensors(),
          fetchAllObjects(),
          fetchAllTypeSensors()
        ]);

        if (sensorsData?.data?.allSensors.length > 0) {
          dispatch(addSensors(sensorsData.data.allSensors));
        } else {
          setAlertColor("error");
          setIsMessage('Не удалось загрузить данные сенсоров');
        }

        if (objectsData?.data?.allObjects.length > 0) {
          dispatch(addObjects(objectsData.data.allObjects));
        } else {
          setAlertColor("error");
          setIsMessage('Не удалось загрузить данные объектов');
        }

        if (sensorsTypeData?.data?.allSensorsType.length > 0) {
          dispatch(addTypeOfSensors(sensorsTypeData.data.allSensorsType));
        } else {
          setAlertColor("error");
          setIsMessage('Не удалось загрузить данные типов сенсоров');
        }

        setLoading(false); // Set loading to false only if all data successfully loaded
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setAlertColor("error");
        setIsMessage(`Ошибка: ${error.message}`);
        setLoading(false); // Set loading to false in case of error
      }
    };

    loadData();
  }, [dispatch]);


  return (
    <>
      {loading?<Box display='flex' justifyContent='center' alignItems='center' >
        <SvgSpinnersBarsRotateFade/>

        </Box>: <AuthGuard>
        <GlobalStyles
          styles={{
            body: {
              '--MainNav-height': '56px',
              '--MainNav-zIndex': 1000,
              '--SideNav-width': '280px',
              '--SideNav-zIndex': 1100,
              '--MobileNav-width': '320px',
              '--MobileNav-zIndex': 1100,
            },
          }}
        />
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-background-default)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: '100%',
          }}
        >
          <SideNav />
          <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
            <MainNav />
            <main>
              <Container maxWidth="xl" sx={{ py: '64px' }}>
                {children}
              </Container>
            </main>
          </Box>
        </Box>
      </AuthGuard>
      }
      {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
    </>
  );
}
