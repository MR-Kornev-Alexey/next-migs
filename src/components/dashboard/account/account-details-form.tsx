'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';

const defaultValues = { firstName: '',  secondName: '',  phone: '', telegram: '', position: '', organisation: '' } satisfies Values;
import { z } from 'zod';

const Cyrillic = z.string().regex(/^[А-Яа-яЁё]+$/);

const schema = z.object({
  firstName: Cyrillic,
  lastName: Cyrillic,
  // Добавьте другие поля, если необходимо
});
const onSubmit = (data) => {
  console.log(data); // Вы можете отправить данные после успешной валидации
};

export function AccountDetailsForm({dataUser , changeData}): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        console.log(event);
      }}
    >
      <Card>
        <CardHeader title="Мой профиль" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel>Имя</InputLabel>
                <OutlinedInput defaultValue={dataUser?.additionalUserInfo[0].firstName} label="Имя" name="firstName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel>Фамилия</InputLabel>
                <OutlinedInput defaultValue={dataUser?.additionalUserInfo[0].surName}  label="Фамилия" name="lastName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel>Номер телефона</InputLabel>
                <OutlinedInput defaultValue={dataUser?.additionalUserInfo[0].phone}  label="Номер телефона" name="phone" type="tel" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel>Telegram</InputLabel>
                <OutlinedInput defaultValue={dataUser?.additionalUserInfo[0].telegram}  label="Telegram" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel>Должность</InputLabel>
                <OutlinedInput defaultValue={dataUser?.additionalUserInfo[0].position}  label="Должность" />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={changeData} variant="contained">Изменить</Button>
        </CardActions>
      </Card>
    </form>
  );
}
