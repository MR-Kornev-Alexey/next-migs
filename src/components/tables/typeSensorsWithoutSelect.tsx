import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from "@mui/material/TableHead";
import {UserGear} from "@phosphor-icons/react/dist/ssr/UserGear";
import {TablePaginationActions} from "@/components/tables/tablePaginationActions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {PlusSquare, Trash} from "@phosphor-icons/react";


export default function TypeSensorsWithoutSelect({ rows, openModalNewModel }) {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage); // Используйте setPage из пропсов для обновления состояния в родительском компоненте
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "20%" }}>
              Тип датчика
            </TableCell>
            <TableCell >
              Модели
            </TableCell>
            <TableCell style={{ width: "10%" }} align="center">
              Добавить модель
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
          ).map((row) => {
            return (
              <TableRow key={row.id}>
                <TableCell style={{ width: "20%" }}>
                  {row.sensor_type}
                </TableCell>
                <TableCell sx={{display: "flex", justifyContent: "space-around"}}>
                  {row.models.map( (item, index) =>
                    <Box key={index}>{item}</Box>
                  )}
                </TableCell>
                <TableCell style={{ width: "10%", cursor: "pointer" }} align="center" onClick={() => openModalNewModel({sensorKey: row.sensor_key, sensorType: row.sensor_type})}>
                  <PlusSquare size={24} />
                </TableCell>
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

