import React from 'react';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import { X } from '@phosphor-icons/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import formatDateTime from "@/lib/common/formatDateTime";

interface ModalInfoAboutSensorProps {
  isOpen: boolean;
  onClose: () => void;
  dataError?: any;
  dataOfSensor?: any;
}

const ModalInfoAboutSensor: React.FC<ModalInfoAboutSensorProps> = ({ isOpen, onClose, dataError}) => {
  return (
    <Box>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxWidth: '95%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 2,
          maxHeight: '360px', // Ограничение максимальной высоты модального окна
          overflowY: 'auto'  // Вертикальный скролл
        }}>
          <Stack id="modal-modal-title" sx={{ marginBottom: 3, position: 'relative' }}>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative">
              <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center' }}>Журнал ошибок</Typography>
              <Box position="absolute" top={0} right={0}>
                <X size={32} onClick={onClose} style={{ cursor: 'pointer' }} />
              </Box>
            </Box>
          </Stack>
          {dataError.length > 0 ? <TableContainer component={Paper}>
            <Table sx={{minWidth: 400}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Ошибки</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataError?.map( (row, index) =>
                  <TableRow key={index}>
                    <TableCell>{formatDateTime(row.created_at)}</TableCell>
                    <TableCell>{row.error_information}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer> : <Box>
            <Typography variant="body2">Данные не найдены</Typography>
          </Box>
          }
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalInfoAboutSensor;
