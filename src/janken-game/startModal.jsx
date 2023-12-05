import { useState } from 'react'

import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// タブ用アクセシビリティプロパティ
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
// タブ内容コンポーネント
function TabPanel({ children, index, now }) {
  return (
    <div
      role="tabpanel"
      hidden={now !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      <Box>{children}</Box>
    </div>
  )
};

function StartModal() {
  const [open, setOpen] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const hTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return  (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tabs value={tabIndex} onChange={hTabChange} aria-label='joining type'>
              <Tab label="New session" {...a11yProps(0)}/>
              <Tab label="Join session" {...a11yProps(0)}/>
            </Tabs>
          </Box>
          <TabPanel index={0} now={tabIndex}>
            <Typography>aaaa</Typography>
          </TabPanel>
        </Paper>
      </Modal>
    </>
  )
}

export default StartModal