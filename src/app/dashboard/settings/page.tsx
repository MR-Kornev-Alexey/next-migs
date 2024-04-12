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


export default function Page(): React.JSX.Element {
  const [organizations, setOrganizations] = useState([]);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalObjectOpen, setIsModalObjectOpen] = useState<boolean>(false);
  const [isSelectedObjects, setIsSelectedObjects] = useState([]);


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

  useEffect(() => {
    Promise.all([fetchAllOrganizations(), fetchAllObjects()])
      .then(([organizationsData, objectsData]) => {
        setOrganizations(organizationsData?.data);
        setObjects(objectsData?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      });
  }, []);

  async function fetchAllOrganizations(): Promise<Customer[]> {
    return await organizationClient.getAllOrganization();
  }

  async function fetchAllObjects(): Promise<Customer[]> {
    return await objectClient.getAllObjects();
  }
  async function onRegistrationSuccess(objectsData) {
    setObjects(objectsData?.data.allObjects);
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
      <div>
        <Typography variant="h4">Настройки</Typography>
      </div>
      <Notifications/>
      <div>
        <Typography variant="h4">Организации</Typography>
      </div>
      <ImportExportButtons  onExportClick={onExportClick} onImportClick={onImportClick}/>
      <OrganizationsPaginationActionsTable rows={organizations}   openModal={openModal} onSelectedRowsChange={onSelectedRowsChange}/>
      <div>
        <Typography variant="h4">Объекты</Typography>
      </div>
      <ImportExportButtons  onExportClick={onExportClick} onImportClick={onImportClick}/>
      <ObjectsPaginationActionsTable rows={onSelectedRowsObjects(objects, isSelectedObjects)}   openModal={openModalObject} />
      <ModalNewOrganization isOpen={isModalOpen} onClose={closeModal}/>
      <ModalNewObject isOpenObject={isModalObjectOpen} onCloseObject={closeObjectModal} onRegistrationSuccess={onRegistrationSuccess} rowsOrganizations={organizations}  />
    </Stack>
  );
}



