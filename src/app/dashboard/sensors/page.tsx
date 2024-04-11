'use client';
import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { Notifications } from '@/components/dashboard/settings/notifications';
import { UpdatePasswordForm } from '@/components/dashboard/settings/update-password-form';
import {OrganizationsTable} from "@/components/dashboard/organizations/organizations-table";
import {useEffect, useState} from "react";
import type {Customer} from "@/components/dashboard/customer/customers-table";
import {organizationClient} from "@/lib/organizations/organization-client";
import ModalNewOrganization from "@/components/modal/modal-new-organization";
import Pagination from "@mui/material/Pagination";
import ObjectsPaginationActionsTable from "@/components/tables/objectsPaginationActionsTable";
import OrganizationsPaginationActionsTable from "@/components/tables/organizationsPaginationActionsTable";
import ModalNewObject from "@/components/modal/modal-new-object";
import {objectClient} from "@/lib/objects/object-client";
import SensorsPaginationActionsTable from "@/components/tables/sensorsPaginationActionsTable";
import ObjectsPaginationAndSelectTable from "@/components/tables/objectsPaginationAndSelectTable";
import SensorsPaginationAndSelectTable from "@/components/tables/sensorsPaginationAndSelectTable";



export default function Page(): React.JSX.Element {
  const [organizations, setOrganizations] = useState<Customer[]>([]);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalObjectOpen, setIsModalObjectOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const openModalObject = () => {
    setIsModalObjectOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
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
    console.log(objectsData.data.allObjects)
    setObjects(objectsData?.data.allObjects);
  }


  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Датчики</Typography>
      </div>
      <div>
        <Typography variant="h5">Выберите объект до просмотра датчиков</Typography>
      </div>
      <ObjectsPaginationAndSelectTable rows={objects}/>
      <SensorsPaginationAndSelectTable rows={objects}/>
      <ModalNewObject isOpenObject={isModalObjectOpen} onCloseObject={closeObjectModal}
                      onRegistrationSuccess={onRegistrationSuccess} rowsOrganizations={organizations}/>
    </Stack>
  );
}



