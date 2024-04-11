import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

export default function CheckOrganisation({ initialData }): React.JSX.Element {
  const organizationEntries = Object.entries(initialData);
  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{textAlign:"center"}}>Первичная организация произведена</Typography>
      <Stack sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '600px' }}>
          <TableHead>
            <TableRow>
              <TableCell>№№</TableCell>
              <TableCell>Наименование</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizationEntries.map(([key, value], index) => (
              <TableRow key={key}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Stack>
  );
}
