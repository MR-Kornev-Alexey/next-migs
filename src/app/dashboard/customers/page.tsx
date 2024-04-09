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

  function applyPagination(rows: any, page: number, rowsPerPage: number) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return rows.slice(startIndex, endIndex);
  }
  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Пользователи</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Импорт
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Экспорт
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <CustomersFilters />
      <Stack spacing={2}>
        <Typography>Страница: {page}</Typography>
        <Pagination count={pageCounter} page={page} onChange={handleChange} />
      </Stack>
      <CustomersTable
        rows={paginatedCustomers}
        openModal = {openModal}
      />
      <ModalNewCustomer isOpen={isModalOpen} onClose={closeModal}/>
    </Stack>
  );
}

async function fetchCustomers(): Promise<Customer[]> {
 const result = await customersClient.getCustomers()
 return result?.data
}
