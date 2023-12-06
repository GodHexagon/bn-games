// react and firebase
import { useState } from 'react'
import db from "./../../firebaseConfig"
import {doc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,  collection, query, where, onSnapshot, arrayUnion } from "firebase/firestore"
//contents
import reactLogo from './../assets/react.svg'
// components
import StartModal from './startModal'
// mui componetns
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

const playerID = crypto.randomUUID();
var usSession;
var ownSessionID = "";
var isOver = false

const onHostChange = (e) => {
  console.log("session update:", e.id, "|", e.data())
  isOver = e.data().player_id.length > 2
  if(isOver){
    console.log("session is full over, number of player:", e.data().player_id.length)
  }

  
}

const subSession = (newID) => {
  setTimeout(() => {
    usSession = onSnapshot(doc(db, "active_sessions", newID), (e) => {
      onHostChange(e);
    });
  }, 100);
}

const tryPassword = async (password) => {
  // 合言葉でDBを検索し変数に格納
  const q = query(collection(db, "active_sessions"), where("password", "==", password));
  const querySnapshot = await getDocs(q);
  var matched;
  querySnapshot.forEach((doc) => {
    console.log("matched session:", doc.id, " => ", doc.data());
    matched = doc;
  });

  if(matched === undefined){
    // 見つからなかったら新規作成
    const docRef = await addDoc(collection(db, "active_sessions"), {
      password: password,
      player_id: [playerID],
    });
    ownSessionID = docRef.id;
    subSession(docRef.id);

    console.log("create new session:", docRef.id)
  }else{
    // 見つかったら名簿に追加
    if(matched.data().player_id.length < 2){
      const docMatched = doc(db, "active_sessions", matched.id);
      await updateDoc(docMatched, {
        player_id: arrayUnion(playerID)
      });
    }
    ownSessionID = matched.id;
    subSession(matched.id);
  }
}

function App() {
  const [openStartModal, setOpenStartModal] = useState(true);
  // joinボタンを押したイベントハンドラ
  const hSubmitPassword = (e, password) => {
    tryPassword(password);
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
