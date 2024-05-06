import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import {X} from "@phosphor-icons/react";
import {sensorsClient} from "@/lib/sensors/sensors-client";

export default function dialogInputIP({isOpen, handleClose, isIPAddress, setIsIPAddress,isIDSensor}) {
  const handleInputChange = (event) => {
    setIsIPAddress(event.target.value); // Обновление значения isIPAddress при изменении содержимого поля ввода
  };
  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const ipAddress = formJson.ipAddress;
            const result = sensorsClient.changeIPForSensor(ipAddress,isIDSensor)
            console.log(result);
            handleClose();
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{padding:1}}>
          <X size={28} onClick={handleClose} style={{ cursor: "pointer" }} />
        </Box>
        <DialogTitle>Введите новый IP address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="ipAddress"
            label="IP address"
            defaultValue={isIPAddress} // Значение по умолчанию для поля ввода
            fullWidth
            variant="standard"
            onChange={handleInputChange} //
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Изменить</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
