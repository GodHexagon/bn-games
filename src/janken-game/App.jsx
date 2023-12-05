// react and firebase
import { useState } from 'react'
import db from "./../../firebaseConfig"
import {doc, getDoc, setDoc } from "firebase/firestore"
//contents
import reactLogo from './../assets/react.svg'
// styles
// components
import StartModal from './startModal'
// mui componetns
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

function App() {
  const [openStartModal, setOpenStartModal] = useState(true);
  const hSubmitPassword = (e, password) => {
    console.log(password);
  }

  return (
    <>
      <Container sx={{ height: '400px' }}>
        <img src={reactLogo} className="logo react" alt="React logo" />
        <p>aaaaaaaaaaaaaaaaa</p>
        <IconButton>
          <img src={reactLogo} className="logo react" alt="React logo" height='300px' />
        </IconButton>
        <StartModal
          open={openStartModal}
          onSubmitPasword={hSubmitPassword}
        />
      </Container>
    </>
  )
}

export default App
