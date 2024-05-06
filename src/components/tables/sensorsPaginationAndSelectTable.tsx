import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from "@mui/material/TableHead";
import {UserGear} from "@phosphor-icons/react/dist/ssr/UserGear";
import {useSelection} from "@/hooks/use-selection";
import Checkbox from "@mui/material/Checkbox";
import setKindOfObject from "@/lib/common/kindOfObject";
import {TablePaginationActions} from "@/components/tables/tablePaginationActions";
import Button from "@mui/material/Button";
import {Trash} from "@phosphor-icons/react";

export default function SensorsPaginationAndSelectTable({ rows, sendIDToStore, page, setPage, selectObject, openDialogNewIP, deleteOneSensor}) {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isOpenDialog, setIsOpenDialog] = React.useState(false);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Объект</TableCell>
            <TableCell style={{ width: "10%" }} >ip - адрес</TableCell>
            <TableCell style={{ width: "10%" }} >Статус</TableCell>
            <TableCell style={{ width: "15%" }} align="center">
              Тип датчика</TableCell>
            <TableCell style={{ width:  "12%"}} align="center">
              Марка датчика</TableCell>
            <TableCell style={{ width:  "7%" }} align="center">
              Обзначение</TableCell>
            <TableCell style={{ width:  "7%" }} align="center">
              Сетевой номер </TableCell>
            <TableCell style={{ width:  "7%" }} align="center">
              Подробнее</TableCell>
            <TableCell style={{ width:  "5%"}} align="center">
              Удалить</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
          ).map((row, index) => {
            const isEvenRow = (index + 1) % 2 === 0; // Проверяем, четная ли строка
            return (
              <TableRow key={row.id} sx={{ backgroundColor: isEvenRow ? '#d9d9d9' : 'inherit' }}>
              <TableCell sx={{cursor: "pointer"}}  onClick={() => { selectObject(row.object.id)}}>
                  {row.object.name} | {row.object.address}
                </TableCell>
                <TableCell style={{ cursor: "pointer" }} onClick={()=> openDialogNewIP(row.ip_address,row.id)} >{row.ip_address}</TableCell>
                <TableCell style={{ width: "10%" }} >Активен</TableCell>
                <TableCell style={{ width: "15%" }} align="center">
                  {row.sensor_type}
                </TableCell>
                <TableCell style={{ width: "12%"  }} align="center">
                  {row.model}
                </TableCell>
                <TableCell style={{ width: "7%"  }} align="center">
                  {row.designation}
                </TableCell>
                <TableCell style={{ width: "7%" }} align="center">
                  {row.network_number}
                </TableCell>
                <TableCell style={{ width: "7%" , cursor: "pointer" }} align="center" onClick={() => {sendIDToStore(JSON.stringify(row))}}>
                  Подробнее
                </TableCell>
                <TableCell style={{ width: "5%", cursor: "pointer" }} align="center" onClick={() => {deleteOneSensor(row.id)}}>
                  <Trash size={24}/></TableCell>
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

