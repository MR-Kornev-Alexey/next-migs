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

const cyrillicRegex = /^[а-яёА-ЯЁ]+$/;

const schema = zod.object({
  firstName: zod.string()
    .min(1, { message: 'Ввод имени обязателен' })
    .regex(cyrillicRegex, { message: 'Введ только букв кириллицы' }),
  secondName: zod.string()
    .min(1, { message: 'Ввод фамилии обязателен' })
    .regex(cyrillicRegex, { message: 'Введ только букв кириллицы' }),
  email: zod.string().min(1, { message: 'Ввод email обязателен' }).email(),
  phone: zod.string().min(1, { message: 'Ввод телефона обязателен' }),
  position: zod.string().min(1, { message: 'Ввод должнсти обязателен' }),
  organization: zod.string().min(1, { message: 'Ввод организации обязателен' })
});

type Values = zod.infer<typeof schema>;

const defaultValues = { firstName: '',  secondName: '', email: '', phone: '', position: '', organisation: '', city: '' } satisfies Values;

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
      setIsPending(true);

      // const { error } = await authClient.signUp(values);

      console.log(values)

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        setIsMessage('Ошибка ввода, повторите снова')
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid md={6} xs={12}>
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
          <Grid md={6} xs={12}>
            <Controller
              control={control}
              name="secondName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.secondName)}>
                  <InputLabel>Введите фамилию</InputLabel>
                  <OutlinedInput {...field} label="Введите фамилию" />
                  {errors.secondName ? <FormHelperText>{errors.secondName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid md={6} xs={12}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email адрес</InputLabel>
                <OutlinedInput {...field} label="Email адрес" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          </Grid>
          <Grid md={6} xs={12}>
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
          <Grid md={6} xs={12}>
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
          <Grid md={6} xs={12}>
            <Controller
              control={control}
              name="organization"
              render={({ field }) => (
                <FormControl error={Boolean(errors.organization)}>
                  <InputLabel>Организация</InputLabel>
                  <OutlinedInput {...field} label="Организация" />
                  {errors.organization ? <FormHelperText>{errors.organization.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          {errors.root ? <Alert color="error">{isMessage}</Alert> : null}
          <Grid md={12} xs={12} display="flex" justifyContent="center">
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
