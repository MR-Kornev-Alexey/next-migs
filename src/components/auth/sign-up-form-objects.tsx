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
import {ObjectFormInput} from "@/types/objectFormInput";
import {objectClient} from "@/lib/objects/object-client";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { objectsTypeOptions, objectsMaterialsOptions } from "@/lib/common/optionsObjects"

const schema = zod.object({
    name: zod.string().min(1, {message: 'Ввод имени обязателен'}),
    geo: zod.string(),
    address: zod.string().min(1, {message: 'Ввод адреса организации обязателен'}),
    notation: zod.string(),
    organization_id: zod.string().min(1, {message: 'Ввод адреса организации обязателен'}),
    objectsType:  zod.string().min(1, {message: 'Ввод адреса организации обязателен'}),
    objectsMaterial: zod.string().min(1, {message: 'Ввод адреса организации обязателен'})
  }
);

type Values = zod.infer<typeof schema>;
const defaultValues: ObjectFormInput = {
  organization_id: "",
  objectsType: "bridge",
  objectsMaterial: "ferroconcrete",
  geo: "",
  name: "Октябрьский мост",
  address: "Ярославль",
  notation: ""
} satisfies Values;

export function SignUpFormObject({isFirst,closeModal, onRegistrationObjectSuccess, rowsOrganizations}): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const result = await objectClient.initSignObject(values);
      console.log(result)
      // Проверить наличие ошибки
      if (result?.error) {
        setError('root', { type: 'server', message: result?.error });
        setIsPending(false);
        setIsMessage('Ошибка ввода, повторите снова');
        return
      } else {
        setIsPending(false);
        closeModal(false)
        onRegistrationObjectSuccess(result);
      }
    },
    [setError]
  );

  const organizationOptions = rowsOrganizations.map(user => ({
    value: user.id,
    label: user.name
  }));

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
          <Typography variant="h4">Добавление нового объекта</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="name"
            render={({field}) => (
              <FormControl error={Boolean(errors.name)}>
                <InputLabel>Введите название</InputLabel>
                <OutlinedInput {...field} label="Введите название"/>
                {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({field}) => (
              <FormControl error={Boolean(errors.address)}>
                <InputLabel>Адрес организации</InputLabel>
                <OutlinedInput {...field} label="Введите адрес"/>
                {errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="geo"
            render={({field}) => (
              <FormControl error={Boolean(errors.geo)}>
                <InputLabel>Введите геолокацию</InputLabel>
                <OutlinedInput {...field} label="Ввод геолокации"/>
                {errors.geo ? <FormHelperText>{errors.geo.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="objectsType"
            defaultValue="bridge" // Установите значение по умолчанию на пустую строку
            render={({ field }) => (
              <FormControl error={Boolean(errors.objectsType)}>
                <InputLabel id="select-label">Выберите тип здания</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                >
                  <MenuItem disabled value="bridge">
                    Выберите тип здания
                  </MenuItem>
                  {objectsTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.objectsType ? <FormHelperText>{errors.objectsType.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="objectsMaterial"
            defaultValue="mixed" // Установите значение по умолчанию на пустую строку
            render={({ field }) => (
              <FormControl error={Boolean(errors.objectsMaterial)}>
                <InputLabel id="select-label">Выберите материал</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                >
                  <MenuItem disabled value="mixed">
                    Выберите материал
                  </MenuItem>
                    {objectsMaterialsOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.objectsMaterial ? <FormHelperText>{errors.objectsMaterial.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="organization_id"
            defaultValue="-1"
            render={({ field }) => (
              <FormControl error={Boolean(errors.organization_id)}>
                <InputLabel id="select-label">Выберите организацию</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Выберите вариант"
                >
                  <MenuItem disabled value="-1">
                    Выберите организацию
                  </MenuItem>
                  {organizationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.organization_id ? <FormHelperText>{errors.organization_id.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="notation"
            render={({field}) => (
              <FormControl error={Boolean(errors.notation)}>
                <InputLabel>Дополнительно</InputLabel>
                <OutlinedInput {...field} label="Дополнительно"/>
                {errors.notation ? <FormHelperText>{errors.notation.message}</FormHelperText> : null}
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
        </Stack>
      </form>
      {isMessage&&<Alert color="error">{isMessage}</Alert>}
    </Stack>
  );
}
