'use client';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Notifications} from '@/components/dashboard/settings/notifications';
import type {Customer} from "@/components/dashboard/customer/customers-table";
import {organizationClient} from "@/lib/organizations/organization-client";
import ModalNewOrganization from "@/components/modal/modal-new-organization";
import ObjectsPaginationActionsTable from "@/components/tables/objectsPaginationActionsTable";
import OrganizationsPaginationActionsTable from "@/components/tables/organizationsPaginationActionsTable";
import ModalNewObject from "@/components/modal/modal-new-object";
import {objectClient} from "@/lib/objects/object-client";
import ImportExportButtons from "@/lib/common/importExportButtons";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {sensorsClient} from "@/lib/sensors/sensors-client";
import jsonData from "@/lib/json/sensors.json"
import TypeSensorsWithoutSelect from "@/components/tables/typeSensorsWithoutSelect";
import ModalNewModelSensor from "@/components/modal/modal-new-model-sensor";

export default function Page(): React.JSX.Element {
  const [organizations, setOrganizations] = useState([]);
  const [objects, setObjects] = useState([]);
  const [typesSensors, setTypesSensors] = useState([]);
  const [showInit, setShowInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSensorKey, setIsNewKey] = useState<string>('');
  const [isOpenNewTypeSensor, setIsOpenNewTypeSensor] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isModalObjectOpen, setIsModalObjectOpen] = useState<boolean>(false);
  const [isSelectedObjects, setIsSelectedObjects] = useState([]);

  const openModalNewModel = (sensorKey) => {
    setIsNewKey(sensorKey)
    setIsOpenNewTypeSensor(true);
    setIsDisabled(true)
  };
  const openModalNewType = () => {
    setIsNewKey("")
    setIsOpenNewTypeSensor(true);
    setIsDisabled(false)
  };
  const closeModalNewModel = () => {
    setIsOpenNewTypeSensor(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const openModalObject = () => {
    setIsModalObjectOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onExportClick = () => {
    // setIsModalObjectOpen(false);
  };

  const onImportClick = () => {
    // setIsModalObjectOpen(false);
  };
  const closeObjectModal = () => {
    setIsModalObjectOpen(false);
  };

  const initAllTypeSensors = async () => {

    const allSensors = await sensorsClient.initNewAllTypeOfSensors(jsonData);
    console.log(allSensors)
  };

  useEffect(() => {
    Promise.all([fetchAllOrganizations(), fetchAllObjects(), fetchAllTypeSensors()])
      .then(([organizationsData, objectsData, sensorsTypeData]) => {
        setOrganizations(organizationsData?.data?.allOrganizations);
        setObjects(objectsData?.data?.allObjects);
        if (sensorsTypeData?.data?.allSensors?.length > 0) {
          setTypesSensors(sensorsTypeData?.data?.allSensors)
          setShowInit(false)
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      });
  }, []);

  async function isResultSuccess(sensorsTypeData) {
    setTypesSensors(sensorsTypeData?.data?.allSensors)
  }

  async function fetchAllOrganizations(): Promise<Customer[]> {
    return await organizationClient.getAllOrganization();
  }

  async function fetchAllTypeSensors(): Promise<Customer[]> {
    return await sensorsClient.getAllTypeOfSensors();
  }

  async function fetchAllObjects(): Promise<Customer[]> {
    return await objectClient.getAllObjects();
  }

  async function onRegistrationSuccess(objectsData) {
    setObjects(objectsData?.data.allObjects);
  }
  async function onRegistrationOrganizationSuccess(organizationsData) {
    setOrganizations(organizationsData?.data?.allOrganizations);
  }
  async function onSelectedRowsChange(selected) {
    console.log(selected)
    setIsSelectedObjects(selected)
  }

  function onSelectedRowsObjects(objects, selected) {
    return objects.filter(obj => selected.includes(obj.organization_id));
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Настройки</Typography>
      </Box>
      <Notifications/>
      <Box>
        <Typography variant="h4">Организации</Typography>
      </Box>
      <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
      <OrganizationsPaginationActionsTable rows={organizations}
                                           onSelectedRowsChange={onSelectedRowsChange}/>
      <Box display="flex" justifyContent="space-around">
        <Button variant="contained" onClick={openModal}>Добавить организацию</Button>
      </Box>
      <Box>
        <Typography variant="h4">Объекты</Typography>
      </Box>
      {(isSelectedObjects.length > 0 )? <Stack spacing={2}>
        <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
        <ObjectsPaginationActionsTable rows={onSelectedRowsObjects(objects, isSelectedObjects)}/>
        <Box display="flex" justifyContent="space-around">
          <Button variant="contained" onClick={openModalObject}>Добавить новый объект</Button>
        </Box></Stack>:<Stack><Typography variant="body1">Выберите организацию для отображения объектов</Typography></Stack>}
      <Box>
        <Typography variant="h4">Датчики по типам</Typography>
      </Box>
      <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
      <TypeSensorsWithoutSelect rows={typesSensors} openModalNewModel={openModalNewModel}/>
      <Box display="flex" justifyContent="space-around">
        <Button variant="contained" onClick={openModalNewType}>Добавить новый тип датчика</Button>
        {showInit && <Button variant="contained" onClick={initAllTypeSensors}>Первичная инсталляция</Button>
        }
      </Box>
      <ModalNewModelSensor isOpen={isOpenNewTypeSensor} onClose={closeModalNewModel} isSensorKey={isSensorKey}
                           isResultSuccess={isResultSuccess} isDisabled={isDisabled}/>
      <ModalNewOrganization isOpen={isModalOpen} onClose={closeModal} onRegistrationSuccess={onRegistrationOrganizationSuccess}/>
      <ModalNewObject isOpenObject={isModalObjectOpen} onCloseObject={closeObjectModal}
                      onRegistrationSuccess={onRegistrationSuccess} rowsOrganizations={organizations}/>
    </Stack>
  );
}



