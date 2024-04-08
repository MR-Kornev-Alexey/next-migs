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

const defaultValues = { firstName: '',  secondName: '', email: '', phone: '', telegram: '', position: '', organisation: '', city: '' } satisfies Values;
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

export function AccountDetailsForm(): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        console.log(event);
      }}
    >
      <Card>
        <CardHeader subheader="Информацию можно изменить" title="Мой профиль" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Имя</InputLabel>
                <OutlinedInput defaultValue="" label="Имя" name="firstName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Фамилия</InputLabel>
                <OutlinedInput defaultValue="" label="Фамилия" name="lastName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email адрес</InputLabel>
                <OutlinedInput defaultValue="" label="Email адрес" name="email" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Номер телефона</InputLabel>
                <OutlinedInput label="Номер телефона" name="phone" type="tel" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Telegram</InputLabel>
                <OutlinedInput label="Telegram" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Должность</InputLabel>
                <OutlinedInput label="Telegram" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Организация</InputLabel>
                <OutlinedInput label="Telegram" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Город</InputLabel>
                <OutlinedInput label="City" />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Сохранить</Button>
        </CardActions>
      </Card>
    </form>
  );
}
