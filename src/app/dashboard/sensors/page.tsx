'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
import type {Customer} from "@/components/dashboard/customer/customers-table";
import {objectClient} from "@/lib/objects/object-client";
import SensorsPaginationAndSelectTable from "@/components/tables/sensorsPaginationAndSelectTable";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ModalNewSensor from "@/components/modal/modal-new-sensor";
import {sensorsClient} from "@/lib/sensors/sensors-client";
import {useRouter} from "next/navigation";
import SpinnerWithAlert from "@/lib/common/SpinnerWithAlert";
import DialogInputIP from "@/components/dialog/dialogInputIP";
import ImportExportButtons from "@/lib/common/importExportButtons";
import ModalImportSensor from "@/components/modal/modal-import-sensor";


export default function Page(): React.JSX.Element {
  const router = useRouter();
  const [sensors, setSensors] = useState([]);
  const [objects, setObjects] = useState([]);
  const [isSelectedSensors, setIsSelectedSensors] = useState([]);
  const [typesSensors, setTypesSensors] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isIPAddress, setIsIPAddress] = useState<string>('');
  const [isIDSensor, setIsIDSensor] = useState<string>('');
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('error');
  const [showChoice, setShowChoice] = useState<boolean>(false)
  const [page, setPage] = React.useState<number>(0);


  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAllSensors(), fetchAllTypeSensors(), fetchAllObjects()])
      .then(async ([sensorsData, sensorsTypeData, objectData]): any => {
        let selected = [];
        if (sensorsData?.data?.allSensors.length > 0) {
          setSensors(sensorsData?.data?.allSensors);
          setTypesSensors(sensorsTypeData?.data?.allSensors)
          setObjects(objectData.data?.allObjects)
          setLoading(false);
          await restoreAllSensors(sensorsData?.data?.allSensors)
        } else {
          setIsMessage('Ошибка при загрузке данных')
          setLoading(true);
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeImportModal = () => {
    setIsModalImportOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const onExportClick = () => {
    setIsDialogOpen(false);
  };
  const onImportClick = () => {
    setIsModalImportOpen(true);
  };

  const openDialogNewIP = (ip,id) => {
    setIsDialogOpen(true);
    setIsIPAddress(ip)
    setIsIDSensor(id)
  };
  const sendIDToStore=(sensorData)=>{
    localStorage.setItem("sensorData", sensorData)
    router.push("/dashboard/sensors/additional-data-sensor");
  }
  async function fetchAllSensors(): Promise<Customer[]> {
    return await sensorsClient.getAllSensors();
  }

  async function deleteOneSensor(sensor_id) {
   // alert(sensor_id)
    return await sensorsClient.deleteOneSensorFromApi(sensor_id);
  }
  async function fetchAllTypeSensors(): Promise<Customer[]> {
    return await sensorsClient.getAllTypeOfSensors();
  }
  async function fetchAllObjects(): Promise<Customer[]> {
    return await objectClient.getAllObjects();
  }

  async function onRegistrationSensorSuccess(sensorsData) {
    setSensors(sensorsData?.allSensors)
  }

  async function restoreAllSensors(sensorsData) {
    setShowChoice(false)
    let selected: any = [];
    sensorsData.forEach(sensor => {
      // Проверка, существует ли уже organization_id в массиве selected
      if (!selected.includes(sensor.object.id)) {
        // Если нет, добавляем его в массив selected
        selected.push(sensor.object.id);
        setIsSelectedSensors(selected);
      }
    });
  }

  function selectObject(selected) {
    setShowChoice(true)
    if(selected.length > 0) {
      setPage(0)
      setIsSelectedSensors(selected)
    }
  }



  function onSelectedRowsSensors(sensors, selected) {
    // return sensors
    if (sensors?.length > 0) {
      return sensors.filter(obj => selected.includes(obj.object.id));
    } else {
      return [];
    }
  }

  return (
    <Stack spacing={3}>
      {loading?<SpinnerWithAlert isMessage={isMessage} alertColor={alertColor} />:
        <Stack>
          <Typography sx={{marginBottom: 3}} variant="h4">Установленные датчики</Typography>
          <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
          <SensorsPaginationAndSelectTable
            rows={onSelectedRowsSensors(sensors, isSelectedSensors)}
            sendIDToStore={sendIDToStore}
            selectObject={selectObject}
            page={page}
            setPage={setPage}
            openDialogNewIP={openDialogNewIP}
            deleteOneSensor={deleteOneSensor}
          />
          <Box display="flex" justifyContent="space-around" sx={{marginTop: 3}}>
            <Button variant="contained" onClick={openModal}>Добавить датчик на объект</Button>
            {showChoice&&<Button variant="contained" onClick={ () => restoreAllSensors(sensors)}>Сбросить выборку</Button>
            }
          </Box>
        </Stack>}
      <ModalNewSensor isOpen={isModalOpen} onClose={closeModal}
                      onRegistrationSensorSuccess={onRegistrationSensorSuccess} typesSensors={typesSensors}
                      objects={objects}/>
      <ModalImportSensor isOpen={isModalImportOpen} onClose={closeImportModal}
                      onRegistrationSensorSuccess={onRegistrationSensorSuccess} typesSensors={typesSensors}
                      objects={objects}/>
      <DialogInputIP isOpen={isDialogOpen} handleClose={closeDialog} isIPAddress={isIPAddress} setIsIPAddress={setIsIPAddress} isIDSensor={isIDSensor}/>
    </Stack>
  );
}



