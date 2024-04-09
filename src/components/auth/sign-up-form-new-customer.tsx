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
import {useEffect} from "react";
import {fetchAllOrganizations} from "@/components/dashboard/customer/fetchAllOrganizations";
import {customersClient} from "@/lib/customers/customers-client";

const schema = zod.object({
    name: zod.string()
      .min(1, {message: 'Ввод username обязателен'}),
    email: zod.string().min(1, {message: 'Ввод email обязателен'}).email(),
    password: zod.string().min(8, {message: 'Минимальное количество 8 знаков'})
  }
);

type Values = zod.infer<typeof schema>;
const defaultValues = {name: '', email: '', password: '' } satisfies Values;

export function SignUpFormNewCustomer(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [isAllOrganizations, setAllOrganizations] = React.useState<string>([]);
  const [formData, setFormData] = React.useState({
    organization_id: '', // Используем выбранную организацию
    registration_status: "NOT_COMPLETED",
    role: 'customer'
  });

  const handleSelectOrganisation = (organisationId: string) => {
    setFormData(prevData => ({
      ...prevData,
      organization_id: organisationId,
    }));
  };

  useEffect(() => {
    // Здесь вы можете выполнять запрос к серверу для получения данных
    // Например, с использованием fetch или axios
    fetchAllOrganizations().then((data) => {
      console.log(data)
      setAllOrganizations(data);
      // setPageCounter(Math.floor((data?.data.length)/rowsPerPage))
      // setLoading(false);
    }).catch((error) => {
      console.error('Ошибка при загрузке данных:', error);
      // setLoading(false);
    });
  }, []);

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const updatedValues = {
        ...values,
        ...formData
      };
      const result = await customersClient.createNewCustomer(updatedValues);
      console.log(result);

      setIsPending(false);
    },
    [ router, setError, formData]
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
          <OrganisationList organisations={isAllOrganizations} onSelectOrganisation={handleSelectOrganisation} />
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity={0.25}></path>
                <path fill="currentColor" d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform>
                </path>
              </svg>
            ) : (
              <Box>
                Зарегестрировать
              </Box>
            )}
          </Button>
          {isMessage}
        </Stack>
      </form>
    </Stack>
  );
}
