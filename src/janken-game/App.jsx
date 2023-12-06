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
  var subPings = [];
  var subSession;
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
  const resolvePing = async (livings) => {
    if(livings.length < 2){
      
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
      var livings = [];
      const exisPlayers = findDoc.data().playerID
      await exisPlayers.forEach(async (id) => {
        const pingDoc = doc(db, "player_ping", id);
        await setDoc(pingDoc, {
          joining: ""
        });
        subPings.push(onSnapshot(pingDoc, (document) => {
          if(findDoc.id == document.data().joining){
            livings.push({p: document.id, s: document.data().joining});
            console.log("living player:", livings)
          }
          if(subPings.length == livings.length){
            // 全員分の応答があったら次の処理
            resolvePing(livings);
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
