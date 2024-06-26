import React from 'react';
import {Modal} from '@mui/material';
import Box from "@mui/material/Box";
import {X} from "@phosphor-icons/react";
import Stack from "@mui/material/Stack";
import {SignUpFormAddLog} from "@/components/auth/sign-up-form-add-log";

const ModalNewOperationLogSensor: React.FC = ({
                                                isOpen,
                                                onClose,
                                                sensorMain,
                                                dataOfSensor,
                                                alertModalColor,
                                                modalMessage,
                                                successOfDownloadLogData
                                              }) => {
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
          p: 4
        }}>

          <Stack id="modal-modal-title" sx={{marginBottom: 3}}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <X size={32} onClick={onClose} style={{cursor: "pointer"}}/>
            </Box>
          </Stack>
          <SignUpFormAddLog alertModalColor={alertModalColor}
                            modalMessage={modalMessage} dataOfSensor={dataOfSensor} sensorMain={sensorMain}
                            successOfDownload={successOfDownloadLogData}/>
        </Box>
      </Modal>
    </Box>
  );
}
export default ModalNewOperationLogSensor;
