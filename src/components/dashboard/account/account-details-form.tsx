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
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';

const defaultValues = { firstName: '',  secondName: '',  phone: '', telegram: '', position: '', organisation: '' } satisfies Values;
import { z } from 'zod';
import Typography from "@mui/material/Typography";

const Cyrillic = z.string().regex(/^[А-Яа-яЁё]+$/);

const schema = z.object({
  firstName: Cyrillic,
  lastName: Cyrillic,
  // Добавьте другие поля, если необходимо
});
const onSubmit = (data) => {
  console.log(data); // Вы можете отправить данные после успешной валидации
};

// firstName: 'Elena',
//   surName: 'Petrova',
//   telegram: '@Petrova',
//   position: 'Manager',
//   phone: '+79809090101',

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
            {dataUser?.additionalUserInfo[0] ? (
              <>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{dataUser.additionalUserInfo[0].firstName}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{dataUser.additionalUserInfo[0].surName}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{dataUser.additionalUserInfo[0].telegram}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{dataUser.additionalUserInfo[0].position}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="body1">{dataUser.additionalUserInfo[0].phone}</Typography>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1">Дополнительная информация недоступна</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={changeData} variant="contained">Изменить</Button>
        </CardActions>
      </Card>
    </form>
  );
}
