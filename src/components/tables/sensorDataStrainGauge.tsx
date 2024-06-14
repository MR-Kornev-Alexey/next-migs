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
import formatDateTime from "@/lib/common/formatDateTime";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import hexStringToBuffer from "@/lib/calculate/hex-string-to-buffer";
import parseSensorRf251 from "@/lib/parse-sensor/parse-sensor-rf251";


export default function SensorDataStrainGauge({ rows, sensorInfo }) {
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

  const checkAnswerCode  = (code) => {
    if (code.length === 28) {
      let formattedStr = code.replace(/(.{2})/g, '$1 ');
      return formattedStr.trim();
    } else if (code.length === 0) {
      return 'Потеря ответа датчика';
    } else {
      return 'Ошибка ответа датчика';
    }
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Box>
      <Typography variant="h6"> {sensorInfo[0]} {sensorInfo[1]} {sensorInfo[2]}</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "20%" }}>
                Дата
              </TableCell>
              <TableCell >
                Запрос
              </TableCell>
              <TableCell  align="center">
                Ответ
              </TableCell>
              <TableCell  align="center">
                Фактическое отклонение (мкр)
              </TableCell>
              <TableCell  align="center">
                Температура (градус)
              </TableCell>
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
                  <TableCell >
                    {formatDateTime(row.created_at)}
                  </TableCell>
                  <TableCell >
                    {row.request_code}
                  </TableCell>
                  <TableCell style={{ cursor: "pointer" }} align="center">
                    {checkAnswerCode(row.answer_code)}
                  </TableCell>
                  <TableCell  align="center">
                    {parseSensorRf251(row.answer_code).distance}
                  </TableCell>
                  <TableCell  align="center">
                    {parseSensorRf251(row.answer_code).temperature}
                  </TableCell>
                </TableRow>
              );
            })}
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
    </Box>

  );
}

