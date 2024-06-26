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
import Checkbox from "@mui/material/Checkbox";
import {useSelection} from "@/hooks/use-selection";
import {TablePaginationActions} from "@/components/tables/tablePaginationActions";
import {SvgSpinnersBarsScale} from "@/lib/animated-icon/chart-icon";
import {LineMdPlayFilledToPauseTransition} from "@/lib/animated-icon/pause-icon";
import {ClipboardText, PlayPause, Siren} from "@phosphor-icons/react";
import {sensorsClient} from "@/lib/sensors/sensors-client";

export default function AllSensorsPaginationAndSelectTable({
                                                             rows,
                                                             onFilterChange,
                                                             onSelectionChange,
                                                             changeFromChartsWarningSensor,
                                                             setNullOneSensor,
                                                             setMinOneSensor,
                                                             setMaxOneSensor,
                                                             openTableAdditionalInfo
                                                           }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rowIds = React.useMemo(() => rows.map((customer) => customer.id), [rows]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const {selectAll, deselectAll, selectOne, deselectOne, selected} = useSelection(rowIds);
  const [checkZet, setCheckZet] = React.useState(false);

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = rows.filter(row => selected.has(row.id));
      onSelectionChange(selectedRows);
    }
  }, [selected, rows]);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectSensorType = type => () => {
    const filtered = rows.filter(sensor => sensor.sensor_type === type);
    onFilterChange(filtered);
  };

  const handleSelectSensorModel = model => () => {
    const filtered = rows.filter(sensor => sensor.model === model);
    onFilterChange(filtered);
  };

  const setLastValueWithNull = (baseValue, zeroValue) => {
    return parseFloat((baseValue - zeroValue).toFixed(2)) || 0
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 600}} aria-label="custom pagination table">
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
            <TableCell>Тип датчика</TableCell>
            <TableCell>Марка датчика</TableCell>
            <TableCell>Обозначение</TableCell>
            <TableCell>Активность</TableCell>
            <TableCell>Периодичность</TableCell>
            <TableCell>Оповещение</TableCell>
            <TableCell align="center">Последнее значение (базовое)</TableCell>
            <TableCell align="center">Минимум (базовое)</TableCell>
            <TableCell align="center">Максимум (базовое)</TableCell>
            <TableCell align="center">Обнуление (базовое)</TableCell>
            <TableCell align="center">Контроль выбросов</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
          ).map((row, index) => {
            const isSelected = selected?.has(row.id);
            const isEvenRow = (index + 1) % 2 === 0; // Проверяем, четная ли строка
            return (
              <TableRow key={row.id} selected={isSelected} sx={{backgroundColor: isEvenRow ? '#d9d9d9' : 'inherit'}}>
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
                <TableCell
                  component="th"
                  scope="row"
                  style={{cursor: "pointer"}}
                  onClick={handleSelectSensorType(row.sensor_type)}
                >
                  {row.sensor_type}
                </TableCell>
                <TableCell
                  style={{cursor: "pointer"}}
                  onClick={handleSelectSensorModel(row.model)}
                >
                  {row.model}
                </TableCell>
                <TableCell>
                  {row.designation}
                </TableCell>
                <TableCell align="center">
                  {row.run ? <SvgSpinnersBarsScale/> : <LineMdPlayFilledToPauseTransition/>}
                </TableCell>
                <TableCell>{row.requestSensorInfo[0].periodicity}</TableCell>
                <TableCell style={{cursor: "pointer"}} align="center"
                           onClick={() => changeFromChartsWarningSensor(row.id)}>{row.requestSensorInfo[0].warning ?
                  <Siren size={24} color="#a00323"/> : <PlayPause size={24}/>}</TableCell>
                <TableCell
                  align="center">{setLastValueWithNull(row.requestSensorInfo[0].last_base_value, row.requestSensorInfo[0].base_zero)}</TableCell>
                <TableCell style={{cursor: "pointer"}}
                           onClick={() => setMinOneSensor(row.id, row.requestSensorInfo[0].min_base)}
                           align="center">{row.requestSensorInfo[0].min_base === null ? 0 : row.requestSensorInfo[0].min_base}</TableCell>
                <TableCell style={{cursor: "pointer"}}
                           onClick={() => setMaxOneSensor(row.id, row.requestSensorInfo[0].max_base)}
                           align="center">{row.requestSensorInfo[0].max_base === null ? 0 : row.requestSensorInfo[0].max_base}</TableCell>
                <TableCell align="center" style={{cursor: "pointer"}}
                           onClick={() => setNullOneSensor(row.id, row.requestSensorInfo[0].base_zero, row.requestSensorInfo[0].last_base_value)}>{row.requestSensorInfo[0].base_zero === null ? 0 : row.requestSensorInfo[0].base_zero}</TableCell>
                <TableCell align="center" style={{cursor: "pointer"}}><ClipboardText size={24} onClick={()=> openTableAdditionalInfo(row.object_id, row.model)} /></TableCell>
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{height: 53 * emptyRows}}>
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
