import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const schema = zod.object({
  string_value: zod.string().min(1, { message: 'Ввод единиц измерения обязателен' }),
});

const ModalInputString = ({ isOpen, onClose, isStringValue, flagValue, sendValueToParent }) => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      string_value: isStringValue
    }
  });

  useEffect(() => {
    if (isOpen) {
      setValue('string_value', isStringValue);
    }
  }, [isOpen, isStringValue, setValue]);

  const modalTitle = (flag) => {
    switch (flag) {
      case "designation":
        return "Введите обозначение";
      default:
        return 'Ошибка ввода';
    }
  }

  const onSubmit = (data) => {
    sendValueToParent(data.string_value);
    onClose();
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
              name="string_value"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  required
                  margin="dense"
                  label="Введите данные"
                  type="text"
                  fullWidth
                  variant="standard"
                  error={!!errors.string_value}
                  helperText={errors.string_value ? errors.string_value.message : ''}
                />
              )}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button onClick={onClose}>Отмена</Button>
              <Button type="submit">Сохранить</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalInputString;

