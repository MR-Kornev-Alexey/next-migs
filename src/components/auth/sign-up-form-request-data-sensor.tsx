'use client';
import * as React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Controller, useForm} from 'react-hook-form';
import {z as zod} from 'zod';
import Box from "@mui/material/Box";
import {sensorsClient} from "@/lib/sensors/sensors-client";
import Alert from "@mui/material/Alert";
import UnitOfMeasurement from "@/lib/common/unitOfMeasurement";
import {MenuItem, Select} from "@mui/material";



export function SignUpFormRequestDataSensor({closeModal, dataOfSensor, successOfDownload}): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('');

  type Values = zod.infer<typeof schema>;

    const defaultValues = {
      sensor_id: dataOfSensor.id,
      periodicity: 100,
      request_code: ''
    } satisfies Values;

  const schema = zod.object({
    sensor_id: zod.string(),
    periodicity: zod
      .string()
      .refine(value => /^[1-9]\d{2,}$/.test(value) && parseInt(value, 10) >= 100, {
        message: 'Длительность должна быть положительным числом, не менее 100',
        path: ['periodicity'],
      }),
    request_code: zod.string().min(1, { message: 'Ввод кода запроса обязателен' }),
  });
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});


  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      setIsMessage("")
      const result: any = await sensorsClient.addRequestDataForSensor(values);
      switch (result?.data?.statusCode) {
        case 200:
          setAlertColor("success");
          setIsMessage(result?.data?.message);
          successOfDownload(result?.data?.oneSensor)
          setTimeout(() => {
            closeModal(false);
          }, 2000);
          break;
        case 400:
        case 500:
          setAlertColor("error");
          setIsMessage(result?.data?.message);
          break;
        default:
          // Обрабатываем ошибку
          setAlertColor("error");
          setIsMessage(result?.error?.message || "Произошла ошибка");
          break;
      }
      setIsPending(false);
    },
    []
  );
  const getUnitValues = () => {
    let selectedSensor;
    // Проходим по всем ключам в объекте UnitOfMeasurement
    for (const key in UnitOfMeasurement) {
      // Находим датчик с соответствующим типом (sensorType)
      if (UnitOfMeasurement[key].some(sensor => sensor.type === dataOfSensor.sensor_type)) {
        selectedSensor = UnitOfMeasurement[key];
        break; // Если найден, прекращаем поиск
      }
    }

    // Если найден соответствующий датчик, ищем соответствующую модель
    if (selectedSensor) {
      const selectedModel = selectedSensor.find(item => item.model === dataOfSensor.model);
      // Если модель найдена, возвращаем ее значения name_unit и value
      return selectedModel ? selectedModel.name_unit.map((unit, index) => ({
        name_unit: unit,
        code: selectedModel.code[index]
      })) : [];
    }

    return [];
  };
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h5">Добавление данных по запросу для датчика:  {dataOfSensor.sensor_type}  | {dataOfSensor.designation}</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="periodicity"
            render={({field}) => (
              <FormControl error={Boolean(errors.periodicity)}>
                <InputLabel>Введите периодичность (мс)</InputLabel>
                <OutlinedInput {...field} type="number" label="Введите периодичность (мс)"/>
                {errors.periodicity ? <FormHelperText>{errors.periodicity.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="request_code"
            render={({ field }) => (
              <FormControl error={Boolean(errors.request_code)} sx={{width: '96%'}}>
                <InputLabel>Выберите код запроса</InputLabel>
                <Select {...field} label="Введите единицу измерения">
                  {getUnitValues().map((unit, index) => (
                    <MenuItem key={index} value={unit.code}>{unit.code}</MenuItem>
                  ))}
                </Select>
                {errors.request_code ? <FormHelperText>{errors.request_code.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Button disabled={isPending} type="submit" variant="contained" sx={{marginTop: 2}}>
            {isPending ? <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity={0.25}></path>
              <path fill="currentColor"
                    d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
                                  values="0 12 12;360 12 12"></animateTransform>
              </path>
            </svg> : <Box>
              Зарегистрировать
            </Box>
            }
          </Button>
          {isMessage&&<Alert color={alertColor}>{isMessage}</Alert>}
        </Stack>
      </form>
    </Stack>
  );
}
