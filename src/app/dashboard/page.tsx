
'use client';
import * as React from 'react';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {Notifications} from "@/components/dashboard/settings/notifications";

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Уведомления</Typography>
      </div>
      <Notifications />
    </Stack>
  );
}
