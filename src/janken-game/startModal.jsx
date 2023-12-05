import { useState } from 'react'

import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// タブボタン用アクセシビリティプロパティ
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

function StartModal({open}) {
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
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <Tabs value={tabIndex} onChange={hTabChange} aria-label='joining type'>
              <Tab label="New session" {...a11yProps(0)}/>
              <Tab label="Join session" {...a11yProps(1)}/>
            </Tabs>
          </Box>
          <TabPanel index={0} now={tabIndex}>
            <Box sx={{ 
              display: 'flex', 
              flexFlow: 'column',
              gap: '30px',
            }}>
              <TextField id='password' label='新しい合言葉' variant='outlined' />
              <Button variant="contained">Create new session</Button>
            </Box>
          </TabPanel>
          <TabPanel index={1} now={tabIndex}>
            <Typography>bbb</Typography>
          </TabPanel>
        </Paper>
      </Modal>
    </>
  )
}

export default StartModal