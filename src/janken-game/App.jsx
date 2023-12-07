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

const gameplnum = 2;
const playerID = crypto.randomUUID();
var usSession;
var ownSessionID = "";
var pingReplyed = false;
var joining = false;

// 生存確定
const pingExit = async (livings) => {
  if(! pingReplyed){
    pingReplyed = true
    console.log("exis player:", livings);
    await updateDoc(doc(db, "active_sessions", ownSessionID), {
      player_id: livings,
      pinging: "",
      living: []
    });

    if(livings.length == gameplnum){
      await updateDoc(doc(db, "active_sessions", ownSessionID), {
        started: true
      });
    }else if(livings.length > gameplnum){
      errorRoomFull();
    }else{
      wating();
      await updateDoc(doc(db, "active_sessions", ownSessionID), {
        started: false
      });
    }
  }
}
// セッション更新監視
const onHostChange = async (e) => {
  console.log("session update:", e.id, "|", e.data())
  // 接続確認
  var prev = joining;
  if(e.data().player_id.includes(playerID)){
    if(e.data().started){
      joining = true;
    }
  }else{
    joining = false;
  }
  if(joining && ! prev){
    start();
  }else if(prev && ! joining){
    banned();
  }

  // 生存確認が来たとき
  if(e.data().pinging != ""){
    if(! e.data().living.includes(playerID)){
      console.log("ping replying...");
      await updateDoc(doc(db, "active_sessions", e.id), {
        living: arrayUnion(playerID),
      });
    }
    if(e.data().pinging == playerID){
      const livings = e.data().living;
      setTimeout(() => {
        pingExit(livings);
      }, 1000)
      if(e.data().player_id.length == livings.length){
        pingExit(livings);
      }
    }
  }
}
// セッション監視を設定
const subSession = (newID) => {
  setTimeout(() => {
    usSession = onSnapshot(doc(db, "active_sessions", newID), (e) => {
      onHostChange(e);
    });
  }, 200);
}
const tryPassword = async (password) => {
  if(usSession != undefined){
    usSession();
  }
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
      pinging: "",
      living: [],
      started: false
    });
    ownSessionID = docRef.id;
    subSession(docRef.id);
    wating();
  }else{
    // 見つかったら名簿に追加
    const docMatched = doc(db, "active_sessions", matched.id);
    if(matched.data().player_id.length < 2){
      await updateDoc(docMatched, {
        player_id: arrayUnion(playerID),
      });
    }else{
      console.log("matched session is full")
    }
    // 他のプレイヤーの生存確認
    console.log("pinging...");
    pingReplyed = false;
    await updateDoc(docMatched, {
      pinging: playerID,
      living: [],
      started: false
    });
    ownSessionID = matched.id;
    subSession(matched.id);
  }
}

const wating = () => {
  console.log("wating for matching...");
}
const start = () => {
  console.log("game start!");
}
const errorRoomFull = () => {
  console.error("session is full over");
}
const banned = () => {
  console.log("session removed you");
}

function App() {
  const [openStartModal, setOpenStartModal] = useState(true);
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
