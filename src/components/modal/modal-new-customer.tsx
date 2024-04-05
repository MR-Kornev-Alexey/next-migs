import React, {useState} from 'react';
import {Button, Modal, Typography} from '@mui/material';
import Box from "@mui/material/Box";
import {SignUpFormNewCustomer} from "@/components/auth/sign-up-form-new-customer";

const ModalNewCustomer: React.FC = ({ isOpen, onClose, organisations }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          <Typography id="modal-modal-title" variant="h5" component="h5" sx={{marginBottom:3}}>
            Добавление пользователя
          </Typography>
          <SignUpFormNewCustomer organisations={organisations}/>
          <Button onClick={onClose}>Закрыть</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalNewCustomer;
