import { Box, Grid, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const UserInfoUnavailable = () => (
  <Box sx={{ marginTop: 1 }}>
    <Typography variant="body1">Дополнительная информация недоступна</Typography>
  </Box>
);

const DialogContentItem = ({ label, value }) => (
  <Box sx={{ marginTop: 1 }}>
    <Typography variant="body1">
      {label} {value}
    </Typography>
  </Box>
);

const ModalDialog = ({isOpen, onClose, oneCustomer}) => (
  <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography variant="x5" sx={{ marginBottom: 2 }}>
        Пользователь {oneCustomer?.name || ''}
      </Typography>
      {oneCustomer?.additionalUserInfo?.length ? (
        <>
          <DialogContentItem
            label="Имя Фамилия"
            value={`${oneCustomer.additionalUserInfo[0].firstName} ${oneCustomer.additionalUserInfo[0].surName}`}
          />
          <DialogContentItem
            label="Телеграмм"
            value={oneCustomer.additionalUserInfo[0].telegram}
          />
          <DialogContentItem
            label="Телефон"
            value={oneCustomer.additionalUserInfo[0].phone}
          />
          <DialogContentItem
            label="Должность"
            value={oneCustomer.additionalUserInfo[0].position}
          />
        </>
      ) : (
        <UserInfoUnavailable />
      )}
      {oneCustomer?.organization ? (
        <Box sx={{ marginTop: 1 }}>
          <Typography variant="x5">{oneCustomer.organization.name}</Typography>
        </Box>
      ) : (
        <UserInfoUnavailable />
      )}
    </DialogContent>
  </Dialog>
);

export default ModalDialog;
