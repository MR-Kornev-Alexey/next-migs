'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';


import { useSelection } from '@/hooks/use-selection';
import setRole from "@/lib/common/role";
import {UserGear} from "@phosphor-icons/react/dist/ssr/UserGear";
import {ListMagnifyingGlass} from "@phosphor-icons/react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

function noop(): void {
  // do nothing
}

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address:  string;
  phone: string;
}

interface CustomersTableProps {
  rows?: any;
  rowsPerPage?: number;
}

export function OrganizationsTable({
  rows = [],
  openModal
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Название</TableCell>
              <TableCell>ИНН</TableCell>
              <TableCell>Адрес</TableCell>
              <TableCell>Руководитель</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Емейл</TableCell>
              <TableCell>Подробнее</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.inn}</TableCell>
                  <TableCell>
                    {row.address}
                  </TableCell>
                  <TableCell>{row.directorName}</TableCell>
                  <TableCell>{row.organizationPhone}</TableCell>
                  <TableCell>{row.organizationEmail}</TableCell>
                  <TableCell><ListMagnifyingGlass size={24} /> </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{justifyContent: 'flex-end'}}>
        <Button variant="contained" onClick={openModal}>Добавить организацию</Button>
      </CardActions>
    </Card>
  );
}
