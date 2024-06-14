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
import {useSelection} from "@/hooks/use-selection";
import Checkbox from "@mui/material/Checkbox";
import setKindOfObject from "@/lib/common/kindOfObject";
import {TablePaginationActions} from "@/components/tables/tablePaginationActions";
import sensors from "@/lib/common/sensors"
import {CheckSquareOffset} from "@phosphor-icons/react";





export default function ObjectsPaginationAndSelectTable({ rows, onSelectedRowsChange}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  React.useEffect(() => {
    onSelectedRowsChange(selected ? Array.from(selected) : []);
  }, [selected]);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;


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
            <TableCell style={{ width: "20%" }} align="center">
              Количество датчиков</TableCell>
            <TableCell style={{ width: "20%" }} align="center">
              Тип объекта</TableCell>
            <TableCell style={{ width: "20%" }} align="center">
              Организация
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
          ).map((row) => {
            const isSelected = selected?.has(row.id);
            return (
              <TableRow key={row.id} selected={isSelected}>
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
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="center">
                  {row.Sensor.length}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="center">
                  {setKindOfObject(row.objectsType)}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="center">
                  {row.organization.name}
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

