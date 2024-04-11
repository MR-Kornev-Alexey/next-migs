'use client';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Download as DownloadIcon} from '@phosphor-icons/react/dist/ssr/Download';
import {Upload as UploadIcon} from '@phosphor-icons/react/dist/ssr/Upload';
import {CustomersFilters} from '@/components/dashboard/customer/customers-filters';
import type {Customer} from '@/components/dashboard/customer/customers-table';
import {CustomersTable} from '@/components/dashboard/customer/customers-table';
import {customersClient} from "@/lib/customers/customers-client";
import ModalNewCustomer from "@/components/modal/modal-new-customer";
import Pagination from "@mui/material/Pagination";
import CustomPaginationActionsTable from "@/components/tables/customPaginationActionsTable";
import ImportExportButtons from "@/lib/common/importExportButtons";

export default function Page(): React.JSX.Element {
  const [page, setPage] = React.useState(1);
  const [pageCounter, setPageCounter] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers().then((data) => {
      console.log(data)
      setCustomers(data?.allUsers);
      setLoading(false);
      setPageCounter(Math.ceil((data?.allUsers.length) / rowsPerPage));
    }).catch((error) => {
      console.error('Ошибка при загрузке данных:', error);
      setLoading(false);
    });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
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
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Пользователи</Typography>
      </div>
      <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
      <CustomersFilters/>
      <CustomPaginationActionsTable rows={customers}/>
      <ModalNewCustomer isOpen={isModalOpen} onClose={closeModal}/>
    </Stack>
  );
}

async function fetchCustomers(): Promise<Customer[]> {
  const result = await customersClient.getCustomers()
  return result?.data
}
