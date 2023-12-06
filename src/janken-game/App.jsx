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
var usPings = [];
var usSession;
var ownSessionID = "";
var replyed = true;
function App() {
  const [openStartModal, setOpenStartModal] = useState(true);

  const resReply = async (id, livings) => {
    // フレッシュな値でDBを更新
    replyed = true;
    const docRef = await updateDoc(doc(db, "active_sessions", id), {
      playerID: livings
    }, { merge: true });
    // 満員判定
    if(livings.length < 2){
      await updateDoc(doc(db, "active_sessions", id), {
        playerID: [...livings, playerID]
      }, { merge: true });
      ownSessionID = id;
      console.log("joining succesed:", id)
    }else{
      console.log("session is full:", id);
    }
  }

  // 合言葉を使用したセッション管理関数
  const resolvePassword = async (password) => {
    // 合言葉でDBを検索しfindDocに格納
    const q = query(collection(db, "active_sessions"), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    var matched;
    querySnapshot.forEach((doc) => {
      console.log("matched session:", doc.id, " => ", doc.data());
      matched = doc;
      //doc.data().playerID
    });

    if(matched === undefined){
      // 見つからなかったら新規作成
      const docRef = await addDoc(collection(db, "active_sessions"), {
        password: password,
        playerID: [playerID]
      });
      ownSessionID = docRef.id;

      console.log("create new session:", docRef.id)
    }else{
      // 見つかったら既存プレイヤー全員の生存を確認
      var livings = [];
      const exisPlayers = matched.data().playerID;
      replyed = false;
      // タイムアウトした
      setTimeout(() => {
        if(!replyed){
          resReply(matched.id, livings)
          exisPlayers.forEach((id) => {
            deleteDoc(doc(db, "player_ping", id));
          })
        }
      }, 2000);
      exisPlayers.forEach(async (id, index) => {
        const pingDoc = doc(db, "player_ping", id);
        await setDoc(pingDoc, {
          joining: "?"
        });
        usPings.push(onSnapshot(pingDoc, (document) => {
          console.log("got reply:", document.id, "->", document.data())
          if(matched.id == document.data().joining){
            livings.push(document.id);
            console.log("living player:", livings)
          }
          if(usPings.length == livings.length){
            // 全員分の応答があった
            resReply(matched.id, livings);
          }
          usPings[index]();
        }));
      });
    }
  };
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

      console.log("create new session:", docRef.id)
    }else{
      const docMatched = doc(db, "active_sessions", matched.id);
      const usMatched = onSnapshot(docMatched, (e) => {
        console.log("matched session:", e.id, "|", e.data())
      });
      await updateDoc(docMatched, {
        playerID: arrayUnion(playerID)
      });
    }
  }

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
