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
// タブ内容ラッパーコンポーネント
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

function StartModal({
  open,
  onSubmitPasword = (e, password) => {},
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [password, setPassword] = useState('');

  const hTabChange = (event) => {
    const newValue = event.
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
              <Tab label="合言葉で始める" {...a11yProps(0)}/>
            </Tabs>
          </Box>
          <TabPanel index={0} now={tabIndex}>
            <Box sx={{ 
              display: 'flex', 
              flexFlow: 'column',
              gap: '30px',
            }}>
              <TextField id='password' label='合言葉を入力' variant='outlined' onChange={(e) => setPassword(e.target.value)} />
              <Button variant="contained" onClick={(e) => {onSubmitPasword(e, password)}}>Join</Button>
            </Box>
          </TabPanel>
        </Paper>
      </Modal>
    </>
  )
}

export default StartModal