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
import convertUnits from "@/lib/common/convertUnits";
import {useForm} from "react-hook-form";
import {FilePdf, PlayPause, Siren, Article} from "@phosphor-icons/react";
import Link from "@mui/material/Link";
import SpinnerWithAlert from "@/lib/common/SpinnerWithAlert";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import {useRouter} from "next/navigation";
import {SvgSpinnersBarsScale} from "@/lib/animated-icon/chart-icon";
import {LineMdPlayFilledToPauseTransition} from "@/lib/animated-icon/pause-icon";
import useUpdateSensor from "@/lib/update-data/update-one-sensor";
import {addSensors} from "@/store/sensorsReducer";
import ModalInfoAboutSensor from "@/components/modal/modal-info-error-about-sensor";
import handleApiResponseModal from "@/lib/common/handle-api-response-modal";
import handleApiErrorModal from "@/lib/common/handle-api-error-modal";


export default function Page(): React.JSX.Element {
  const [alertColor, setAlertColor] = React.useState<string>('error');
  const [alertModalColor, setAlertModalColor] = React.useState<string>('error');
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isAdditionalOpen, setIsAdditionalOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState<boolean>(false);
  const [file, setFile] = React.useState(null)
  const [reloadFlag, setReloadFlag] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const {control, handleSubmit} = useForm({
    defaultValues: {
      file: undefined
    }
  });


  const router = useRouter();
  const allSensors = useSelector((state: RootState) => state.allSensors.value);
  const selectedID = useSelector((state: RootState) => state.selectedSensor.value);
  const [dataOfSensor, setIsDataOfSensor] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [isMessage, setIsMessage] = useState("");

  useEffect(() => {
    setLoading(true);

    if (selectedID && selectedID.length > 0) {
      const sensorData = allSensors?.find(s => s.id === selectedID);
      if (sensorData) {
        setIsMessage("");
        setIsDataOfSensor(sensorData);
        setLoading(false);
      } else {
        setIsMessage("Sensor data not found.");
        setLoading(false);
      }
    } else {
      router.push("/dashboard/sensors");
    }
  }, [reloadFlag, allSensors, selectedID, router]);

  const openModalNewAdditionalDataSensor = () => {
    setIsAdditionalOpen(true);
    setModalMessage('');
  };
  const openModalNewOperationLogSensor = () => {
    setIsLogsOpen(true);
    setModalMessage('');
  };
  const closeModalNewAdditionalDataSensor = () => {
    setIsAdditionalOpen(false);
  };
  const closeModalNewOperationLogSensor = () => {
    setIsLogsOpen(false);
  };
  const openModalErrorInfoSensor = () => {
    setIsModalErrorOpen(true);
  };
  const closeModalErrorInfoSensor = () => {
    setIsModalErrorOpen(false);
  };

  const successOfResult = (result, flag) => {
    alert(flag)
    try {
      handleApiResponseModal({
        result,
        successCallback: () => {
          const successUpdatedData = useUpdateSensor(result?.data?.oneSensor, allSensors)
          dispatch(addSensors(successUpdatedData));
        },
        setAlertColor: setAlertModalColor,
        setIsMessage: setModalMessage,
        closeModal: (isOpen) => {
          if (flag === 'additionalInfo') {
            setTimeout(() => {
              setIsAdditionalOpen(isOpen);
            }, 2000);
          } else if (flag === 'operationLog') {
            setTimeout(() => {
              setIsLogsOpen(isOpen);
            }, 2000);
          }
        },
      });
    } catch (error) {
      handleApiErrorModal({
        error,
        setIsMessage: setModalMessage,
        setIsAlert: setAlertModalColor,
        closeModal: (isOpen) => {
          if (flag === 'additionalInfo') {
            setTimeout(() => {
              setIsAdditionalOpen(isOpen);
            }, 2000);
          } else if (flag === 'operationLog') {
            setTimeout(() => {
              setIsLogsOpen(isOpen);
            }, 2000);
          }
        },
      });
    }
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
      const result: any = await sensorsClient.saveFileAboutSensor(formData);

      // Обновление флага перезагрузки и сброс файла
      setReloadFlag(prev => !prev);
      setFile(null);

      // Сброс значения поля ввода файла
      e.target.reset(); // assuming the form is the target

      const successUpdatedData = useUpdateSensor(result?.data?.oneSensor, allSensors);
      dispatch(addSensors(successUpdatedData));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Stack spacing={3}>
      {isLoading && <SpinnerWithAlert isMessage={isMessage} alertColor={alertColor}/>}
      {dataOfSensor && <Box>
        <Box sx={{marginY: 2}}>
          <Typography variant="h4"> {dataOfSensor?.sensor_type} | {dataOfSensor?.designation}</Typography>
        </Box>
        {/*{JSON.stringify(dataOfSensor.requestSensorInfo[0])}*/}
        <Typography variant="h5" sx={{marginY: 2}}>Основные данные</Typography>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 400}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Адрес установки</TableCell>
                <TableCell>Тип датчика</TableCell>
                <TableCell>Модель</TableCell>
                <TableCell style={{width: "10%", textAlign: "center"}}>Сетевой номер</TableCell>
                <TableCell style={{width: "10%", textAlign: "center"}}>Активность</TableCell>
                <TableCell style={{textAlign: "center"}}>Сообщения о ошибках</TableCell>
                <TableCell>Примечание</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body1">{dataOfSensor?.object.address} | {dataOfSensor?.object.name}</Typography>
                </TableCell>
                <TableCell> {dataOfSensor?.sensor_type}</TableCell>
                <TableCell>{dataOfSensor?.model}</TableCell>
                <TableCell style={{width: "10%", textAlign: "center"}}>{dataOfSensor?.network_number}</TableCell>
                <TableCell style={{width: "10%", textAlign: "center"}}>
                  {dataOfSensor?.run ? <SvgSpinnersBarsScale/> : <LineMdPlayFilledToPauseTransition/>
                  }
                </TableCell>
                <TableCell style={{textAlign: "center", cursor: "pointer"}}
                           onClick={() => openModalErrorInfoSensor()}><Article size={24}/></TableCell>
                <TableCell>{dataOfSensor?.notation}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h5" sx={{marginY: 2}}>Дополнительные данные</Typography>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 400}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{textAlign: "center"}}>Заводской номер</TableCell>
                <TableCell style={{textAlign: "center"}}>Единица измерения</TableCell>
                <TableCell style={{textAlign: "center"}}>Место установки</TableCell>
                <TableCell style={{textAlign: "center"}}>Коэффициент</TableCell>
                <TableCell style={{textAlign: "center", width: "8%"}}>Порог выброса &#8432;</TableCell>
                <TableCell style={{textAlign: "center", width: "12%"}}>Количество выбросов подряд &#8432;</TableCell>
                <TableCell style={{textAlign: "center", width: "12%"}}>Количество ошибок подряд &#8432;</TableCell>
                <TableCell style={{textAlign: "center"}}>Примечание</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  style={{textAlign: "center"}}>{dataOfSensor?.additional_sensor_info[0]?.factory_number}</TableCell>
                <TableCell
                  style={{textAlign: "center"}}>{convertUnits(dataOfSensor?.additional_sensor_info[0]?.unit_of_measurement)}</TableCell>
                <TableCell
                  style={{textAlign: "center"}}>{dataOfSensor?.additional_sensor_info[0]?.installation_location}</TableCell>
                <TableCell
                  style={{textAlign: "center"}}>{dataOfSensor?.additional_sensor_info[0]?.coefficient}</TableCell>
                <TableCell
                  style={{textAlign: "center"}}>{dataOfSensor?.additional_sensor_info[0]?.limitValue}</TableCell>
                <TableCell
                  style={{textAlign: "center"}}>{dataOfSensor?.additional_sensor_info[0]?.emissionsQuantity}</TableCell>
                <TableCell
                  style={{textAlign: "center"}}>{dataOfSensor?.additional_sensor_info[0]?.errorsQuantity}</TableCell>
                <TableCell
                  style={{textAlign: "center"}}>{dataOfSensor?.additional_sensor_info[0]?.additionalSensorInfoNotation}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" sx={{marginY: 2}}>
          <Button variant="contained" onClick={openModalNewAdditionalDataSensor}>Загрузить данные</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 400}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{textAlign: "center"}}>Код запроса</TableCell>
                <TableCell style={{textAlign: "center"}}>Периодичность запроса &#8432;</TableCell>
                <TableCell style={{textAlign: "center"}}>Последнее базовое значение</TableCell>
                <TableCell style={{textAlign: "center"}}>Логический ноль &#8432;</TableCell>
                <TableCell style={{textAlign: "center"}}>Минимальное базовое значение</TableCell>
                <TableCell style={{textAlign: "center"}}>Максимальное базовое значение</TableCell>
                <TableCell style={{textAlign: "center"}}>Контроль оповещения</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{textAlign: "center"}}>{dataOfSensor?.requestSensorInfo[0]?.request_code}</TableCell>
                <TableCell style={{textAlign: "center"}}>{dataOfSensor?.requestSensorInfo[0]?.periodicity}</TableCell>
                <TableCell
                  style={{textAlign: "center"}}>{dataOfSensor?.requestSensorInfo[0]?.last_base_value}</TableCell>
                <TableCell style={{textAlign: "center"}}>{dataOfSensor?.requestSensorInfo[0]?.base_zero}</TableCell>
                <TableCell style={{textAlign: "center"}}>{dataOfSensor?.requestSensorInfo[0]?.min_base}</TableCell>
                <TableCell style={{textAlign: "center"}}>{dataOfSensor?.requestSensorInfo[0]?.max_base}</TableCell>
                <TableCell style={{cursor: "pointer"}} align="center">{dataOfSensor?.requestSensorInfo[0]?.warning ?
                  <Siren size={24} color="#a00323"/> : <PlayPause size={24}/>}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{marginTop: 2}}>
          <Typography variant="h5">Данные по журналам</Typography>
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
                  <TableCell>{dataOfSensor.sensor_operation_log[0]?.passport_information}</TableCell>
                  <TableCell>{dataOfSensor.sensor_operation_log[0]?.verification_information}</TableCell>
                  <TableCell>{dataOfSensor.sensor_operation_log[0]?.warranty_information}</TableCell>
                  <TableCell>{dataOfSensor.sensor_operation_log[0]?.sensorOperationLogNotation}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" sx={{marginY: 2}}>
            <Button variant="contained" onClick={openModalNewOperationLogSensor}>Загрузить данные</Button>
          </Box>
        </Box>
        <Typography variant="h5" sx={{marginTop: 2}}>Копии документов</Typography>
        <Box display="flex" justifyContent="space-around">
          {dataOfSensor.files.map((item, index) =>
            <Box key={index} sx={{cursor: "pointer"}}>
              <Link href={item.url} target="_blank">
                <FilePdf size={36}/>
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
        <Typography variant="body2" sx={{marginY: 2}}>&#8432;<i>Данные для каждого типа датчиков на каждом
          объекте</i></Typography>

        <ModalInfoAboutSensor isOpen={isModalErrorOpen} onClose={closeModalErrorInfoSensor}
                              dataError={dataOfSensor?.error_information}/>
        <ModalNewAdditionalDataSensor isOpen={isAdditionalOpen} onClose={closeModalNewAdditionalDataSensor}
                                      sensorMain={dataOfSensor}
                                      alertModalColor={alertModalColor}
                                      modalMessage={modalMessage}
                                      dataOfSensor={dataOfSensor?.additional_sensor_info[0]}
                                       successOfResult={successOfResult}/>
        <ModalNewOperationLogSensor isOpen={isLogsOpen} sensorMain={dataOfSensor}
                                    dataOfSensor={dataOfSensor?.sensor_operation_log[0]}
                                    alertModalColor={alertModalColor}
                                    modalMessage={modalMessage}
                                    onClose={closeModalNewOperationLogSensor}
                                    successOfDownloadLogData={successOfResult}/>
      </Box>
      }
    </Stack>
  );
}
