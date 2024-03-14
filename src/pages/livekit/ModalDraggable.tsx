// components/ModalDraggable.tsx
import React from 'react';
import Draggable from 'react-draggable';
import { Modal, Box, Typography } from '@mui/material';

interface ModalDraggableProps {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode; // Aceptar cualquier componente como hijo
}

const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translate(-20%, -140%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 12,
  borderRadius:2,
  p: 4,
};

const ModalDraggable: React.FC<ModalDraggableProps> = ({ isOpen, handleClose, title, children }) => {
  return (
    <Draggable handle="#draggable-modal">
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="draggable-modal-title"
      sx={{ 
      position: 'relative',
      display:'flex'}}
    >
        <Box sx={{cursor: 'move', ...style}} id="draggable-modal">
          {/* <Typography id="draggable-modal-title" variant="h6" component="h2">
            {title}
          </Typography> */}
          {children}
        </Box>
    </Modal>
      </Draggable>
  );
};

export default ModalDraggable;
