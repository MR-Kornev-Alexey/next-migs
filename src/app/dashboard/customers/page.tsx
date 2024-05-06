'use client';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {CustomersFilters} from '@/components/dashboard/customer/customers-filters';
import type {Customer} from '@/components/dashboard/customer/customers-table';
import {customersClient} from "@/lib/customers/customers-client";
import ModalNewCustomer from "@/components/modal/modal-new-customer";
import ImportExportButtons from "@/lib/common/importExportButtons";
import CustomTableWithoutSelect from "@/components/tables/customTableWithoutSelect";
import Box from "@mui/material/Box";
import SpinnerWithAlert from "@/lib/common/SpinnerWithAlert";
import ModalDialog from "@/components/modal/modal-info-about-customer";
import Button from '@mui/material/Button';
import ModalAboutOneCustomer from "@/components/modal/modal-about-one-customer";

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState<boolean>(false);
  const [isSelectedCustomers, setIsSelectedCustomers] = useState([]);
  const [oneCustomer, setOneCustomer] = useState('');
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('error');
  const [page, setPage] = React.useState(0);
  const [showChoice, setShowChoice] = useState<boolean>(false)



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
      setAlertColor("error")
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
  const closeInfoModal = () => {
    setIsModalInfoOpen(false);
  };
  const onExportClick = () => {
    // setIsModalObjectOpen(false);
  };
  const onImportClick = () => {
    // setIsModalObjectOpen(false);
  };

  const deleteCustomer = (id) => {
    alert(id)
  };
 async function infoAboutCustomer (row) {
      await setOneCustomer(row)
      await setIsModalInfoOpen(true);
      console.log(row)
  };
  async function onRegistrationCustomerSuccess(allUsers) {
    setCustomers(allUsers)
  }
  function onSelectedRowsChange(selected) {
    setShowChoice(true)
    if(selected.length > 0) {
      setPage(0)
      setIsSelectedCustomers(selected)
    }
  }
  function onSelectedRowsCustomers(objects, selected) {
    if (objects?.length > 0) {
      return objects.filter(obj => selected.includes(obj.organization_id));
    } else {
      return [];
    }
  }

  function restoreAllOrganization() {
    setShowChoice(false)
    let selected: any = [];
    // Перебор каждого пользователя
    customers.forEach((user: any)  => {
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
      {!loading?<SpinnerWithAlert isMessage={isMessage} alertColor={alertColor} />:
        (<Box>
          <CustomTableWithoutSelect
            rows={onSelectedRowsCustomers(customers, isSelectedCustomers)}
            openModal={openModal}
            selectOrganization={onSelectedRowsChange}
            restoreAllOrganization={restoreAllOrganization}
            page={page}
            setPage={setPage}
            deleteCustomer={deleteCustomer}
            infoAboutCustomer={infoAboutCustomer}
          />      <Box display="flex" justifyContent="space-around" sx={{marginTop: 3}}>
          <Button variant="contained" onClick={openModal}>Добавить пользователя</Button>
          {showChoice&&<Button variant="contained" onClick={restoreAllOrganization}>Сбросить выборку </Button>
          }
        </Box>
          <ModalNewCustomer isOpen={isModalOpen} onClose={closeModal} onRegistrationCustomerSuccess={onRegistrationCustomerSuccess}/>
          <ModalAboutOneCustomer isModalInfoOpen={isModalInfoOpen} onClose={closeInfoModal} oneCustomer={oneCustomer}/>
        </Box>
       )}
    </Stack>
  );
}

async function fetchCustomers(){
  const result:any = await customersClient.getCustomers()
    return result?.data
}
