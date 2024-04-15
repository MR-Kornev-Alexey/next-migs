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
import Alert from "@mui/material/Alert";

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectedCustomers, setIsSelectedCustomers] = useState([]);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('error');
  const [page, setPage] = React.useState(0);


  useEffect(() => {
    fetchCustomers().then((data) => {
      let selected = [];
      if(data?.allUsers.length > 0) {
        setLoading(true);
        // Перебор каждого пользователя
        data?.allUsers.forEach(user => {
          // Проверка, существует ли уже organization_id в массиве selected
          if (!selected.includes(user.organization_id)) {
            // Если нет, добавляем его в массив selected
            selected.push(user.organization_id);
          }
        });
        setIsSelectedCustomers(selected);
        setCustomers(data?.allUsers);
      } else {
        setIsMessage('Ошибка при загрузке данных о пользователях')
      }
    }).catch((error) => {
      console.error('Ошибка при загрузке данных:', error);
      setIsMessage('Ошибка при загрузке данных:', error)
      setLoading(false); // Установка loading в false в случае ошибки
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
    if(selected.length > 0) {
      setPage(0)
      setIsSelectedCustomers(selected)
    }
  }
  function onSelectedRowsCustomers(objects, selected) {
    if (objects?.length > 0) {
      // setPage(0) // Передача функции setPage в дочерний компонент // Переместите эту строку перед return
      return objects.filter(obj => selected.includes(obj.organization_id));
    } else {
      return [];
    }
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

      {!loading?<Stack>
        <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24">
          <rect width={7.33} height={7.33} x={1} y={1} fill="currentColor">
            <animate id="svgSpinnersBlocksWave0" attributeName="x" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s"
                     values="1;4;1"></animate>
            <animate attributeName="y" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s" values="1;4;1"></animate>
            <animate attributeName="width" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
          <rect width={7.33} height={7.33} x={8.33} y={1} fill="currentColor">
            <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                     values="8.33;11.33;8.33"></animate>
            <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s" values="1;4;1"></animate>
            <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
          <rect width={7.33} height={7.33} x={1} y={8.33} fill="currentColor">
            <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s" values="1;4;1"></animate>
            <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                     values="8.33;11.33;8.33"></animate>
            <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
          <rect width={7.33} height={7.33} x={15.66} y={1} fill="currentColor">
            <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="15.66;18.66;15.66"></animate>
            <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s" values="1;4;1"></animate>
            <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
          <rect width={7.33} height={7.33} x={8.33} y={8.33} fill="currentColor">
            <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="8.33;11.33;8.33"></animate>
            <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="8.33;11.33;8.33"></animate>
            <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
          <rect width={7.33} height={7.33} x={1} y={15.66} fill="currentColor">
            <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s" values="1;4;1"></animate>
            <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="15.66;18.66;15.66"></animate>
            <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
          <rect width={7.33} height={7.33} x={15.66} y={8.33} fill="currentColor">
            <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                     values="15.66;18.66;15.66"></animate>
            <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                     values="8.33;11.33;8.33"></animate>
            <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
          <rect width={7.33} height={7.33} x={8.33} y={15.66} fill="currentColor">
            <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                     values="8.33;11.33;8.33"></animate>
            <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                     values="15.66;18.66;15.66"></animate>
            <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
          <rect width={7.33} height={7.33} x={15.66} y={15.66} fill="currentColor">
            <animate id="svgSpinnersBlocksWave1" attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.4s" dur="0.6s"
                     values="15.66;18.66;15.66"></animate>
            <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.4s" dur="0.6s"
                     values="15.66;18.66;15.66"></animate>
            <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.4s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
            <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.4s" dur="0.6s"
                     values="7.33;1.33;7.33"></animate>
          </rect>
        </svg>       {isMessage&&<Alert color={alertColor}>{isMessage}</Alert>}
      </Stack>:
        <CustomTableWithoutSelect
          rows={onSelectedRowsCustomers(customers, isSelectedCustomers)}
          openModal={openModal}
          selectOrganization={onSelectedRowsChange}
          restoreAllOrganization={restoreAllOrganization}
          page={page} // Передача функции setPage в дочерний компонент
          setPage={setPage}
        />}
      <ModalNewCustomer isOpen={isModalOpen} onClose={closeModal} onRegistrationSuccess={onRegistrationSuccess}/>
    </Stack>
  );
}

async function fetchCustomers(){
  const result = await customersClient.getCustomers()
    return result?.data
}
