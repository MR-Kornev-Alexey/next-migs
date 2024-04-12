"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import CustomPaginationActionsTable from "@/components/tables/customPaginationActionsTable";

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Таблицы</Typography>
      </div>
    </Stack>
  );
}
