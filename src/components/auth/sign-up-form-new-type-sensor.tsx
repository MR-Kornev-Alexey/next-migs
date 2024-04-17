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
import {organizationClient} from "@/lib/organizations/organization-client";
import {z as zod} from 'zod';
import Box from "@mui/material/Box";
import {sensorsClient} from "@/lib/sensors/sensors-client";
import Alert from "@mui/material/Alert";





export function SignUpFormNewTypeSensor({closeModal, isResultSuccess, isSensorKey, isDisabled}): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('');

  const latinRegex = /^[a-zA-Z]+$/;
  type Values = zod.infer<typeof schema>;
  let defaultValues;
  if(isSensorKey){
     defaultValues = {
      sensor_key: isSensorKey.sensorKey,
      sensor_type: isSensorKey.sensorType,
      model: 'МИГС-001'
    } satisfies Values;
  } else {
     defaultValues = {
      sensor_key: '',
      sensor_type: '',
      model: 'МИГС-002'
    } satisfies Values;
  }
  const schema = zod.object({
      sensor_key: zod.string().min(1, {message: 'Ввод нового ключа обязателен'})
        .regex(latinRegex, {message: 'Ввод должен содержать только английские буквы'}),
      sensor_type: zod.string().min(1, {message: 'Ввод  типа датчика обязателен'}),
      model: zod.string().min(1, {message: 'Ввод модели обязателен'})
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
      setIsMessage("")
      const result = await sensorsClient.createNewTypeSensor(values);
      if(result?.data?.statusCode === 200){
        setIsPending(false);
        setAlertColor( "success");
        setIsMessage(result?.data?.message)
        setTimeout(() => {
          // обновленные данные в таблицу
          isResultSuccess(result)
          closeModal(false)
        }, 2000);
      }
      if(result?.data?.statusCode === 400){
        // console.log("result --- ", result?.data);
        setIsPending(false);
        setIsMessage(result?.data?.message)
        setAlertColor( "error");
      }
      // Проверить наличие ошибки
      if (result?.error) {
        setIsPending(false);
        setIsMessage(result?.data?.message)
        setAlertColor( "error");
        return
      }
    },
    [setError]
  );
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Добавление нового датчика </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="sensor_key"
            render={({field}) => (
              <FormControl error={Boolean(errors.sensor_key)}>
                <InputLabel>Введите ключ</InputLabel>
                <OutlinedInput {...field} label="Введите ключ" disabled={isDisabled}/>
                {errors.sensor_key ? <FormHelperText>{errors.sensor_key.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="sensor_type"
            render={({field}) => (
              <FormControl error={Boolean(errors.sensor_type)}>
                <InputLabel>Введите название</InputLabel>
                <OutlinedInput {...field} label="Введите название" disabled={isDisabled}/>
                {errors.sensor_type ? <FormHelperText>{errors.sensor_type.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="model"
            render={({field}) => (
              <FormControl error={Boolean(errors.model)}>
                <InputLabel>Введите модель</InputLabel>
                <OutlinedInput {...field} label="Введите модель"/>
                {errors.model ? <FormHelperText>{errors.model.message}</FormHelperText> : null}
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
              Зарегестрировать
            </Box>
            }
          </Button>
          {isMessage&&<Alert color={alertColor}>{isMessage}</Alert>}
        </Stack>
      </form>
    </Stack>
  );
}
