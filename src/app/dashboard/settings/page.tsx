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
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import {addObjects} from "@/store/objectReducer";
import {addSensors} from "@/store/sensorsReducer";
import modalDataOrganisation from "@/components/modal/modal-data-organisation";
import ModalDataOrganisation from "@/components/modal/modal-data-organisation";
import ModalDataObject from "@/components/modal/modal-data-object";
async function fetchAllOrganizations(): Promise<Customer[]> {
  return await organizationClient.getAllOrganization();
}

export default function Page(): React.JSX.Element {
  const [organizations, setOrganizations] = useState([]);
  const objects = useSelector((state: RootState) => state.allObjects.value);
  const typesSensors = useSelector((state: RootState) => state.allTypesOfSensors.value);
  const [showInit, setShowInit] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSensorKey, setIsNewKey] = useState<string>('');
  const [isOpenNewTypeSensor, setIsOpenNewTypeSensor] = useState<boolean>(false);
  const [isOpenDataOrganisation, setIsOpenDataOrganisation] = useState<boolean>(false);
  const [isOpenDataObject, setIsOpenDataObject] = useState<boolean>(false);
  const [isSelectOrganisation, setIsSelectOrganisation] = useState<string>([]);
  const [isSelectObject, setIsSelectObject] = useState<string>([]);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isModalObjectOpen, setIsModalObjectOpen] = useState<boolean>(false);
  const [isSelectedObjects, setIsSelectedObjects] = useState([]);
  const dispatch: AppDispatch = useDispatch();

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
  const closeDataOrganisation = () => {
    setIsOpenDataOrganisation(false);
  };

  const closeDataObject = () => {
    setIsOpenDataObject(false);
  };

  const openDataSelectObject= (iDObject) => {
    setIsOpenDataObject(true);
    const selectedObject = objects.find(obj => obj.id === iDObject)
    setIsSelectObject(selectedObject)
  };
  const openDataOrganisation = (iDOrganisation) => {
    setIsOpenDataOrganisation(true);
    const selectedOrganisation = organizations.find(org => org.id === iDOrganisation)
    setIsSelectOrganisation(selectedOrganisation)
  };
  const isResultSuccess = async () => {
    // const allSensors = await sensorsClient.initNewAllTypeOfSensors(jsonData);
    console.log('allSensors')
  };

  const onRegistrationObjectSuccess = async (data) => {
    dispatch(addObjects(data));
  };


  const initAllTypeSensors = async () => {
    const allSensors = await sensorsClient.initNewAllTypeOfSensors(jsonData);
    console.log(allSensors)
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsData:any = await fetchAllOrganizations();
        setOrganizations(organizationsData?.data?.allOrganizations);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
    if(typesSensors.length > 0 ) {
      setShowInit(false)
    }
  }, [typesSensors]);

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
                                           onSelectedRowsChange={onSelectedRowsChange} openDataOrganisation={openDataOrganisation}/>
      <Box display="flex" justifyContent="space-around">
        <Button variant="contained" onClick={openModal}>Добавить организацию</Button>
      </Box>
      <Box>
        <Typography variant="h4">Объекты</Typography>
      </Box>
      {(isSelectedObjects.length > 0 )? <Stack spacing={2}>
        <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
        <ObjectsPaginationActionsTable rows={onSelectedRowsObjects(objects, isSelectedObjects)} selectObject={openDataSelectObject}/>
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

      <ModalDataOrganisation isOpen={isOpenDataOrganisation} onClose={closeDataOrganisation} dataOrganisation={isSelectOrganisation} />

      <ModalDataObject isOpen={isOpenDataObject} onClose={closeDataObject} dataObject={isSelectObject} />

      <ModalNewOrganization isOpen={isModalOpen} onClose={closeModal} onRegistrationSuccess={onRegistrationOrganizationSuccess}/>

      <ModalNewObject isOpenObject={isModalObjectOpen} onCloseObject={closeObjectModal}
                      onRegistrationObjectSuccess={onRegistrationObjectSuccess} rowsOrganizations={organizations}/>
    </Stack>
  );
}



