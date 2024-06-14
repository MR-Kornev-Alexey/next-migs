import React from 'react';
import {Modal} from '@mui/material';
import Box from "@mui/material/Box";
import {SvgSpinnersEclipseHalf} from "@/lib/animated-icon/eclipse-half";

const ModalLoading: React.FC = ({ isOpen, onClose}) => {
  return (
    <Box>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Прозрачный черный фон
          },
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <SvgSpinnersEclipseHalf/>
        </Box>
      </Modal>
    </Box>
  );
}
export default ModalLoading;
