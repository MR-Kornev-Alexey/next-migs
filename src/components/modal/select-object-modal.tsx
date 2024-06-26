import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
} from '@mui/material';
import SelectObjectRequest from '@/components/select/select-object-request';
import SelectTimeRequest from '@/components/select/select-time-request';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

interface SelectObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isFlagForOneObject?: string;  // Add missing type
  sendChangeNullsForObject: (selectedObject: string) => void;
  defaultValueTimeRequest?: any;  // Update with appropriate type
  setDefaultValueTimeRequest?: (value: any) => void;  // Update with appropriate type
}

const SelectObjectModal: React.FC<SelectObjectModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               title,
                                                               isFlagForOneObject,
                                                               sendChangeNullsForObject,
                                                               defaultValueTimeRequest,
                                                               setDefaultValueTimeRequest,
                                                             }) => {
  const [selectedObject, setSelectedObject] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedObject('');
    }
  }, [isOpen]);

  const handleObjectChange = (object: string) => {
    setSelectedObject(object);
  };

  const handleSendChange = () => {
    sendChangeNullsForObject(selectedObject);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 1000,
        },
      }}
    >
      <Fade in={isOpen}>
        <Box sx={modalStyle}>
          <Typography variant="body2">{title}</Typography>
          <SelectObjectRequest sendSelectedObject={handleObjectChange} />
          {isFlagForOneObject === 'period' && selectedObject && (
            <Box sx={{ my: 2 }}>
              <SelectTimeRequest
                setNumberToParent={setDefaultValueTimeRequest}
                defaultValueTimeRequest={defaultValueTimeRequest}
              />
            </Box>
          )}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={onClose}>Отмена</Button>
            <Button onClick={handleSendChange} disabled={!selectedObject}>
              Изменить
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SelectObjectModal;
