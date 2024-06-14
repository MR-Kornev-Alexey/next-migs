import React from 'react';
import {Modal} from '@mui/material';
import Box from "@mui/material/Box";
import {X} from "@phosphor-icons/react";
import Stack from "@mui/material/Stack";
import {SignUpFormAddDataSensor} from "@/components/auth/sign-up-form-add-data-sensor";
import {SignUpFormRequestDataSensor} from "@/components/auth/sign-up-form-request-data-sensor";

const ModalNewRequestDataSensor: React.FC = ({ isOpenRequest, onClose, dataOfSensor, successOfDownloadAddData}) => {
  return (
    <Box>
      <Modal
        open={isOpenRequest}
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
          p: 4
        }}>
          <Stack id="modal-modal-title"  sx={{marginBottom:3}}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <X size={32} onClick={onClose} style={{ cursor: "pointer" }} />
            </Box>
          </Stack>
          <SignUpFormRequestDataSensor  closeModal={onClose} dataOfSensor={dataOfSensor} successOfDownload={successOfDownloadAddData}/>
        </Box>
      </Modal>
    </Box>
  );
}
export default ModalNewRequestDataSensor;
