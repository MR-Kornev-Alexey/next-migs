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



export function SignUpFormAddLog({
                                   sensorMain, dataOfSensor,
                                   alertModalColor, successOfDownload, modalMessage
                                 }): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  type Values = zod.infer<typeof schema>;

  const defaultValues = {
    sensor_id: sensorMain.id,
    passport_information: dataOfSensor?.passport_information,
    verification_information: dataOfSensor?.verification_information,
    warranty_information: dataOfSensor?.warranty_information,
    sensorOperationLogNotation: dataOfSensor?.sensorOperationLogNotation
  } satisfies Values;

  const schema = zod.object({
      sensor_id: zod.string(),
      passport_information: zod.string().min(1, {message: 'Ввод информации о паспорте обязателен'}),
      verification_information: zod.string().min(1, {message: 'Ввод  информации о поверке обязательна'}),
      warranty_information: zod.string().min(1, {message: 'Ввод  информации о гарентии обязательна'}),
      sensorOperationLogNotation: zod.string()
    }
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});


  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const result: any = await sensorsClient.addLogDataForSensor(values);
      successOfDownload(result, 'operationLog')
      setIsPending(false);
    },
    []
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h5">Добавление данных журналов для
          датчика:<br/>{sensorMain.sensor_type} | {sensorMain.designation}</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="passport_information"
            render={({field}) => (
              <FormControl error={Boolean(errors.passport_information)}>
                <InputLabel>Введите информацию о паспорте</InputLabel>
                <OutlinedInput {...field} label="Введите информацию о паспорте"/>
                {errors.passport_information ?
                  <FormHelperText>{errors.passport_information.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="verification_information"
            render={({field}) => (
              <FormControl error={Boolean(errors.verification_information)}>
                <InputLabel>Введите информацию о поверке</InputLabel>
                <OutlinedInput {...field} label="Введите информацию о поверке"/>
                {errors.verification_information ?
                  <FormHelperText>{errors.verification_information.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="warranty_information"
            render={({field}) => (
              <FormControl error={Boolean(errors.warranty_information)}>
                <InputLabel>Введите информацию о гарантии</InputLabel>
                <OutlinedInput {...field} label="Введите информацию о гарантии"/>
                {errors.warranty_information ?
                  <FormHelperText>{errors.warranty_information.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="sensorOperationLogNotation"
            render={({field}) => (
              <FormControl error={Boolean(errors.sensorOperationLogNotation)}>
                <InputLabel>Введите примечание</InputLabel>
                <OutlinedInput {...field} label="Введите примечание"/>
                {errors.sensorOperationLogNotation ?
                  <FormHelperText>{errors.sensorOperationLogNotation.message}</FormHelperText> : null}
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
          {modalMessage && <Alert color={alertModalColor}>{modalMessage}</Alert>}
        </Stack>
      </form>
    </Stack>
  );
}
