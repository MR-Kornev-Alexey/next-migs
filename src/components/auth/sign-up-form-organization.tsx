'use client';

import * as React from 'react';
import RouterLink from 'next/link';
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
import {organizationClient} from "@/lib/profile/organization-client";
import {z as zod} from 'zod';

import {paths} from '@/paths';
import {authClient} from '@/lib/auth/client';
import {useUser} from '@/hooks/use-user';
import Box from "@mui/material/Box";

const numberRegex = /^(?:\d{10}|\d{12})$/;
const phoneRegex = /^\+7\d{10}$/;


const schema = zod.object({
    name: zod.string().min(1, {message: 'Ввод имени обязателен'}),
    inn: zod.string()
      .min(10, {message: 'Ввод должен содержать не менее 10 цифр'})
      .regex(numberRegex, {message: 'Ввод должен содержать ровно 10 или 12 цифр'}),
    address: zod.string().min(1, {message: 'Ввод адреса организации обязателен'}),
    directorName: zod.string().min(1, {message: 'Ввод руководителя организации обязателен'}),
    organizationPhone: zod.string()
      .min(12, {message: 'Ввод должен содержать  12 символов'})
      .regex(phoneRegex, {message: 'Ввод должен содержать  +7 и 10 цифр'}),
    organizationEmail: zod.string().min(1, {message: 'Ввод email обязателен'}).email()
  }
);

type Values = zod.infer<typeof schema>;
const defaultValues = {
  name: 'ООО «НИИ МИГС»',
  inn: '7716852062',
  address: '129344 г. Москва, Енисейская ул., д.1, стр. 1, этаж 2, пом.255',
  directorName: 'Курыпов Алексей Александрович',
  organizationPhone: '+74954192807',
  organizationEmail: 'info@nii-migs.ru'
} satisfies Values;

export function SignUpFormOrganization(): React.JSX.Element {
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
      // setIsPending(true);

      const {error, receivedData} = await organizationClient.initSignOrganization(values);
      console.log(receivedData)

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
      <Stack spacing={1}>
        <Typography variant="h4">Первичная регистрация основной организации</Typography>
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
            name="inn"
            render={({field}) => (
              <FormControl error={Boolean(errors.inn)}>
                <InputLabel>Введите ИНН</InputLabel>
                <OutlinedInput {...field} label="Ввод ИНН"/>
                {errors.inn ? <FormHelperText>{errors.inn.message}</FormHelperText> : null}
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
            name="directorName"
            render={({field}) => (
              <FormControl error={Boolean(errors.directorName)}>
                <InputLabel>Имя руководителя</InputLabel>
                <OutlinedInput {...field} label="Имя руководителя"/>
                {errors.directorName ? <FormHelperText>{errors.directorName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="organizationPhone"
            render={({field}) => (
              <FormControl error={Boolean(errors.organizationPhone)}>
                <InputLabel>Телефон организации</InputLabel>
                <OutlinedInput {...field} label="Телефон организации"/>
                {errors.organizationPhone ? <FormHelperText>{errors.organizationPhone.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="organizationEmail"
            render={({field}) => (
              <FormControl error={Boolean(errors.organizationEmail)}>
                <InputLabel>Email организации</InputLabel>
                <OutlinedInput {...field} label="Email организации" type="email"/>
                {errors.organizationEmail ? <FormHelperText>{errors.organizationEmail.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained" sx={{marginTop: 2}}>
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
        </Stack>
      </form>
      {/*<Alert color="warning">Ввод нового пользователя</Alert>*/}
    </Stack>
  );
}
