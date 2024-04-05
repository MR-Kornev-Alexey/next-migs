// noinspection TypeScriptValidateTypes

'use client';
import * as React from 'react';
import {useRouter} from 'next/navigation';
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
import {authClient} from '@/lib/auth/client';
import {useUser} from '@/hooks/use-user';
import Box from "@mui/material/Box";
import OrganisationList from "@/components/select/organisation-list";


const schema = zod.object({
    name: zod.string()
      .min(1, {message: 'Ввод username обязателен'}),
    email: zod.string().min(1, {message: 'Ввод email обязателен'}).email(),
    password: zod.string().min(8, {message: 'Минимальное количество 8 знаков'}),
    organizationInn: zod.string()
      .min(1, {message: 'Ввод id предприятия обязателен'})
  }
);

type Values = zod.infer<typeof schema>;
const defaultValues = {name: '', email: '', password: '', organizationInn: '7716852062'} satisfies Values;

export function SignUpFormNewCustomer({organisations}): React.JSX.Element {
  const router = useRouter();

  const {checkSession} = useUser();

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
      const {error} = await authClient.signUp(values);

      if (error) {
        setError('root', {type: 'server', message: error});
        setIsPending(false);
        setIsMessage('Ошибка ввода, повторите снова')
        return;
      }

      // Refresh the auth store
      await checkSession?.();
      router.refresh();
    },
    [checkSession, router, setError]
  );
  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="name"
            render={({field}) => (
              <FormControl error={Boolean(errors.name)}>
                <InputLabel>Введите username</InputLabel>
                <OutlinedInput {...field} label="Введите username"/>
                {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({field}) => {
              return (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email</InputLabel>
                  <OutlinedInput {...field} label="Email" type="email"/>
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="password"
            render={({field}) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Пароль</InputLabel>
                <OutlinedInput {...field} label="Пароль" type="password"/>
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="organizationInn"
            render={({field}) => (
              <FormControl error={Boolean(errors.organizationInn)}>
                <InputLabel>Введите ИНН организации</InputLabel>
                <OutlinedInput {...field} label="ИНН"/>
                {errors.organizationInn ? <FormHelperText>{errors.organizationInn.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <OrganisationList organisations={organisations}/>
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <rect width={2.8} height={12} x={1} y={6} fill="currentColor">
                <animate id="svgSpinnersBarsScale0" attributeName="y" begin="0;svgSpinnersBarsScale1.end-0.1s"
                         calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                         values="6;1;6"></animate>
                <animate attributeName="height" begin="0;svgSpinnersBarsScale1.end-0.1s" calcMode="spline" dur="0.6s"
                         keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate>
              </rect>
              <rect width={2.8} height={12} x={5.8} y={6} fill="currentColor">
                <animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.1s" calcMode="spline" dur="0.6s"
                         keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6"></animate>
                <animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.1s" calcMode="spline" dur="0.6s"
                         keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate>
              </rect>
              <rect width={2.8} height={12} x={10.6} y={6} fill="currentColor">
                <animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.2s" calcMode="spline" dur="0.6s"
                         keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6"></animate>
                <animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.2s" calcMode="spline" dur="0.6s"
                         keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate>
              </rect>
              <rect width={2.8} height={12} x={15.4} y={6} fill="currentColor">
                <animate attributeName="y" begin="svgSpinnersBarsScale0.begin+0.3s" calcMode="spline" dur="0.6s"
                         keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="6;1;6"></animate>
                <animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.3s" calcMode="spline" dur="0.6s"
                         keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate>
              </rect>
              <rect width={2.8} height={12} x={20.2} y={6} fill="currentColor">
                <animate id="svgSpinnersBarsScale1" attributeName="y" begin="svgSpinnersBarsScale0.begin+0.4s"
                         calcMode="spline" dur="0.6s" keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                         values="6;1;6"></animate>
                <animate attributeName="height" begin="svgSpinnersBarsScale0.begin+0.4s" calcMode="spline" dur="0.6s"
                         keySplines=".36,.61,.3,.98;.36,.61,.3,.98" values="12;22;12"></animate>
              </rect>
            </svg> : <Box>
              Зарегестрироваться
            </Box>
            }
          </Button>
          {isMessage}
        </Stack>
      </form>
      {/*<Alert color="warning">Ввод нового пользователя</Alert>*/}
    </Stack>
  );
}
