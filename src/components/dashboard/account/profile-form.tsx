'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import {customersClient} from "@/lib/customers/customers-client";


const CyrillicLettersRegex = /^[а-яА-Я\s]+$/;
const phoneRegex = /^\+7\d{10}$/;
const telegramRegex = /^@.*/;



const schema = zod.object({
    firstName: zod.string().min(1, {message: 'Ввод имени обязателен'})
      .regex(CyrillicLettersRegex, {message: 'Ввод только букв кириллицы'}),
    surName: zod.string().min(1, {message: 'Ввод фамилии обязателен'})
      .regex(CyrillicLettersRegex, {message: 'Ввод только букв кириллицы'}),
    telegram: zod.string().min(1, {message: 'Ввод аккаунт телеграма обязателен'})
      .regex(telegramRegex, {message: 'Аккаунт должен начинаться с @...'}),
    position: zod.string().min(1, {message: 'Ввод должности обязателен'}),
    phone: zod.string()
      .min(12, {message: 'Ввод должен содержать  12 символов'})
      .regex(phoneRegex, {message: 'Ввод должен содержать  +7 и 10 цифр'})
  }
);


type Values = zod.infer<typeof schema>;
const defaultValues = {
  user_id:   "",
  firstName: 'Алексей Юрьевич',
  surName: 'Корнев',
  telegram: '@MrkDigital',
  position: 'Инженер - программист',
  phone: '+79253114131'
} satisfies Values;
export function ProfileForm(): React.JSX.Element {
  const router = useRouter();



  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {

      const dataUser = localStorage.getItem('custom-auth-token');
      let userId = '';
      if (dataUser !== null) {
        userId = JSON.parse(dataUser).id;
      }
      console.log(values)
      setIsPending(true);
      const updatedValues = { ...values, user_id: userId };

      // console.log(updatedValues);
      const result = await customersClient.initSignAdditionalData(updatedValues);

// Проверить наличие ошибки
      if (result.error) {
        setError('root', { type: 'server', message: result.error });
        setIsPending(false);
        setIsMessage('Ошибка ввода, повторите снова');
        return;
      }

// Проверить наличие дополнительных данных
      if (result.additionalData) {
        setIsPending(false);
        console.log('result - ', result.newDataUser);
        localStorage.setItem('custom-auth-token', JSON.stringify(result.newDataUser));
        localStorage.setItem('custom-additional-data', JSON.stringify(result.additionalData));
      }


      // Refresh the auth state
      // await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      // router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={3} display="flex" justifyContent="center" alignItems="center">
      <Box> <Typography variant="body1">У вас не введены все данные. Пожалуйста заполните форму</Typography></Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} >
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstName)}>
                <InputLabel>Введите имя</InputLabel>
                <OutlinedInput {...field} label="Введите имя" />
                {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          </Grid>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Controller
              control={control}
              name="surName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.surName)}>
                  <InputLabel>Введите фамилию</InputLabel>
                  <OutlinedInput {...field} label="Введите фамилию" />
                  {errors.surName ? <FormHelperText>{errors.surName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
          <Controller
            control={control}
            name="telegram"
            render={({ field }) => (
              <FormControl error={Boolean(errors.telegram)}>
                <InputLabel>Телеграм</InputLabel>
                <OutlinedInput {...field} label="Телеграм" />
                {errors.telegram ? <FormHelperText>{errors.telegram.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          </Grid>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <FormControl error={Boolean(errors.phone)}>
                  <InputLabel>Номер телефона</InputLabel>
                  <OutlinedInput {...field} label="Номер телефона" type="phone" />
                  {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid md={6} xs={12} display="flex" justifyContent="center" alignItems="center">
            <Controller
              control={control}
              name="position"
              render={({ field }) => (
                <FormControl error={Boolean(errors.position)}>
                  <InputLabel>Должность</InputLabel>
                  <OutlinedInput {...field} label="Должность" />
                  {errors.position ? <FormHelperText>{errors.position.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          {errors.root ? <Alert color="error">{isMessage}</Alert> : null}
          <Grid md={12} xs={12} display="flex" justifyContent="center" alignItems="center" >
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? <Box>сохранение...</Box> :<Box>
              Сохранить
            </Box>
            }
          </Button>
          </Grid>
          </Grid>
      </form>
    </Stack>
  );
}
