'use client';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {CustomersFilters} from '@/components/dashboard/customer/customers-filters';
import type {Customer} from '@/components/dashboard/customer/customers-table';
import {customersClient} from "@/lib/customers/customers-client";
import ModalNewCustomer from "@/components/modal/modal-new-customer";
import CustomPaginationActionsTable from "@/components/tables/customPaginationActionsTable";
import ImportExportButtons from "@/lib/common/importExportButtons";
import CustomTableWithoutSelect from "@/components/tables/customTableWithoutSelect";

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectedCustomers, setIsSelectedCustomers] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchCustomers().then((data) => {
      let selected = [];

      // Перебор каждого пользователя
      data?.allUsers.forEach(user => {
        // Проверка, существует ли уже organization_id в массиве selected
        if (!selected.includes(user.organization_id)) {
          // Если нет, добавляем его в массив selected
          selected.push(user.organization_id);
        }
      });

      // Установка массива selected в состояние isSelectedCustomers
      setIsSelectedCustomers(selected);

      // Установка данных о пользователях и завершение загрузки
      setCustomers(data?.allUsers);
      setLoading(false);
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
  async function onRegistrationSuccess(data) {
    setCustomers(data.allUsers)
  }
  function onSelectedRowsChange(selected) {
    console.log(selected)
    if(selected.length > 0) {
      setIsSelectedCustomers(selected)
    }
  }
  function onSelectedRowsCustomers(objects, selected) {
    return objects.filter(obj => selected.includes(obj.organization_id));
  }
  function restoreAllOrganization() {
    let selected = [];
    // Перебор каждого пользователя
    customers.forEach(user => {
      // Проверка, существует ли уже organization_id в массиве selected
      if (!selected.includes(user?.organization_id)) {
        // Если нет, добавляем его в массив selected
        selected.push(user?.organization_id);
      }
      setIsSelectedCustomers(selected)
    });
  }
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Пользователи</Typography>
      </div>
      <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
      <CustomersFilters/>
      {!loading && (
        <CustomTableWithoutSelect
          rows={onSelectedRowsCustomers(customers, isSelectedCustomers)}
          openModal={openModal}
          selectOrganization={onSelectedRowsChange}
          restoreAllOrganization={restoreAllOrganization}
        />
      )}
      <ModalNewCustomer isOpen={isModalOpen} onClose={closeModal} onRegistrationSuccess={onRegistrationSuccess}/>
    </Stack>
  );
}

async function fetchCustomers(): Promise<Customer[]> {
  const result = await customersClient.getCustomers()
  return result?.data
}
