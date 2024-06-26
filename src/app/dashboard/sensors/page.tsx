'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
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
import DialogChangeNetAddress from "@/components/dialog/dialog-change-net-adress";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import handleApiResponse from "@/lib/common/handle-api-response";
import {addSensors, updateSensors} from "@/store/sensorsReducer";
import {Alert} from "@mui/material";
import updateSensorsAfterAPI from "@/lib/common/update-sensors-after-api";
import handleApiError from "@/lib/common/handle-api-error";
import {addSelectedSensor} from "@/store/selectedSensorReducer";

export default function Page(): React.JSX.Element {
  const allSensors = useSelector((state: RootState) => state.allSensors.value);
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const allTypesSensors = useSelector((state: RootState) => state.allTypesOfSensors.value);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [sensors, setSensors] = useState([]);
  const [objects, setObjects] = useState(allObjects);
  const [isSelectedSensors, setIsSelectedSensors] = useState([]);
  const [typesSensors, setTypesSensors] = useState(allTypesSensors);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpenModal] = useState<boolean>(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogOpenNetAddress, setIsDialogOpenNetAddress] = useState<boolean>(false);
  const [isNetAddress, setIsNetAddress] = useState<string>('');
  const [isIPAddress, setIsIPAddress] = useState<string>('');
  const [isIDSensor, setIsIDSensor] = useState<string>('');
  const [isMessage, setIsMessageNew] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('error');
  const [showChoice, setShowChoice] = useState<boolean>(false)
  const [page, setPage] = React.useState<number>(0);


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

  const closeDialogNetAddress = () => {
    setIsDialogOpenNetAddress(false);
  };

  const onExportClick = () => {
    setIsDialogOpen(false);
  };
  const onImportClick = () => {
    setIsModalImportOpen(true);
  };

  const openDialogNewIP = (ip, id) => {
    setIsDialogOpen(true);
    setIsIPAddress(ip)
    setIsIDSensor(id)
  };
  const sendIDToStore = (sensorData) => {
    localStorage.setItem("sensorData", sensorData)
    dispatch(addSelectedSensor(sensorData))
    router.push("/dashboard/sensors/additional-data-sensor");
  }

  async function deleteOneSensor(sensor_id) {
    const sensorsData: any = await sensorsClient.deleteOneSensorFromApi(sensor_id);
    dispatch(addSensors(sensorsData.data.allSensors))
  }

  const setIsMessage = (message) => {
    setIsMessageNew(message)
    setTimeout(() => {
      setIsMessageNew('')
    }, 2000)
  }

  async function handleApiCall(apiCall, sensor_id, updateSensorsCallback, successCallback) {
    try {
      const result: any = await apiCall(sensor_id);
      const updatedSensors = await updateSensorsCallback(allSensors, result?.data?.oneSensor);
      handleApiResponse({
        result,
        successCallback: () => {
          dispatch(updateSensors(updatedSensors));
          if (successCallback) successCallback(result);
        },
        setAlertColor,
        setIsMessage,
        setIsOpenModal
      });
    } catch (error) {
      handleApiError(error, setIsMessage);
    }
  }

  async function updateSensorDesignation(sensor_id, value) {
    await handleApiCall(
      (id) => sensorsClient.changeDesignationOneSensorFromApi(id, value),
      sensor_id,
      updateSensorsAfterAPI
    );
  }

  async function handleChangeStatus(sensor_id) {
    await handleApiCall(
      sensorsClient.changeStatusOneSensorFromApi,
      sensor_id,
      updateSensorsAfterAPI
    );
  }

  async function sendUpdatedSensor(updatedData) {
    const updatedSensors = await updateSensorsAfterAPI(allSensors, updatedData)
    dispatch(updateSensors(updatedSensors))
  }

  async function handleChangeNetAddress(network_number, sensor_id) {
    setIsDialogOpenNetAddress(true)
    setIsNetAddress(network_number)
    setIsIDSensor(sensor_id)
  }

  async function handleChangeIpAddress(ip_address, sensor_id) {
    setIsDialogOpen(true)
    setIsIPAddress(ip_address)
    setIsIDSensor(sensor_id)
  }

  async function onRegistrationSensorSuccess(sensorsData) {
    dispatch(updateSensors(sensorsData))
  }

  useEffect(() => {
    let selected: any = [];
    if (allSensors.length > 0) {
      allSensors.forEach(sensor => {
        // Проверка, существует ли уже organization_id в массиве selected
        if (!selected.includes(sensor.object.id)) {
          // Если нет, добавляем его в массив selected
          selected.push(sensor.object.id);
          setIsSelectedSensors(selected);
        }
      });
      console.log('allSensors изменилось:', allSensors);
      setSensors(allSensors)
    }
  }, [allSensors]);

  async function restoreAllSensors(sensorsData) {
    setShowChoice(false)
    let selected: any = [];
    sensorsData.forEach(sensor => {
      if (!selected.includes(sensor.object.id)) {
        selected.push(sensor.object.id);
        setIsSelectedSensors(selected);
      }
    });
  }

  function selectObject(selected) {
    setShowChoice(true)
    if (selected.length > 0) {
      setPage(0)
      setIsSelectedSensors(selected)
    }
  }

  function onSelectedRowsSensors(sensors, selected) {
    console.log('sensors --', sensors)
    // return sensors
    if (sensors.length > 0) {
      return sensors.filter(obj => selected.includes(obj.object.id));
    } else {
      return sensors;
    }
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Датчики</Typography>
      </div>
      {loading ? <SpinnerWithAlert isMessage={isMessage} alertColor={alertColor}/> :
        <Stack>
          <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
          <SensorsPaginationAndSelectTable
            rows={onSelectedRowsSensors(sensors, isSelectedSensors)}
            sendIDToStore={sendIDToStore}
            selectObject={selectObject}
            page={page}
            setPage={setPage}
            handleChangeIpAddress={handleChangeIpAddress}
            deleteOneSensor={deleteOneSensor}
            handleChangeStatus={handleChangeStatus}
            handleChangeNetAddress={handleChangeNetAddress}
            updateSensorDesignation={updateSensorDesignation}
          />
          <Box display="flex" justifyContent="space-around" sx={{marginTop: 3}}>
            {showChoice &&
              <Button variant="contained" onClick={() => restoreAllSensors(sensors)}>Сбросить выборку</Button>
            }
          </Box>
        </Stack>}
      <Box display="flex" justifyContent="center" sx={{marginTop: 2}}>
        <Button variant="contained" onClick={openModal}>Добавить датчик на объект</Button>
      </Box>

      <ModalNewSensor isOpen={isModalOpen} onClose={closeModal}
                      onRegistrationSensorSuccess={onRegistrationSensorSuccess} typesSensors={typesSensors}
                      objects={objects}/>
      <ModalImportSensor isOpen={isModalImportOpen} onClose={closeImportModal}
                         onRegistrationSensorSuccess={onRegistrationSensorSuccess} typesSensors={typesSensors}
                         objects={objects}/>
      <DialogInputIP isOpen={isDialogOpen}
                     handleClose={closeDialog}
                     isIPAddress={isIPAddress}
                     isIDSensor={isIDSensor}
                     setIsIPAddress={setIsIPAddress}
                     sendUpdatedSensor={sendUpdatedSensor}
      />
      <DialogChangeNetAddress isOpen={isDialogOpenNetAddress}
                              isIDSensor={isIDSensor}
                              handleClose={closeDialogNetAddress}
                              isNetAddress={isNetAddress}
                              setIsNetAddress={setIsNetAddress}
                              sendUpdatedSensor={sendUpdatedSensor}
      />
      {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
    </Stack>
  );
}



