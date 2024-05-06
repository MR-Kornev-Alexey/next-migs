"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ModalNewAdditionalDataSensor from "@/components/modal/modal-new-additional-data-sensor";
import ModalNewOperationLogSensor from "@/components/modal/modal-new-operation-log-sensor";
import {sensorsClient} from "@/lib/sensors/sensors-client";
import Alert from "@mui/material/Alert";
import convertUnits from "@/lib/common/convertUnits";
import {useForm} from "react-hook-form";
import axios from "axios";
import {FilePdf} from "@phosphor-icons/react";
import Link from "@mui/material/Link";
import SpinnerWithAlert from "@/lib/common/SpinnerWithAlert";


export default function Page(): React.JSX.Element {
  const dataOfSensor = JSON.parse(localStorage.getItem("sensorData"))
  const [isAdditionalDataOfSensor, setIsAdditionalDataOfSensor] = useState<any>([]);
  const [isLogDataOfSensor, setIsLogDataOfSensor] = useState<any>([]);
  const [isFileData, setIsFileData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('error');
  const [file, setFile] = React.useState(null)
  const [reloadFlag, setReloadFlag] = useState(false);

  const {control, handleSubmit} = useForm({
    defaultValues: {
      file: undefined
    }
  });


  useEffect(() => {

    setLoading(true);
    setIsMessage("");

    const fetchData = async () => {
      try {
        const result: any = await sensorsClient.getAllDataAboutOneSensor(dataOfSensor.id);
        // Проверяем, смонтирован ли компонент
        switch (result?.data?.statusCode) {
          case 200:
            setAlertColor("success");
            setIsMessage(result?.data?.message);
            setIsAdditionalDataOfSensor(result?.data?.oneSensor?.additional_sensor_info);
            setIsLogDataOfSensor(result?.data?.oneSensor?.sensor_operation_log);
            setIsFileData((result?.data?.oneSensor?.files));
            setLoading(false);
            break;
          case 400:
          case 500:
            setAlertColor("error");
            setIsMessage(result?.data?.message);
            break;
          default:
            setAlertColor("error");
            setIsMessage(result?.error?.message || "Произошла ошибка");
            break;
        }
        // setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setIsMessage('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadFlag]);

  const openModalNewAdditionalDataSensor = () => {
    setIsOpen(true);
  };
  const openModalNewOperationLogSensor = () => {
    setIsModalOpen(true);
  };
  const closeModalNewAdditionalDataSensor = () => {
    setIsOpen(false);
  };
  const closeModalNewOperationLogSensor = () => {
    setIsModalOpen(false);
  };

  const successOfDownloadLogData = (data) => {
    console.log("successOfDownloadLogData ---- ", data)
    setIsLogDataOfSensor(data)
    setReloadFlag(prev => !prev);
  };

  const successOfDownloadAddData = (data) => {
    console.log("successOfDownloadAddData ---", data)
    setIsAdditionalDataOfSensor(data);
    setReloadFlag(prev => !prev);
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitNEW = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append("id", dataOfSensor.id);

    try {
      const response: any = await sensorsClient.saveFileAboutSensor(formData)
      setReloadFlag(prev => !prev);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Дополнительные данные для
          датчика: {dataOfSensor.sensor_type} | {dataOfSensor.designation}</Typography>
      </div>
      {loading ? <SpinnerWithAlert isMessage={isMessage} alertColor={alertColor}/> : <Box>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 400}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Адрес установки</TableCell>
                <TableCell>Тип датчика</TableCell>
                <TableCell>Модель</TableCell>
                <TableCell>Сетевой номер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body1">{dataOfSensor.object.address} | {dataOfSensor.object.name}</Typography></TableCell>
                <TableCell> {dataOfSensor.sensor_type}</TableCell>
                <TableCell>{dataOfSensor.model}</TableCell>
                <TableCell> {dataOfSensor.network_number}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {isAdditionalDataOfSensor.length === 0 ? <Box>
          <Typography variant="h5">Для данного датчика не введены дополнительные данные</Typography>
          <Box display="flex" justifyContent="space-around" sx={{marginTop: 3}}>
            <Button variant="contained" onClick={openModalNewAdditionalDataSensor}>Добавить данные</Button>
          </Box>
        </Box> : <Box>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 400}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Заводской номер</TableCell>
                  <TableCell>Единица измерения</TableCell>
                  <TableCell>Место установки</TableCell>
                  <TableCell>Коэффициент</TableCell>
                  <TableCell>Базовое значение( ноль )</TableCell>
                  <TableCell>Последнее значение( ноль )</TableCell>
                  <TableCell>Ошибки</TableCell>
                  <TableCell>Примечание</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{isAdditionalDataOfSensor[0]?.factory_number}</TableCell>
                  <TableCell>{convertUnits(isAdditionalDataOfSensor[0]?.unit_of_measurement)}</TableCell>
                  <TableCell>{isAdditionalDataOfSensor[0]?.installation_location}</TableCell>
                  <TableCell>{isAdditionalDataOfSensor[0]?.coefficient}</TableCell>
                  <TableCell>{isAdditionalDataOfSensor[0]?.base_value}</TableCell>
                  <TableCell>{isAdditionalDataOfSensor[0]?.last_value}</TableCell>
                  <TableCell>{isAdditionalDataOfSensor[0]?.error_information}</TableCell>
                  <TableCell>{isAdditionalDataOfSensor[0]?.additionalSensorInfoNotation}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>}
        {isLogDataOfSensor.length === 0 ? <Box sx={{marginTop: 2}}>
          <Typography variant="h5">Для данного датчика не введены данные по журналам</Typography>
          <Box display="flex" justifyContent="space-around" sx={{marginTop: 3}}>
            <Button variant="contained" onClick={openModalNewOperationLogSensor}>Добавить данные</Button>
          </Box></Box> : <Box>
          <Typography variant="h5">Журналы</Typography>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 400}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Информация о паспорте</TableCell>
                  <TableCell>Информация о поверке</TableCell>
                  <TableCell>Информация о гарантии</TableCell>
                  <TableCell>Примечание</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{isLogDataOfSensor[0]?.passport_information}</TableCell>
                  <TableCell>{isLogDataOfSensor[0]?.verification_information}</TableCell>
                  <TableCell>{isLogDataOfSensor[0]?.warranty_Information}</TableCell>
                  <TableCell>{isLogDataOfSensor[0]?.sensorOperationLogNotation}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        }
        <Typography variant="h5" sx={{marginTop: 2}}>Копии</Typography>
        <Box display="flex" justifyContent="space-around">
          {isFileData.map((item, index) =>
            <Box key={index} sx={{cursor: "pointer"}}>
              <Link href={item.url} target="_blank">
                <FilePdf size={56}/>
              </Link>
            </Box>
          )
          }
        </Box>

        <Box>
          <form onSubmit={handleSubmitNEW}>
            <input type="file" onChange={handleFileChange}/>
            <Button type="submit" variant="contained" sx={{mt: 2}}>Загрузить копию</Button>
          </form>
        </Box>
      </Box>
      }
      {/*{isMessage && <Alert color={alertColor}>{isMessage}</Alert>}*/}
      <ModalNewAdditionalDataSensor isOpen={isOpen} onClose={closeModalNewAdditionalDataSensor}
                                    dataOfSensor={dataOfSensor} successOfDownloadAddData={successOfDownloadAddData}/>
      <ModalNewOperationLogSensor isOpen={isModalOpen} onClose={closeModalNewOperationLogSensor}
                                  dataOfSensor={dataOfSensor} successOfDownloadLogData={successOfDownloadLogData}/>
    </Stack>
  );
}
