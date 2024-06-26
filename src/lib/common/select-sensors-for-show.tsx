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
import {AppDispatch} from "@/store/store";
import {useDispatch} from "react-redux";
import {addSensors} from "@/store/sensorsReducer";
import SelectObjectModal from "@/components/modal/select-object-modal";
import SelectObjectAndTypeOfSensorsModal from "@/components/modal/select-object-and-sensors-modal";
import EmissionResultModal from "@/components/modal/emission-result-modal";


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
  const {sendGroupedData, sendCategories, setNamesChart, setBarChart, setGroupedData} = props;
  const dispatch: AppDispatch = useDispatch();
  const allSensors = useSelector((state: RootState) => state.allSensors.value);
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
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
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalNumber, setIsOpenModalNumber] = useState<boolean>(false);
  const [isOpenModalSelectObject, setIsOpenModalSelectObject] = useState<boolean>(false);
  const [isOpenModalSelectObjectAndTypes, setIsOpenModalSelectObjectAndTypes] = useState<boolean>(false);
  const [isOpenEmissionResult, setIsOpenEmissionResult] = useState<boolean>(false);
  const [isFlagForOneObject, setIsFlagForOneObject] = useState<string>('');
  const [isTitleModalSelectObject, setTitleModalSelectObject] = useState<string>('');
  const [isInputValue, setIsInputValue] = useState<string>('');
  const [isIdChangeSensor, setIdChangeSensor] = useState<string>('');
  const [flagValue, setFlagValue] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');


  const onClose = () => {
    setIsOpenModal(false)
  }
  const onCloseModalNumber = () => {
    setIsOpenModalNumber(false)
  }

  const onCloseSelectObject = () => {
    setIsOpenModalSelectObject(false)
  }
  const onCloseSelectObjectAndTypes = () => {
    setIsOpenModalSelectObjectAndTypes(false)
  }

  const onCloseEmissionResult = () => {
    setIsOpenEmissionResult(false)
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
    setSelectedRows(selected);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const createDataForHistogram = (inputArray) => {
    const data = inputArray.map(item => item.histogramValue);
    const names = inputArray.map(item => item.name);

// Creating the series object
    const series = {
      name: "",
      data: data
    };
    setNamesChart(names)
    const x = [{
      name: '',
      data: [230, 310]
    }]
    setBarChart([series])
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
          const sendData = {
            period: isPeriod,
            sensorIds: sensorIds
          }
          const result: any = await sensorsDataClient.getSensorsDataFromApi(sendData);
          switch (result?.data?.statusCode) {
            case 200:
              setAlertColor("success");
              setIsMessage(result?.data?.message);
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


  useImperativeHandle(ref, (data) => ({
    customMethod: (data) => {
      const newData = [data]
      setNewRequestData(newData)
    }
  }));
  const setNewRequestData = (data) => {
    console.log(`Sensor data ----`, data);
    setFilteredSensors((filteredSensors) => {
      const newFilteredSensors = [...filteredSensors];
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
  const openTableAdditionalInfo = async (object_id, model) => {
    setIsOpenEmissionResult(true)
    setSelectedObject(object_id)
    setSelectedModel(model)
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

  const settingParameters = async () => {
    setIsOpenModalSelectObjectAndTypes(true)
  }

  const sendChangeDataForModelOnObject = async (data) => {
    onCloseSelectObjectAndTypes(false)
    setFilteredSensors([])
    setGroupedData([])
    setBarChart([])
    setSelectedObject(data.object_id)
    console.log('data.object_id   ---', data.object_id)
    try {
      const result = await sensorsClient.changeDataForEmissionProcessing(data);
      handleApiResponse(result, (result) => {
        console.log('result -----', result.data)
        dispatch(addSensors(result.data.allSensors));
      });
    } catch (error) {
      handleApiError(error);
    }
  }
  const sendChangeNullsForObject = async (id) => {
    setIsOpenModalSelectObject(false)
    setFilteredSensors([])
    setGroupedData([])
    setBarChart([])
    try {
      const result = await sensorsClient.changeNullOrPeriodForOneSensor(id, isFlagForOneObject, defaultValueTimeRequest);
      handleApiResponse(result, (result) => {
        console.log('result -----', result.data)
        dispatch(addSensors(result.data.allSensors));
      });
    } catch (error) {
      handleApiError(error);
    }
  }
  const setIdForOneObject = (flag) => {
    setIsOpenModalSelectObject(true)
    setIsFlagForOneObject(flag)
    if(flag ==='period') {
      setTitleModalSelectObject('Выберите объект и периодичность опроса')
    } else{
      setTitleModalSelectObject('Выберите объект для установки нуля')
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6">Выберите объект</Typography>
      </Box>
      <ObjectsPaginationAndSelectTable rows={allObjects} onSelectedRowsChange={onSelectedRowsChange}/>
      <Grid container spacing={2} sx={{marginY: 2}}>
        <Grid item xs={12} md={4} display='flex' justifyContent='center'>
          <Button variant="contained" sx={{width: 220}} onClick={() => setIdForOneObject("null")}>Установка/сброс
            нуля для объектов</Button>
        </Grid>
        <Grid item xs={12} md={4} display='flex' justifyContent='center'>
        <Button variant="contained"  onClick={() => setIdForOneObject("period")} sx={{width: 220}} >Изменить
          периодичность опроса для объекта</Button>
        </Grid>
        <Grid item xs={12} md={4} display='flex' justifyContent='center'>
          <Button variant="contained" sx={{width: 220}} onClick={() => settingParameters()}>Управление
            опросом для объекта </Button>
        </Grid>
        <Grid item xs={12} md={12} display='flex' justifyContent='center' sx={{marginTop:2}}>
          {showButton && <Button variant="contained" onClick={resetAllSelect} sx={{width: 220}}>Очистить выборку</Button>}
        </Grid>
      </Grid>
      {filteredSensors.length !== 0 &&
        <Box>
          <Box>
            <Typography variant="h6" sx={{mb: 2}}>Выберите датчик</Typography>
          </Box>
          <AllSensorsPaginationAndSelectTable rows={filteredSensors} onFilterChange={handleFilterChange}
                                              onSelectionChange={handleSelectionChange}
                                              changeFromChartsWarningSensor={changeFromChartsWarningSensor}
                                              setNullOneSensor={setNullOneSensor}
                                              setMinOneSensor={setMinOneSensor}
                                              setMaxOneSensor={setMaxOneSensor}
                                              openTableAdditionalInfo={openTableAdditionalInfo}
          />
          <Grid container spacing={2} sx={{marginTop: 2}}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h6" sx={{my: 2}}>Для построения графиков выбрать период</Typography>
                <SelectTimePeriod setPeriodToParent={setIsPeriod} sx={{my: 2}}/>
                <Button variant="contained" onClick={sendRequestToApi} sx={{width: 220}}>Загрузить</Button>
              </Box>
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
      <SelectObjectModal isOpen={isOpenModalSelectObject} onClose={onCloseSelectObject} title={isTitleModalSelectObject}
                         sendChangeNullsForObject={sendChangeNullsForObject} isFlagForOneObject={isFlagForOneObject} defaultValueTimeRequest={defaultValueTimeRequest} setDefaultValueTimeRequest={setDefaultValueTimeRequest}/>
      <SelectObjectAndTypeOfSensorsModal isOpen={isOpenModalSelectObjectAndTypes} onClose={onCloseSelectObjectAndTypes} sendChangeDataForModelOnObject={sendChangeDataForModelOnObject} />
      <EmissionResultModal isOpen={isOpenEmissionResult} onClose={onCloseEmissionResult} idObject={selectedObject} allObjects={allObjects} allSensors={allSensors} model={selectedModel}/>
    </Stack>
  )
});
export default SelectSensorsForShow
