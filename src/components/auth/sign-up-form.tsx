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

const cyrillicRegex = /^[a-zA-Z0-9_.@]+$/;

const schema = zod.object({
  name: zod.string()
    .min(1, { message: 'Ввод имени обязателен' })
    .regex(cyrillicRegex, { message: 'Введ только латиницы, цифры допускаются' }),
  email: zod.string().min(1, { message: 'Вврд email обязателен' }).email(),
  password: zod.string().min(8, { message: 'Минимальное количество 8 знаков' }),
  terms: zod.boolean().refine((value) => value, 'Вы должны согласиться с условиями пользоания и политикой конфидициальности'),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { name: '', email: '', password: '', terms: false } satisfies Values;

export function SignUpForm(): React.JSX.Element {
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

      const { error } = await authClient.signUp(values);

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
      <Stack spacing={1}>
        <Typography variant="h4">Регистрация</Typography>
        <Typography color="text.secondary" variant="body2">
          У вас уже есть аккаунт?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Вход в ЛК
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormControl error={Boolean(errors.name)}>
                <InputLabel>создайте username</InputLabel>
                <OutlinedInput {...field} label="Введите name" />
                {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
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
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Пароль</InputLabel>
                <OutlinedInput {...field} label="Пароль" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      Согласен с  <Link>политикой конфидициальности и условиями использования</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          {errors.root ? <Alert color="error">{isMessage}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="22" height="22">
              <radialGradient id="a11" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                <stop offset="0" stopColor="#635bff"></stop>
                <stop offset=".3" stopColor="#635bff" stopOpacity="1"></stop>
                <stop offset=".6" stopColor="#635bff" stopOpacity=".6"></stop>
                <stop offset=".8" stopColor="#635bff" stopOpacity=".3"></stop>
                <stop offset="1" stopColor="#635bff" stopOpacity="0"></stop>
              </radialGradient>
              <circle transform-origin="center" fill="none" stroke="url(#a11)" strokeWidth="30" strokeLinecap="round"
                      strokeDasharray="200 1000" strokeDashoffset="0" cx="100" cy="100" r="70">
                <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2.3" values="360;0"
                                  keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform>
              </circle>
              <circle transform-origin="center" fill="none" opacity=".2" stroke="#114B5C" stroke-width="30"
                      strokeLinecap="round" cx="100" cy="100" r="70"></circle>
            </svg> :<Box>
              Зарегестрироваться
            </Box>
            }
          </Button>
        </Stack>
      </form>
      {/*<Alert color="warning">Ввод нового пользователя</Alert>*/}
    </Stack>
  );
}
