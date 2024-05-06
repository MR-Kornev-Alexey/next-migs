'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import Box from "@mui/material/Box";
import {Budget} from "@/components/dashboard/overview/budget";
import {TotalCustomers} from "@/components/dashboard/overview/total-customers";
import Link from "@mui/material/Link";
import RouterLink from "next/link";
import {paths} from "@/paths";

export function Notifications(): React.JSX.Element {
  // Создаем новый массив без дубликатов по id

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <Divider/>
        <CardContent>
          {/*{arrayNotifications.length === 0? <Box> <Typography variant="body2">Уведомлений нет</Typography></Box> :*/}
          {/*  <Box>*/}
          {/*    {uniqueArrayNotifications.map((item, index) =>*/}
          {/*      <Grid container spacing={2} key={index}>*/}
          {/*        <Grid  xs={12} md={9}>*/}
          {/*          {item.label}*/}
          {/*        </Grid>*/}
          {/*        <Grid  xs={12} md={3}>*/}
          {/*          <Link component={RouterLink} href={item.link} variant="subtitle2">*/}
          {/*            Исправить*/}
          {/*          </Link>*/}
          {/*        </Grid>*/}
          {/*      </Grid>)*/}
          {/*    }*/}
          {/*  </Box>*/}
          {/*}*/}
        </CardContent>
        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          <Button variant="contained">Добавить уведомление</Button>
        </CardActions>
      </Card>
    </form>
  );
}
