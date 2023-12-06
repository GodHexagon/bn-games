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
  const playerID = crypto.randomUUID();
  var ownSessionID = "";

  // 生存確認受け取り
  const disPlayerPing = onSnapshot(doc(db, "player_ping", playerID), async (document) => {
    console.log("ping updated: ", document.data());
    if(document.data() != undefined){
      await setDoc(doc(db, "player_ping", document.id), {
        joining: ownSessionID
      });
    }
  });
  // セッションの確認とその後の処理
  const refreshSession = async (findDoc, livings) => {
    livings.forEach((living) => {
      if(findDoc.data().playerID.includes(living)){
        
      }
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
      ownSessionID = docRef.id;

      console.log("create new session:", docRef.id)
    }else{
      // 見つかったら既存プレイヤー全員の生存を確認
      var pings = [];
      var livings = [];
      await findDoc.data().playerID.forEach(async (id) => {
        const pingDoc = doc(db, "player_ping", id);
        await setDoc(pingDoc, {
          joining: ""
        });
        pings.push(onSnapshot(pingDoc, (document) => {
          livings.push({p: document.id, s: document.data().joining});
          console.log("reply got:", livings);
          if(pings.length == livings.length){
            // 全員分の応答があったら次の処理
            refreshSession(findDoc, livings);
          }
        }));
      });
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
