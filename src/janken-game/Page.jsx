// react and firebase
import { useState } from 'react'
import db from "./../../firebaseConfig"
import {doc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,  collection, query, where, onSnapshot, arrayUnion } from "firebase/firestore"
//components
import StartModal from './startModal'
import RSPButton from './rspButton'
import PassSession from './PassSession'
// mui componetns
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop'

function Page() {
  const wating = () => {
    console.log("wating for matching...");
    setProgressing(false);
  }
  const start = () => {
    console.log("game start!");
    setProgressing(false);
  }
  const errorRoomFull = () => {
    console.warn("session is full over");
    setProgressing(false);
  }
  const banned = () => {
    console.error("session removed you");
    setProgressing(false);
  }

  const [openStartModal, setOpenStartModal] = useState(true);
  const [progressing, setProgressing] = useState(false);
  const hSubmitPassword = (e, password) => {
    PassSession(
      password,
      wating,
      start,
      errorRoomFull,
      banned,
    );
    setOpenStartModal(false);
    setProgressing(true);
  };

  return (
    <>
      <Container>
        <p>test</p>
      </Container>
      <StartModal
        open={openStartModal}
        onSubmitPasword={hSubmitPassword}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={progressing}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default Page
