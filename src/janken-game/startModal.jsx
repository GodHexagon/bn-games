import { useState } from 'react'
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';

const paperStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  p: 4,
};

function StartModal() {
  const [open, setOpen] = useState(true);

  return  (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={paperStyle}>
          
        </Paper>
      </Modal>
    </>
  )
}

export default StartModal