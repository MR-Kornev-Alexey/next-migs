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
import convertStringToNumber from "@/lib/calculate/convert-string-to-number";


export function SignUpFormAddDataSensor({sensorMain, dataOfSensor, alertModalColor,
                                          modalMessage, successOfResult}): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const numericSingleDotOrCommaRegex = /^-?[0-9]+([,.][0-9]{1,2})?$/;
  type Values = zod.infer<typeof schema>;

    const defaultValues = {
      sensor_id: sensorMain.id,
      factory_number: dataOfSensor?.factory_number || '',
      unit_of_measurement: '',
      installation_location: dataOfSensor?.installation_location || '',
      coefficient: dataOfSensor?.coefficient?.toString() || '',
      additionalSensorInfoNotation: dataOfSensor?.additionalSensorInfoNotation || ''
    } satisfies Values;

  const schema = zod.object({
    sensor_id: zod.string(),
    factory_number: zod.string().min(1, {message: 'Ввод заводского номера обязателен'}),
    unit_of_measurement: zod.string().min(1, {message: 'Ввод  единиц измерения обязателен'}),
    installation_location: zod.string().min(1, {message: 'Ввод места установки обязателен'}),
    coefficient: zod.string()
      .regex(numericSingleDotOrCommaRegex, {
        message: 'Ввод может содержать только цифры и одну точку или запятую для десятичных цифр, с не более чем двумя цифрами после них'
      }),
    additionalSensorInfoNotation: zod.string()
    }
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});


  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      values.coefficient = await convertStringToNumber(values.coefficient)
      const result: any = await sensorsClient.addAdditionalDataForSensor(values);
      successOfResult(result, 'additionalInfo')
      setIsPending(false);
    },
    []
  );
  const getUnitValues = () => {
    let selectedSensor;
    // Проходим по всем ключам в объекте UnitOfMeasurement
    for (const key in UnitOfMeasurement) {
      // Находим датчик с соответствующим типом (sensorType)
      if (UnitOfMeasurement[key].some(sensor => sensor.type === sensorMain.sensor_type)) {
        selectedSensor = UnitOfMeasurement[key];
        break; // Если найден, прекращаем поиск
      }
    }

    // Если найден соответствующий датчик, ищем соответствующую модель
    if (selectedSensor) {
      const selectedModel = selectedSensor.find(item => item.model === sensorMain.model);
      // Если модель найдена, возвращаем ее значения name_unit и value
      return selectedModel ? selectedModel.name_unit.map((unit, index) => ({
        name_unit: unit,
        value: selectedModel.value[index]
      })) : [];
    }

    return [];
  };
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h5">Добавление дополнительных данных для датчика:  {sensorMain.sensor_type}  | {sensorMain.designation}</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="factory_number"
            render={({field}) => (
              <FormControl error={Boolean(errors.factory_number)}>
                <InputLabel>Введите заводской номер</InputLabel>
                <OutlinedInput {...field} label="Введите заводской номер"/>
                {errors.factory_number ? <FormHelperText>{errors.factory_number.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="unit_of_measurement"
            render={({ field }) => (
              <FormControl error={Boolean(errors.unit_of_measurement)} sx={{width: '96%'}}>
                <InputLabel>Введите единицу измерения</InputLabel>
                <Select {...field} label="Введите единицу измерения">
                  {getUnitValues().map((unit, index) => (
                    <MenuItem key={index} value={unit.value}>{unit.name_unit}</MenuItem>
                  ))}
                </Select>
                {errors.unit_of_measurement ? <FormHelperText>{errors.unit_of_measurement.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="installation_location"
            render={({field}) => (
              <FormControl error={Boolean(errors.installation_location)}>
                <InputLabel>Введите место установки</InputLabel>
                <OutlinedInput {...field} label="Введите место установки"/>
                {errors.installation_location ? <FormHelperText>{errors.installation_location.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="coefficient"
            render={({field}) => (
              <FormControl error={Boolean(errors.coefficient)}>
                <InputLabel>Введите коэффициент</InputLabel>
                <OutlinedInput {...field} label="Введите коэффициент"/>
                {errors.coefficient ? <FormHelperText>{errors.coefficient.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="additionalSensorInfoNotation"
            render={({field}) => (
              <FormControl error={Boolean(errors.additionalSensorInfoNotation)}>
                <InputLabel>Введите примечание</InputLabel>
                <OutlinedInput {...field} label="Введите примечание"/>
                {errors.additionalSensorInfoNotation ? <FormHelperText>{errors.additionalSensorInfoNotation.message}</FormHelperText> : null}
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
              Сохранить
            </Box>
            }
          </Button>
          {modalMessage&&<Alert color={alertModalColor}>{modalMessage}</Alert>}
        </Stack>
      </form>
    </Stack>
  );
}
