import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z as zod} from 'zod';
import {Modal, Box, Typography, TextField, Button, Alert} from '@mui/material';
import convertStringToNumber from "@/lib/calculate/convert-string-to-number";

// Регулярное выражение для разрешения цифр с одной точкой или запятой
const numericSingleDotOrCommaRegex = /^-?[0-9]+([,.][0-9]{1,2})?$/;

const schema = zod.object({
  numeric_value: zod.string()
    .regex(numericSingleDotOrCommaRegex, {
      message: 'Ввод может содержать только цифры и одну точку или запятую для десятичных цифр, с не более чем двумя цифрами после них'
    })
});


const ModalInputNumber = ({
                            isOpen,
                            onClose,
                            isNumberValue,
                            flagValue,
                            filteredSensors,
                            isIdChangeSensor,
                            sendValueToParent
                          }) => {
  const [isMessage, setIsMessage] = useState<string>('');
  const [alertColor, setAlertColor] = useState<string>('error');
  const {control, handleSubmit, setValue, formState: {errors}} = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      numeric_value: isNumberValue
    }
  });

  useEffect(() => {
    if (isOpen) {
      setValue('numeric_value', isNumberValue);
    }
    setIsMessage('')
  }, [isOpen, isNumberValue, setValue]);

  const modalTitle = (flag) => {
    switch (flag) {
      case "min":
        return "Введите минимальное значение *";
      case "max":
        return "Введите максимальное значение *";
      default:
        return 'Ошибка ввода';
    }
  }

  const modalTipTitle = (flag) => {
    switch (flag) {
      case "min":
        return "* относительное смещение";
      case "max":
        return "* относительное смещение";
      default:
        return '';
    }
  }

  const onSubmit = async (data) => {
    const numericValue = data.numeric_value.replace(',', '.');
    const convertValue = await convertStringToNumber(numericValue);
    const findSensor = filteredSensors.find(s => s.id === isIdChangeSensor);
    const currentBaseValue = findSensor.requestSensorInfo[0].last_base_value
    if (flagValue === 'min') {
      if (Number(convertValue) > Number(currentBaseValue)) {
        setIsMessage('Ошибка. Введенное минимальное  значение больше существующего значения')
      } else {
        setIsMessage('')
        sendValueToParent(convertValue)
        onClose()
      }
    } else if (flagValue === 'max') {
      if (Number(convertValue) < Number(currentBaseValue)) {
        setIsMessage('Ошибка. Введенное максимальное  значение меньше существующего значения')
      } else {
        setIsMessage('')
        sendValueToParent(convertValue)
        onClose()
      }
    } else {
      setIsMessage('Ошибка. Что-то пошло не так. Попробуйте ввести  данные заново')
      setTimeout( () =>{
        setIsMessage('')
        onClose()
      }, 3000)
    }
  }

  return (
    <Box>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Прозрачный черный фон
          },
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          maxWidth: '95%',
          bgcolor: 'background.paper',
          border: '2px solid #666',
          boxShadow: 24,
          px: 3,
          py: 2
        }}>
          <Typography variant="h6">{modalTitle(flagValue)}</Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="numeric_value"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  autoFocus
                  required
                  margin="dense"
                  label="Введите данные"
                  type="text"
                  fullWidth
                  variant="standard"
                  error={!!errors.numeric_value}
                  helperText={errors.numeric_value ? errors.numeric_value.message : ''}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '-?[0-9]+([,.][0-9]+)?' // Allows an optional negative sign, digits, and one comma or dot
                  }}
                />
              )}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button onClick={onClose}>Отмена</Button>
              <Button type="submit">Сохранить</Button>
            </Box>
          </Box>
          <Typography variant="body2" mt={2}><i>{modalTipTitle(flagValue)}</i></Typography>
          {isMessage && <Alert color={alertColor}>{isMessage}</Alert>}
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalInputNumber;
