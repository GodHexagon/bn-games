// react and firebase
import { useState } from 'react'
import db from "./../../firebaseConfig"
import {doc, getDocs, addDoc, collection, query, where } from "firebase/firestore"
//contents
import reactLogo from './../assets/react.svg'
// components
import StartModal from './startModal'
// mui componetns
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

function App() {
  const [openStartModal, setOpenStartModal] = useState(true);

  const resolvePassword = async (password) => {
    const q = query(collection(db, "active_sessions"), where("password", "==", password), where("player", "==", 1));
    const querySnapshot = await getDocs(q);
    var gettedPassword;
    querySnapshot.forEach((doc) => {
      console.log("matched session:", doc.id, " => ", doc.data());
      gettedPassword = doc.data().password;
    });

    if(gettedPassword === undefined){
      const docRef = await addDoc(collection(db, "active_sessions"), {
        password: password,
        player: 1
      });
      console.log("create new session:", docRef)
    }
  };
  const hSubmitPassword = (e, password) => {
    resolvePassword(password);
  };

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
