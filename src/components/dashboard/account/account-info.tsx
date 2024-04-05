import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import setRole from "@/lib/common/Role";


const user = {
  name: 'Alexey Petrov',
  avatar: '/assets/migs/user_avatar.png',
  jobTitle: 'Администратор',
  city: 'Москва'
} as const;

export function AccountInfo({ dataUser }): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{dataUser?.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {dataUser?.email}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {setRole(dataUser?.role)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
