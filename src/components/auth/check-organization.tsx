import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import Avatar from "@mui/material/Avatar";
import {UserGear} from "@phosphor-icons/react/dist/ssr/UserGear";



export default function CheckOrganisation({initialData}): React.JSX.Element {
  const organizationEntries = Object.entries(initialData);
  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{textAlign:"center"}}>Первичная организация произведена</Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '600px' }}>
          <TableHead>
            <TableRow>
              <TableCell>№№</TableCell>
              <TableCell>Наименование</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizationEntries.map(([key, value], index) => (
              <div key={key}>
                <TableCell>{index+1}</TableCell>
                <TableCell>
                  {value as React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | Iterable<React.ReactNode> | React.ReactPortal | boolean | undefined | null}
                </TableCell>
              </div>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  );
}
