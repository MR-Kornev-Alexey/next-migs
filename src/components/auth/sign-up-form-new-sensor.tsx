import * as React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Controller, useForm } from 'react-hook-form';
import {z as zod} from 'zod';
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import {sensorsClient} from "@/lib/sensors/sensors-client";
import sensors from "@/lib/common/sensors";
import {customersClient} from "@/lib/customers/customers-client";


export function SignUpFormNewSensor({onRegistrationSensorSuccess, closeModal, objects, typesSensors}): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('');
  const [selectedSensorType, setSelectedSensorType] = React.useState("-1");
  const [selectedSensorKey, setSelectedSensorKey] = React.useState("-1");

  const schema = zod.object({
      sensor_type: zod.string()
        .min(1, {message: 'Ввод датчика обязателен'}),
      model: zod.string().min(1, {message: 'Ввод модели обязателен'}),
      designation: zod.string().min(1, {message: 'Ввод обозначения обязателен'}),
      object_id: zod.string().min(1, {message: 'Ввод объекта обязателен'}),
      network_number: zod.string()
      .min(1, { message: 'Ввод сетвого номера обязателен' })
      .regex(/^\d+$/, { message: 'Значение должно состоять только из цифр' }),
      notation: zod.string(),
      sensor_key: zod.string()
    }
  );

  type Values = zod.infer<typeof schema>;
  const defaultValues = {
    sensor_type: selectedSensorType,
    sensor_key: selectedSensorKey,
    model: '',
    designation: "",
    object_id: '',
    network_number: '',
    notation: ''
  } satisfies Values;

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      setIsMessage("")
      values.network_number = Number(values.network_number)
      values.sensor_type = sensors[values.sensor_key].type
      const result:any = await sensorsClient.setNewSensorToObject(values);
      switch (result?.data?.statusCode) {
        case 200:
          setAlertColor("success");
          setIsMessage(result?.data?.message);
          onRegistrationSensorSuccess(result?.data);
          setTimeout(() => {
            closeModal(false);
          }, 2000);
          break;
        case 400:
        case 500:
          setAlertColor("error");
          setIsMessage(result?.data?.message);
          setTimeout(() => {
            closeModal(false);
          }, 2000);
          break;
        default:
          // Обрабатываем ошибку
          setAlertColor("error");
          setIsMessage(result?.error?.message || "Произошла ошибка обработки данных");
          setTimeout(() => {
            closeModal(false);
          }, 2000);
          break;
      }
      setIsPending(false);
    },
    []
  );

  const objectOptions = objects.map(user => ({
    value: user.id,
    label: user.name
  }));

  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="sensor_key"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.sensor_key)}>
                <InputLabel id="select-label">Выберите тип датчика</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                  onChange={(e) => {
                    const selectedKey = e.target.value;
                    setSelectedSensorKey(selectedKey); // Здесь сохраняем выбранный тип датчика
                    field.onChange(selectedKey); // Здесь также обновляем значение контроллера
                  }}
                >
                  <MenuItem disabled value="-1">
                    Выберите тип датчика
                  </MenuItem>
                  {typesSensors.map((sensor) => (
                    <MenuItem key={sensor.sensor_key} value={sensor.sensor_key}>
                      {sensor.sensor_type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.sensor_key ? <FormHelperText>{errors.sensor_key.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="model"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.model)}>
                <InputLabel id="select-label">Выберите модель датчика</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                >
                  <MenuItem disabled value="-1">
                    Выберите модель датчика
                  </MenuItem>
                  {(typesSensors.find((sensor) => sensor.sensor_key === selectedSensorKey)?.models || []).map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
                {errors.model ? <FormHelperText>{errors.model.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="designation"
            render={({field}) => (
              <FormControl error={Boolean(errors.designation)}>
                <InputLabel>Введите обозначение</InputLabel>
                <OutlinedInput {...field} label="Введите обозначение"/>
                {errors.designation ? <FormHelperText>{errors.designation.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="network_number"
            render={({field}) => {
              return (
                <FormControl error={Boolean(errors.network_number)}>
                  <InputLabel>Введите сетевой номер</InputLabel>
                  <OutlinedInput {...field} label="Введите сетевой номер"/>
                  {errors.network_number ? <FormHelperText>{errors.network_number.message}</FormHelperText> : null}
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="object_id"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.object_id)}>
                <InputLabel id="select-label">Выберите объект установки</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                >
                  <MenuItem disabled value="-1">
                    Выберите организацию
                  </MenuItem>
                  {objectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.object_id ? <FormHelperText>{errors.object_id.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="notation"
            render={({field}) => (
              <FormControl error={Boolean(errors.notation)}>
                <InputLabel>Примечание</InputLabel>
                <OutlinedInput {...field} label="Примечание"/>
                {errors.notation ? <FormHelperText>{errors.notation.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained" sx={{my: 1}}>
            {isPending ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                      opacity={0.25}></path>
                <path fill="currentColor"
                      d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
                                    values="0 12 12;360 12 12"></animateTransform>
                </path>
              </svg>
            ) : (
              <Box>
                Добавить
              </Box>
            )}
          </Button>
          {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
        </Stack>
      </form>
    </Stack>
  );
}
