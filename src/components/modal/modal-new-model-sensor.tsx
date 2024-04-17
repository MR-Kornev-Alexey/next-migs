import React, {useState} from 'react';
import {Button, Modal, Typography} from '@mui/material';
import Box from "@mui/material/Box";
import {SignUpFormNewCustomer} from "@/components/auth/sign-up-form-new-customer";
import {SignUpFormOrganization} from "@/components/auth/sign-up-form-organization";
import {X} from "@phosphor-icons/react";
import Stack from "@mui/material/Stack";
import {SignUpFormNewTypeSensor} from "@/components/auth/sign-up-form-new-type-sensor";

const ModalNewModelSensor: React.FC = ({ isOpen, onClose, isSensorKey }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isFirst, setIsFirst] = useState(false);

  const onRegistrationSuccess=(result)=> {
    if (result)  {
      alert(result.data)
    }
  }

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

          <Stack id="modal-modal-title"  sx={{marginBottom:3}}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <X size={32} onClick={onClose} style={{ cursor: "pointer" }} />
            </Box>
          </Stack>
          <SignUpFormNewTypeSensor  closeModal={onClose} isSensorKey={isSensorKey} onRegistrationSuccess={onRegistrationSuccess} isDisabled/>
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalNewModelSensor;
