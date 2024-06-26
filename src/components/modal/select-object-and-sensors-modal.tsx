import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SelectObjectRequest from "@/components/select/select-object-request";
import {useEffect, useState} from "react";
import SelectTimeRequest from "@/components/select/select-time-request";
import SelectTypeSensorsRequest from "@/components/select/select-type-sensors-request";
import NumberInputIntroduction from "@/components/input/custom-number-input";

const style = {
  position: 'absolute' as 'absolute',
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
}

const SelectObjectAndTypeOfSensorsModal: React.FC<SelectObjectModalProps> = ({
                                                                               isOpen,
                                                                               onClose,
                                                                               sendChangeDataForModelOnObject
                                                                             }) => {
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [limitValue, setLimitValue] = React.useState<number>(0);
  const [emissionsQuantity, setEmissionsQuantity] = React.useState<number>(1);
  const [errorsQuantity, setErrorsQuantity] = React.useState<number>(1);


  useEffect(() => {
    if (isOpen) {
      setSelectedObject('');
      setSelectedType('');
    }
  }, [isOpen]);


  const sendAllDataForSensors=()=> {
    const sentData = {
      object_id: selectedObject,
      model: selectedType,
      limitValue:limitValue,
      emissionsQuantity: emissionsQuantity,
      errorsQuantity: errorsQuantity
    }
    sendChangeDataForModelOnObject(sentData)
  }
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        slots={{backdrop: Backdrop}}
        slotProps={{
          backdrop: {
            timeout: 1000,
          },
        }}
      >
        <Fade in={isOpen}>
          <Box sx={style}>
            <Typography variant="body2">Выберите объект и тип датчика</Typography>
            <SelectObjectRequest sendSelectedObject={setSelectedObject}/>
            {selectedObject.length !== 0 &&
              <SelectTypeSensorsRequest selectedObject={selectedObject} sendSelectedType={setSelectedType}/>}
            {selectedType.length !== 0 && <Box>
              <Typography sx={{marginY: 1}} variant="body2">Выберите порог выброса (+/-)</Typography>
              <NumberInputIntroduction value={limitValue} onChange={setLimitValue}/>
              <Typography sx={{marginY: 1}} variant="body2">Выберите количество выбросов подряд</Typography>
              <NumberInputIntroduction value={emissionsQuantity} onChange={setEmissionsQuantity}/>
              <Typography sx={{marginY: 1}} variant="body2">Выберите количество ошибок подряд</Typography>
              <NumberInputIntroduction value={errorsQuantity} onChange={setErrorsQuantity}/>
            </Box>
            }
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button onClick={onClose}>Отмена</Button>
              <Button onClick={() => sendAllDataForSensors()}
                      disabled={selectedObject.length === 0 || selectedType.length === 0}>Изменить</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default SelectObjectAndTypeOfSensorsModal;
