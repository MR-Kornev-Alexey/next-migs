'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {UserGear} from '@phosphor-icons/react/dist/ssr/UserGear';


export function ListOfOrganizations({rows}): React.JSX.Element {
  return (
    <>
      <Card>
        <Box sx={{overflowX: 'auto'}}>
          <Table sx={{minWidth: '800px'}}>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>ИНН</TableCell>
                <TableCell>Адрес</TableCell>
                <TableCell>Руководитель</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Подробнее</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.inn}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.directorName}</TableCell>
                    <TableCell>{row.organizationPhone}</TableCell>
                    <TableCell>{row.organizationEmail}</TableCell>
                    <TableCell><UserGear size={24}/></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </>
);
}
