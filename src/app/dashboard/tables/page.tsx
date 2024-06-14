'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import ObjectsPaginationAndSelectTable from "@/components/tables/objectsPaginationAndSelectTable";
import {useEffect, useState} from "react";
import AllSensorsPaginationAndSelectTable from "@/components/tables/allSensorsPaginationAndSelectTable";
import Button from "@mui/material/Button";
import SelectTimePeriod from "@/components/select/select-time-period";
import AlertDialogSlide from "@/components/dialog/alertDialogSlide";
import calcIdOfSensorsToApi from "@/lib/calculate/calc-id-sensors";
import {Alert} from "@mui/material";
import {sensorsDataClient} from "@/lib/sensors/data-sensor-client";
import {SvgSpinnersBarsRotateFade} from "@/lib/animated-icon/bar-rotate-fade";
import DataTables from "@/app/dashboard/tables/data-tables";
import RoundApexChart from "@/lib/apexcharts/scatter-plot";
import ScatterPlot from "@/lib/apexcharts/scatter-plot";
import parseSensorRf251 from "@/lib/parse-sensor/parse-sensor-rf251";

// Функция обработки данных углов
function processData(hexDataString: string) {
  const buffer = hexStringToBuffer(hexDataString);

  // Проверяем, что размер буфера соответствует ожидаемому размеру ответа
  if (buffer.length !== 12) {
    throw new Error('Invalid buffer size');
  }

  const actualChecksum = buffer[10];

  // Расчет контрольной суммы
  let calculatedChecksum = 0;
  for (let i = 1; i < 10; i++) {
    calculatedChecksum ^= buffer[i];
  }

  // Сравниваем контрольные суммы
  if (calculatedChecksum !== actualChecksum) {
    throw new Error('Checksum mismatch');
  }

  // Разбор буфера на составляющие поля данных
  // Извлекаем значения байтов из буфера
  const D0 = buffer[4];
  const D1 = buffer[5];
  const D2 = buffer[6];
  const D3 = buffer[7];
  const D4 = buffer[8];
  const D5 = buffer[9];
  // Преобразование шестнадцатеричных значений в числовые
  const angleYFractional = D0 / 256;
  const angleYInteger = ((D2 & 0x3F) << 8) + D1;
  const angleYSign = (D2 >> 7) & 0x01;
  const angleY = (angleYInteger + angleYFractional) * (angleYSign === 0 ? 1 : -1);

  const angleXFractional = D3 / 256;
  const angleXInteger = ((D5 & 0x3F) << 8) + D4;
  const angleXSign = (D5 >> 7) & 0x01;
  const angleX = (angleXInteger + angleXFractional) * (angleXSign === 0 ? 1 : -1);

  // Возвращение результатов обработки данных
  return {
    angleY,
    angleX
  };
}

// Пример функции hexStringToBuffer
function hexStringToBuffer(hexString) {
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const buffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    buffer[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return buffer;
}



export default function Page(): React.JSX.Element {
  const allSensors = useSelector((state: RootState) => state.allSensors.value[0]);
  const allObjects = useSelector((state: RootState) => state.allObjects.value[0]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [showButtonLoad, setShowButtonLoad] = useState<boolean>(false);
  const [showDataTables, setShowDataTables] = useState<boolean>(false);
  const [isPeriod, setIsPeriod] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogsMessage, setDialogsMessage] = useState('');
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('error');
  const [loading, setLoading] = useState<boolean>(false);
  const [groupedData, setGroupedData] = useState({});

  async function onSelectedRowsChange(selected) {
    console.log(selected)
    setShowButton(false)
    setSelectedSensors(selected)
    setFilteredSensors(allSensors.filter(sensor => selected.includes(sensor.object_id)))
  }

  const resetAllSelect = () => {
    setFilteredSensors(allSensors.filter(sensor => selectedSensors.includes(sensor.object_id)))
    setShowButton(false)
  };
  const handleFilterChange = (filteredData) => {
    setFilteredSensors(filteredData);
    setShowButton(true)
  };
  const handleSelectionChange = (selected) => {
    // console.log('SelectedRows - ', selected)
    setSelectedRows(selected);
  };
  const setPeriodToParent = (date) => {
    console.log(date)
    setIsPeriod(date)
    setShowButtonLoad(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const sendRequestToApi = async () => {
    console.log('isPeriod - ', isPeriod)
    if (selectedRows.length === 0) {
      setOpenDialog(true)
      setDialogsMessage('Для получения данных выберите хотя бы один датчик')
    } else {
      const sensorIds = calcIdOfSensorsToApi(selectedRows);
      console.log(sensorIds);

      try {
        setShowDataTables(true)
        setLoading(true);
        const sendData = {
          period: isPeriod,
          sensorIds: sensorIds
        }
        const result: any = await sensorsDataClient.getSensorsDataFromApi(sendData);
        switch (result?.data?.statusCode) {
          case 200:
            setAlertColor("success");
            setIsMessage(result?.data?.message);
            setLoading(false);
            setGroupedData(result?.data?.groupedData)
            console.log(result?.data?.groupedData)
            break;
          case 400:
          case 500:
            setAlertColor("error");
            setIsMessage(result?.data?.message || "Произошла ошибка");
            break;
          default:
            setAlertColor("error");
            setIsMessage(result?.error?.message || "Произошла ошибка");
            break;
        }
      } catch (error) {
        setAlertColor("error");
        console.error('Ошибка при загрузке данных:', error);
        setIsMessage('Ошибка при загрузке данных:', error);
      }
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Таблицы</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Выберите объект</Typography>
      </Box>
      <ObjectsPaginationAndSelectTable rows={allObjects} onSelectedRowsChange={onSelectedRowsChange}/>
      <Box display="flex" justifyContent="center">
        {showButton && <Button variant="contained" onClick={resetAllSelect} sx={{width: 220}}>Очистить выборку</Button>}
      </Box>
      {filteredSensors.length !== 0 &&
        <Box>
          <Box>
            <Typography variant="h6" sx={{mb: 2}}>Выберите датчик</Typography>
          </Box>
          <AllSensorsPaginationAndSelectTable rows={filteredSensors} onFilterChange={handleFilterChange}
                                              onSelectionChange={handleSelectionChange}/>
          <Box sx={{mb: 2}}>
            <Typography variant="h6" sx={{my: 2}}>Выберите период</Typography>
            <SelectTimePeriod setPeriodToParent={setPeriodToParent} sx={{my: 2}}/>
          </Box>
          <Box display="flex" justifyContent="center">
            {showButtonLoad &&
              <Button variant="contained" onClick={sendRequestToApi} sx={{width: 220}}>Загрузить данные</Button>}
          </Box>
          {showDataTables && <Box>
            {loading ? <SvgSpinnersBarsRotateFade/> : <DataTables groupedData={groupedData} selectedRows={selectedRows}/> }
          </Box>
          }
        </Box>
      }
      <AlertDialogSlide open={openDialog} handleClose={handleCloseDialog} dialogsMessage={dialogsMessage}/>
      {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
    </Stack>
  )
}
