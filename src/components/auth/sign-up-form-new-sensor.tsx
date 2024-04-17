import * as React from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import {Controller, useForm} from 'react-hook-form';
import {z as zod} from 'zod';
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import sensors from "@/lib/common/sensors"
import {sensorsClient} from "@/lib/sensors/sensors-client";


const schema = zod.object({
    sensor_type: zod.string()
      .min(1, {message: 'Ввод датчика обязателен'}),
    model: zod.string().min(1, {message: 'Ввод модели обязателен'}),
    designation: zod.string().min(1, {message: 'Ввод обозначения обязателен'}),
    object_id: zod.string().min(1, {message: 'Ввод объекта обязателен'}),
    network_number: zod.string()
      .min(1, {message: "Ввод обозначения обязателен"})
      .refine((value) => {
        // Проверяем, является ли строка числом или число
        return !isNaN(Number(value));
      }, {message: "Ввод должен быть числом"}),
    notation: zod.string()
  }
);

type Values = zod.infer<typeof schema>;
const defaultValues = {
  sensor_type: 'strainGauge',
  model: '',
  designation: '',
  object_id: '',
  network_number: '',
  notation: ''
} satisfies Values;

export function SignUpFormNewSensor({onRegistrationSuccess, closeModal, objects}): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<string>('');


  const {
    control,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      setIsMessage("")
      values.network_number = Number(values.network_number)
      console.log(values)
      const result = await sensorsClient.createNewSensor(values);
      console.log('result---',result)
      if (result?.data?.statusCode === 400) {
        // console.log("result --- ", result?.data);
        setIsPending(false);
        setIsMessage(result?.data?.answer)
        setAlertColor("error");
      }
      if (result?.statusCode === 500) {
        // console.log("result --- ", result?.data);
        setIsPending(false);
        setIsMessage(result?.message)
        setAlertColor("error");
      }
      if (result?.error) {
        // console.log("result --- ", result?.data);
        setIsPending(false);
        setIsMessage(result?.error)
        setAlertColor("error");
      }
      if (result?.data?.statusCode === 200) {
        console.log("result --- ", result?.data);
        setIsPending(false);
        setAlertColor("success");
        setIsMessage(result?.data?.answer)
        onRegistrationSuccess(result?.data);
        setTimeout(() => {
          // обновленные данные в таблицу
          closeModal(false)
        }, 2000);
      }
      setIsPending(false);
    },
    []
  );

  const objectOptions = objects.map(user => ({
    value: user.id,
    label: user.name
  }));

  const sensorsOptions = Object.keys(sensors).map(key => ({
    value: key,
    label: sensors[key].type
  }));

  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="sensor_type"
            render={({field}) => (
              <FormControl error={Boolean(errors.sensor_type)}>
                <InputLabel id="select-label">Выберите датчик</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                  defaultValue="strainGauge"
                >
                  {sensorsOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.sensor_type ? <FormHelperText>{errors.sensor_type.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="model"
            render={({field}) => {
              const {sensor_type} = watch(); // Получаем текущее значение sensor_type
              const selectedSensor = sensors[sensor_type]; // Получаем данные о выбранном датчике
              const models = Array.isArray(selectedSensor.model) ? selectedSensor.model : [selectedSensor.model]; // Проверяем, является ли модель массивом или строкой
              return (
                <FormControl error={Boolean(errors.model)}>
                  <InputLabel id="model-label">Выберите модель</InputLabel>
                  <Select
                    {...field}
                    labelId="model-label"
                    label="Выберите модель"
                  >
                    {models.map((model) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.model ? <FormHelperText>{errors.model.message}</FormHelperText> : null}
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="designation"
            render={({field}) => {
              return (
                <FormControl error={Boolean(errors.designation)}>
                  <InputLabel>Введите обозначение</InputLabel>
                  <OutlinedInput {...field} label="Обозначение"/>
                  {errors.designation ? <FormHelperText>{errors.designation.message}</FormHelperText> : null}
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="network_number"
            render={({field}) => (
              <FormControl error={Boolean(errors.network_number)}>
                <InputLabel>Введите сетевой номер</InputLabel>
                <OutlinedInput {...field} label="Сетевой номер"/>
                {errors.network_number ? <FormHelperText>{errors.network_number.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="object_id"
            defaultValue="-1"
            render={({field}) => (
              <FormControl error={Boolean(errors.object_id)}>
                <InputLabel id="select-label">Выберите объект</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                >
                  <MenuItem disabled value="-1">
                    Выберите объект
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
