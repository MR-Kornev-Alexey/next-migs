'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
import type {Customer} from "@/components/dashboard/customer/customers-table";
import {organizationClient} from "@/lib/organizations/organization-client";
import {objectClient} from "@/lib/objects/object-client";
import ObjectsPaginationAndSelectTable from "@/components/tables/objectsPaginationAndSelectTable";
import SensorsPaginationAndSelectTable from "@/components/tables/sensorsPaginationAndSelectTable";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ModalNewSensor from "@/components/modal/modal-new-sensor";
import Alert from "@mui/material/Alert";
import {SignUpFormNewSensor} from "@/components/auth/sign-up-form-new-sensor";



export default function Page(): React.JSX.Element {
  const [sensors, setSensors] = useState([]);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('error');


  const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
      setExpanded(!expanded);
    };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  useEffect(() => {
    Promise.all([fetchAllOrganizations(), fetchAllObjects()])
      .then(([organizationsData, objectsData]) => {
        setLoading(true);
        if(objectsData?.data.length > 0) {
          setSensors(organizationsData?.data);
          setObjects(objectsData?.data);
        }
        else {
          setIsMessage('Ошибка при загрузке данных')
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  async function fetchAllOrganizations(): Promise<Customer[]> {
    return await organizationClient.getAllOrganization();
  }


  async function fetchAllObjects(): Promise<Customer[]> {
    return await objectClient.getAllObjects();
  }
  async function onRegistrationSuccess(objectsData) {
    console.log(objectsData.data.allObjects)
    setObjects(objectsData?.data.allObjects);
  }


  return (
    <Stack spacing={3}>
      {!loading?<Stack>
          <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24">
            <rect width={7.33} height={7.33} x={1} y={1} fill="currentColor">
              <animate id="svgSpinnersBlocksWave0" attributeName="x" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s"
                       values="1;4;1"></animate>
              <animate attributeName="y" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s" values="1;4;1"></animate>
              <animate attributeName="width" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
            <rect width={7.33} height={7.33} x={8.33} y={1} fill="currentColor">
              <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                       values="8.33;11.33;8.33"></animate>
              <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s" values="1;4;1"></animate>
              <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
            <rect width={7.33} height={7.33} x={1} y={8.33} fill="currentColor">
              <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s" values="1;4;1"></animate>
              <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                       values="8.33;11.33;8.33"></animate>
              <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
            <rect width={7.33} height={7.33} x={15.66} y={1} fill="currentColor">
              <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="15.66;18.66;15.66"></animate>
              <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s" values="1;4;1"></animate>
              <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
            <rect width={7.33} height={7.33} x={8.33} y={8.33} fill="currentColor">
              <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="8.33;11.33;8.33"></animate>
              <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="8.33;11.33;8.33"></animate>
              <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
            <rect width={7.33} height={7.33} x={1} y={15.66} fill="currentColor">
              <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s" values="1;4;1"></animate>
              <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="15.66;18.66;15.66"></animate>
              <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
            <rect width={7.33} height={7.33} x={15.66} y={8.33} fill="currentColor">
              <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                       values="15.66;18.66;15.66"></animate>
              <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                       values="8.33;11.33;8.33"></animate>
              <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
            <rect width={7.33} height={7.33} x={8.33} y={15.66} fill="currentColor">
              <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                       values="8.33;11.33;8.33"></animate>
              <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                       values="15.66;18.66;15.66"></animate>
              <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
            <rect width={7.33} height={7.33} x={15.66} y={15.66} fill="currentColor">
              <animate id="svgSpinnersBlocksWave1" attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.4s" dur="0.6s"
                       values="15.66;18.66;15.66"></animate>
              <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.4s" dur="0.6s"
                       values="15.66;18.66;15.66"></animate>
              <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.4s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
              <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.4s" dur="0.6s"
                       values="7.33;1.33;7.33"></animate>
            </rect>
          </svg>
          {isMessage&&<Alert color={alertColor}>{isMessage}</Alert>}
        </Stack>:
        <Stack>
            <Typography variant="h5">Выберите объект до просмотра датчиков</Typography>
            <Button sx={{marginY: 2, width: 200}} variant="contained"
                    onClick={toggleExpanded}>{expanded ? 'Скрыть' : 'Раскрыть'}</Button>
            {expanded && (
              <Box>
                <ObjectsPaginationAndSelectTable rows={objects}/>
              </Box>
            )}
            <Typography variant="h4">Датчики</Typography>
            <SensorsPaginationAndSelectTable openModal={openModal} rows={objects}/>
        </Stack>}

      <ModalNewSensor isOpen={isModalOpen} onClose={closeModal} onRegistrationSuccess={onRegistrationSuccess} isAllObjects = {objects}/>
    </Stack>
  );
}



