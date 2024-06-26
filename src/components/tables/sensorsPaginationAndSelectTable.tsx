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
import {TablePaginationActions} from "@/components/tables/tablePaginationActions";
import {Play, Trash} from "@phosphor-icons/react";
import {SvgSpinnersBarsScale} from "@/lib/animated-icon/chart-icon";
import {LineMdPlayFilledToPauseTransition} from "@/lib/animated-icon/pause-icon";
import TextField from "@mui/material/TextField";

export default function SensorsPaginationAndSelectTable({ rows, sendIDToStore, page, setPage, selectObject, handleChangeIpAddress, deleteOneSensor, handleChangeStatus, handleChangeNetAddress, updateSensorDesignation}) {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editableCell, setEditableCell] = React.useState({ rowId: null, value: '' });
  const handleCellClick = (rowId, currentValue) => {
    setEditableCell({ rowId, value: currentValue });

  };

  const handleInputChange = (event) => {
    setEditableCell({ ...editableCell, value: event.target.value });
  };

  const handleInputBlur = (rowId) => {
    updateSensorDesignation(rowId, editableCell.value);
    setEditableCell({ rowId: null, value: '' });
  };

  const handleInputKeyPress = (event, rowId) => {
    if (event.key === 'Enter') {
      handleInputBlur(rowId);
    }
  };
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
          <TableRow >
            <TableCell>Объект</TableCell>
            <TableCell style={{ width: "10%" }} >ip - адрес</TableCell>
            <TableCell style={{ width: "10%" }} >Активность</TableCell>
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
              <TableRow key={row.id} sx={{backgroundColor: isEvenRow ? '#d9d9d9' : 'inherit' }}>
              <TableCell sx={{cursor: "pointer"}}  onClick={() => { selectObject(row.object.id)}}>
                  {row.object.name} | {row.object.address}
                </TableCell>
                <TableCell style={{ cursor: "pointer" }} onClick={()=> handleChangeIpAddress(row.ip_address,row.id)} >{row.ip_address}</TableCell>
                <TableCell style={{ width: "10%", cursor: "pointer", textAlign: "center" }} onClick={() => handleChangeStatus(row.id)}>
                  { row.run?<SvgSpinnersBarsScale />:<LineMdPlayFilledToPauseTransition />
                  }
                </TableCell>
                <TableCell style={{width: "15%"}} align="center">
                  {row.sensor_type}
                </TableCell>
                <TableCell style={{width: "12%"}} align="center">
                  {row.model}
                </TableCell>
                <TableCell
                  style={{ width: '7%', cursor: 'pointer' }}
                  align="center"
                  onClick={() => handleCellClick(row.id, row.designation)}
                >
                  {editableCell.rowId === row.id ? (
                    <TextField
                      value={editableCell.value}
                      onChange={handleInputChange}
                      onBlur={() => handleInputBlur(row.id)}
                      onKeyPress={(event) => handleInputKeyPress(event, row.id)}
                      autoFocus
                    />
                  ) : (
                    row.designation
                  )}
                </TableCell>
                <TableCell style={{width: "7%", cursor: "pointer"}} align="center" onClick={() => {handleChangeNetAddress(row.network_number,row.id)}}>
                  {row.network_number}
                </TableCell>
                <TableCell style={{width: "7%", cursor: "pointer"}} align="center" onClick={() => {
                  sendIDToStore(row.id)
                }}>
                  Подробнее
                </TableCell>
                <TableCell style={{width: "5%", cursor: "pointer"}} align="center" onClick={() => {
                  deleteOneSensor(row.id)
                }}>
                  <Trash size={24}/></TableCell>
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{height: 33 * emptyRows}}>
              <TableCell colSpan={6}/>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
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
