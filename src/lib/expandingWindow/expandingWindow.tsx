import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const ExpandingWindow = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Открыть окно</Button>
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Заголовок окна</DialogTitle>
  <DialogContent>
  <p>Содержимое раскрывающегося окна</p>
  </DialogContent>
  <DialogActions>
  <Button onClick={handleClose}>Закрыть</Button>
    </DialogActions>
    </Dialog>
    </>
);
};

export default ExpandingWindow;
