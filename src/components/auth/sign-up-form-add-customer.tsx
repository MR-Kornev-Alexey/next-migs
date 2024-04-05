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
import {useUser} from '@/hooks/use-user';
import Box from "@mui/material/Box";
import {customersClient} from "@/lib/customers/customers-client";
import {red} from "@mui/material/colors";

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
  firstName: 'Алексей Юрьевич',
  surName: 'Корнев',
  telegram: '@MrkDigital',
  position: 'Инженер - программист',
  phone: '+79253114131',
} satisfies Values;

export function SignUpFormAddCustomer({setStatusInit}): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const receivedData = await customersClient.initSignAdditionalData(values);
      console.log(receivedData.statusCode)

      if (receivedData.statusCode !== 200) {
        setIsPending(false);
        setIsMessage('Ошибка ввода, повторите снова')
      } else {
        setIsPending(false);
        setStatusInit(false);
      }
    },
    [router]
  );
  return (
    <Stack spacing={3}>
      <Stack spacing={1} >
        <Typography variant="h4" sx={{textAlign: "center"}} >Первичная регистрация дополнительных данных</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="firstName"
            render={({field}) => (
              <FormControl error={Boolean(errors.firstName)}>
                <InputLabel>Введите имя</InputLabel>
                <OutlinedInput {...field} label="Введите имя"/>
                {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="surName"
            render={({field}) => (
              <FormControl error={Boolean(errors.surName)}>
                <InputLabel>Введите фамилию</InputLabel>
                <OutlinedInput {...field} label="Введите фамилию"/>
                {errors.surName ? <FormHelperText>{errors.surName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({field}) => (
              <FormControl error={Boolean(errors.phone)}>
                <InputLabel>Введите телефон</InputLabel>
                <OutlinedInput {...field} label="Введите телефон"/>
                {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="telegram"
            render={({field}) => (
              <FormControl error={Boolean(errors.telegram)}>
                <InputLabel>Введите телеграмм</InputLabel>
                <OutlinedInput {...field} label="Телеграмм"/>
                {errors.telegram ? <FormHelperText>{errors.telegram.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="position"
            render={({field}) => (
              <FormControl error={Boolean(errors.position)}>
                <InputLabel>Введите должность</InputLabel>
                <OutlinedInput {...field} label="Введите должность"/>
                {errors.position ? <FormHelperText>{errors.position.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Box  display="flex" justifyContent="center" alignItems="center">
            <Button disabled={isPending} type="submit" variant="contained" sx={{marginTop: 2, width: 260}} >
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
                Ввести данные
              </Box>
              }
            </Button>

          </Box>
          <Typography variant="body1" color="error">{isMessage}</Typography>
        </Stack>
      </form>
    </Stack>
  );
}
