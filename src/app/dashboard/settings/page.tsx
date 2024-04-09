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
import {customersClient} from "@/lib/customers/customers-client";
import {organizationClient} from "@/lib/organizations/organization-client";
import ModalNewOrganization from "@/components/modal/modal-new-organization";
import Pagination from "@mui/material/Pagination";



export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = React.useState(1);
  const [pageCounter, setPageCounter] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  function applyPagination(rows: any, page: number, rowsPerPage: number) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return rows.slice(startIndex, endIndex);
  }
  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  useEffect(() => {
    fetchAllOrganizations().then((data) => {
      setCustomers(data?.data);
      setPageCounter(Math.ceil((data?.data.length) / rowsPerPage));
      setLoading(false);
    }).catch((error) => {
      console.error('Ошибка при загрузке данных:', error);
      setLoading(false);
    });
  }, []);
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Настройки</Typography>
      </div>
      <Notifications/>
      <div>
        <Typography variant="h4">Организации</Typography>
      </div>
      <Stack spacing={2}>
        <Typography>Страница: {page}</Typography>
        <Pagination count={pageCounter} page={page} onChange={handleChange}/>
      </Stack>
      <OrganizationsTable
        rows={paginatedCustomers}
        openModal={openModal}
      />

      <div>
        <Typography variant="h4">Объекты</Typography>
      </div>
      <ModalNewOrganization isOpen={isModalOpen} onClose={closeModal}/>

    </Stack>
  );
}

async function fetchAllOrganizations(): Promise<Customer[]> {
  // Здесь должен быть ваш код для получения данных с сервера
  const responseAllOrganizations = await organizationClient.getAllOrganization();
  console.log('responseAllOrganizations - ', responseAllOrganizations)
  return responseAllOrganizations
}

