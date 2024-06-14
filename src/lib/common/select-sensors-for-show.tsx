'use client';
import * as React from 'react';
import {forwardRef, useImperativeHandle, useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import ObjectsPaginationAndSelectTable from "@/components/tables/objectsPaginationAndSelectTable";
import AllSensorsPaginationAndSelectTable from "@/components/tables/allSensorsPaginationAndSelectTable";
import Button from "@mui/material/Button";
import SelectTimePeriod from "@/components/select/select-time-period";
import AlertDialogSlide from "@/components/dialog/alertDialogSlide";
import calcIdOfSensorsToApi from "@/lib/calculate/calc-id-sensors";
import {Alert, Grid} from "@mui/material";
import {sensorsDataClient} from "@/lib/sensors/data-sensor-client";
import sortedSensors from "@/lib/calculate/sorted-sensors";
import transformData from "@/lib/calculate/transform-data-for-chart";
import {sensorsClient} from "@/lib/sensors/sensors-client";
import ModalLoading from "@/components/modal/modal-loading";
import ModalInputNumber from "@/components/modal/modal-input-number";
import ModalInputString from "@/components/modal/modal-input-string";
import SelectTimeRequest from "@/components/select/select-time-request";
import {util} from "zod";
import find = util.find;
import {AppDispatch} from "@/store/store";
import {useDispatch} from "react-redux";
import {addSensors} from "@/store/sensorsReducer";
import {setZeroTrue} from "@/store/setZeroReducer";


interface Sensor {
  name: string;
  id: string;
  sensor_id: string;
  designation: string;
  network_number: number;
  model: string;
  data: string[];
}

interface SelectSensorsForShowProps {
  sendGroupedData: (data: any) => void;
  sendCategories: (categories: any) => void;
  setNamesChart: (names: any) => void;
  setBarChart: (barChart: any) => void;
}

const SelectSensorsForShow = forwardRef((props: SelectSensorsForShowProps, ref) => {
  const {sendGroupedData, sendCategories, setNamesChart, setBarChart} = props;
  const dispatch: AppDispatch = useDispatch();
  const allSensors = useSelector((state: RootState) => state.allSensors.value[0]);
  const allObjects = useSelector((state: RootState) => state.allObjects.value[0]);
  const setZero = useSelector((state: RootState) => state.setZero.value);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [isPeriod, setIsPeriod] = useState([]);
  const [defaultValueTimeRequest, setDefaultValueTimeRequest] = useState(10000);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogsMessage, setDialogsMessage] = useState('');
  const [isMessage, setIsMessage] = useState<string>('');
  const [alertColor, setAlertColor] = useState<string>('error');
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalNumber, setIsOpenModalNumber] = useState<boolean>(false);
  const [isInputValue, setIsInputValue] = useState<string>('');
  const [isOpenStringValue, setIsOpenStringValue] = useState<boolean>(false);
  const [isIdChangeSensor, setIdChangeSensor] = useState<string>('');
  const [flagValue, setFlagValue] = useState<string>('');


  const onClose = () => {
    setIsOpenModal(false)
  }
  const onCloseModalNumber = () => {
    setIsOpenModalNumber(false)
  }
  const onCloseStringValue = () => {
    setIsOpenStringValue(false)
  }

  async function onSelectedRowsChange(selected) {
    // console.log(selected)
    setShowButton(false)
    setSelectedSensors(selected)
    setFilteredSensors(allSensors.filter(sensor => selected.includes(sensor.object_id)))
    setDefaultValueTimeRequest(allSensors[0].requestSensorInfo[0].periodicity || 10000)
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
    console.log('SelectedRows - ', selected)
    setSelectedRows(selected);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const createDataForHistogram = (inputArray) => {
    console.log("createDataForHistogram ----", inputArray)
    const data = inputArray.map(item => item.histogramValue);
    const names = inputArray.map(item => item.name);

// Creating the series object
    const series = {
      name: "",
      data: data
    };
    console.log("names ----", names)
    console.log("series ----", [series])
    setNamesChart(names)
    const x = [{
      name: '',
      data: [230, 310]
    }]
    setBarChart([series])
  }


  const sendChangeTimeRequestToApi = async () => {
    try {
      setLoading(true);
      const sendData = {
        periodicity: defaultValueTimeRequest
      }
      const result: any = await sensorsClient.changeTimeRequest(sendData);
      console.log(result)
      switch (result?.data?.statusCode) {
        case 200:
          setAlertColor("success");
          setIsMessage(result?.data?.message);
          setLoading(false);
          setTimeout(() => {
            setIsMessage('');
          }, 2000);
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
      console.error('Ошибка при изменении данных:', error);
      setIsMessage('Ошибка при изменении данных:', error);
    }
  }
  const sendRequestToApi = async () => {
    if (selectedRows.length === 0) {
      setOpenDialog(true)
      setDialogsMessage('Для получения данных выберите хотя бы один датчик')
    } else {
      const sensorIds = calcIdOfSensorsToApi(selectedRows);
      if (isPeriod.length === 0) {
        setOpenDialog(true)
        setDialogsMessage('Для получения данных выберите хотя бы один период')
      } else {
        try {
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
              setTimeout(() => {
                setIsMessage('');
              }, 2000);
              const resultSortedIDSensors = (await sortedSensors(selectedRows)).fullData
              console.log('resultSortedIDSensors -- -', resultSortedIDSensors)
              const transformsData = await transformData(result?.data?.groupedData, resultSortedIDSensors)
              console.log('transformsData --', transformsData.series)
              sendGroupedData(transformsData.series)
              sendCategories(transformsData.categories)
              createDataForHistogram(transformsData.series)
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
          setIsMessage('Ошибка при загрузке данных', error);
        }
      }
    }
  }
  const changeOneSensorsData = (data) => {
    setFilteredSensors((filteredSensors) => {
      const newFilteredSensors = [...filteredSensors];
      const sensorIndex = newFilteredSensors.findIndex(s => s.id === data.id);
      if (sensorIndex !== -1) {
        newFilteredSensors[sensorIndex] = data;
      } else {
        console.log(`Sensor with id=${data.sensor_id} not found`);
      }
      console.log('newFilteredSensors', newFilteredSensors);
      return newFilteredSensors;
    });
  }

  useImperativeHandle(ref, (data) => ({
    customMethod: (data) => {
      console.log('Custom method called!', data);
      const newData = [data]
      setNewRequestData(newData)
    }
  }));
  const setNewRequestData = (data) => {
    console.log(`Sensor data ----`, data);
    setFilteredSensors((filteredSensors) => {
      const newFilteredSensors = [...filteredSensors];
      // Логируем все sensor_id в newFilteredSensors
      // newFilteredSensors.forEach((sensor, index) => {
      //   console.log(`Sensor ${index}: id=${sensor.id}, requestSensorInfo=${sensor.requestSensorInfo[0].warning}`);
      // });
      const sensorIndex = newFilteredSensors.findIndex(s => s.id === data[0].sensor_id);
      if (sensorIndex !== -1) {
        const updatedSensor = {...newFilteredSensors[sensorIndex]};
        if (updatedSensor.requestSensorInfo && updatedSensor.requestSensorInfo.length > 0) {
          updatedSensor.requestSensorInfo = data;
          newFilteredSensors[sensorIndex] = updatedSensor;
        }
      } else {
        console.log(`Sensor with id=${data.sensor_id} not found test`);
      }
      // console.log('newFilteredSensors', newFilteredSensors);
      return newFilteredSensors;
    });
  };
  const setNullOneSensor = async (sensor_id, zeroValue, lastValue) => {
    setIsOpenModal(true);
    let flagZero;
    if (zeroValue !== 0) {
      flagZero = 'unset'
    } else {
      flagZero = 'set'
    }
    try {
      const result = await sensorsClient.setNullForOneSensor(sensor_id, flagZero);
      handleApiResponse(result, (result) => {
        setNewRequestData([result?.data?.oneSensor]);
      });
    } catch (error) {
      handleApiError(error);
    }
  }
  const setSensorValue = async (sensor_id, value, flag) => {
    setIdChangeSensor(sensor_id);
    setIsInputValue(value);
    setFlagValue(flag);
    setIsOpenModalNumber(true);
  }
  const setMinOneSensor = async (sensor_id, value) => {
    await setSensorValue(sensor_id, value, 'min');
  }

  const setMaxOneSensor = async (sensor_id, value) => {
    await setSensorValue(sensor_id, value, 'max');
  }

  const handleApiResponse = (result, successCallback) => {
    switch (result?.data?.statusCode) {
      case 200:
        setAlertColor("success");
        setIsMessage(result?.data?.message);
        successCallback(result);
        setIsOpenModal(false);
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
  };

  const handleApiError = (error) => {
    console.error('Ошибка при загрузке данных:', error);
    setIsMessage('Ошибка при загрузке данных:', error);
    setIsOpenModal(false);
  };

  const changeFromChartsRunSensor = async (sensor_id) => {
    setIsOpenModal(true);
    try {
      const result = await sensorsClient.changeStatusOneSensorFromApi(sensor_id);
      handleApiResponse(result, (result) => {
        changeOneSensorsData(result?.data?.oneSensor);
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const changeFromChartsDesignationSensor = async (sensor_id, value) => {
    setIdChangeSensor(sensor_id);
    setIsInputValue(value);
    setIsOpenStringValue(true);
    setFlagValue('designation');
  };

  const sendStringValueToParent = async (stringValue) => {
    setIsOpenModal(true);
    try {
      const result = await sensorsClient.changeDesignationOneSensorFromApi(isIdChangeSensor, stringValue);
      handleApiResponse(result, (result) => {
        changeOneSensorsData(result?.data?.oneSensor);
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  const sendValueToParent = async (convertValue) => {
    setIsOpenModal(true);
    try {
      // const convertValue = await convertStringToNumber(stringValue);
      const result = await sensorsClient.changeValuesDataSensor(convertValue, flagValue, isIdChangeSensor);
      handleApiResponse(result, (result) => {
        setNewRequestData(result?.data?.oneSensor?.requestSensorInfo);
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsOpenModal(false);
    }
  };

  const changeFromChartsWarningSensor = async (sensor_id) => {
    setIsOpenModal(true);
    try {
      const result = await sensorsClient.changeWarningSensor(sensor_id);
      handleApiResponse(result, (result) => {
        setNewRequestData(result?.data?.oneSensor?.requestSensorInfo);
      });
    } catch (error) {
      handleApiError(error);
    }
  };
  const setNullForAllCharts = async () => {

    try {
      const result = await sensorsClient.changeNullForAllCharts(setZero);

      handleApiResponse(result, (result) => {
        console.log('result -----', result.data)
        dispatch(addSensors(result.data.allSensors));
        if(setZero){
          dispatch(setZeroTrue(false));
        } else {
          dispatch(setZeroTrue(true));
        }
      });
    } catch (error) {
      handleApiError(error);
    }
  }
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6">Выберите объект{setZero ? <span>1</span> : <span>2</span>}</Typography>
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
                                              onSelectionChange={handleSelectionChange}
                                              changeFromChartsWarningSensor={changeFromChartsWarningSensor}
                                              changeFromChartsRunSensor={changeFromChartsRunSensor}
                                              setNullOneSensor={setNullOneSensor}
                                              setMinOneSensor={setMinOneSensor}
                                              setMaxOneSensor={setMaxOneSensor}
                                              changeFromChartsDesignationSensor={changeFromChartsDesignationSensor}
          />
          <Grid container spacing={2} sx={{marginTop: 2}}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" sx={{my: 2}}>Выбрать период</Typography>
                <SelectTimePeriod setPeriodToParent={setIsPeriod} sx={{my: 2}}/>
                <Button variant="contained" onClick={sendRequestToApi} sx={{width: 220}}>Загрузить</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" sx={{my: 2}}>Изменить периодичность опроса дачиков</Typography>
                <SelectTimeRequest setNumberToParent={setDefaultValueTimeRequest}
                                   defaultValueTimeRequest={defaultValueTimeRequest} sx={{my: 2}}/>
                <Button variant="contained" onClick={sendChangeTimeRequestToApi} sx={{width: 220}}>Изменить</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="contained" sx={{width: 220, marginY: 2}} onClick={() => setNullForAllCharts()}>{setZero ?
                <span>Сбросить ноль</span> :
                <span>Выставить  ноль</span>}</Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="contained" sx={{width: 220, marginY: 2}} onClick={() => setNullForAllCharts()}>Управление
                опросом</Button>
            </Grid>
          </Grid>
        </Box>
      }
      <AlertDialogSlide open={openDialog} handleClose={handleCloseDialog} dialogsMessage={dialogsMessage}/>
      {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
      <ModalLoading isOpen={isOpenModal} onClose={onClose}/>
      <ModalInputNumber isOpen={isOpenModalNumber} onClose={onCloseModalNumber} filteredSensors={filteredSensors}
                        isIdChangeSensor={isIdChangeSensor}
                        isNumberValue={isInputValue} flagValue={flagValue} sendValueToParent={sendValueToParent}/>
      <ModalInputString isOpen={isOpenStringValue} onClose={onCloseStringValue} isStringValue={isInputValue}
                        flagValue={flagValue} sendValueToParent={sendStringValueToParent}/>
    </Stack>
  )
});
export default SelectSensorsForShow
