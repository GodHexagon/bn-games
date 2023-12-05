// react and firebase
import { useState } from 'react'
import db from "./../../firebaseConfig"
import {doc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,  collection, query, where, onSnapshot } from "firebase/firestore"
//contents
import reactLogo from './../assets/react.svg'
// components
import StartModal from './startModal'
// mui componetns
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

function App() {
  const [openStartModal, setOpenStartModal] = useState(true);
  const [playerID, setPlayerID] = useState(crypto.randomUUID());

  const unsub = onSnapshot(doc(db, "player_ping", playerID), async (document) => {
    console.log("ping updated: ", document.data());
    if(document.data() != undefined){
      await deleteDoc(doc(db, "player_ping", document.id))
    }
  });

  // 合言葉を使用したセッション管理関数
  const resolvePassword = async (password) => {
    // 合言葉でDBを検索しfindDocに格納
    const q = query(collection(db, "active_sessions"), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    var findDoc;
    querySnapshot.forEach((doc) => {
      console.log("matched session:", doc.id, " => ", doc.data());
      findDoc = doc;
      //doc.data().playerID
    });

    if(findDoc === undefined){
      // 見つからなかったら新規作成
      const docRef = await addDoc(collection(db, "active_sessions"), {
        password: password,
        playerID: [playerID]
      });

      console.log("create new session:", docRef.id)
    }else{
      // 見つかったらとりあえず参加プレイヤーの生存を確認
      findDoc.data().playerID.forEach(async (id) => {
        await setDoc(doc(db, "player_ping", id), {
          from: playerID,
          responded: false
        });
      });

      if(findDoc.data().playerID.length == 1){
        await updateDoc(doc(db, "active_sessions", findDoc.id), {
          playerID: [...findDoc.data().playerID, playerID]
        }, { merge: true });
  
        console.log("try to join:", findDoc.id);
      }else{
        console.log("session is full:", findDoc.id);
      }
    }
  };
  // joinボタンを押したイベントハンドラ
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
