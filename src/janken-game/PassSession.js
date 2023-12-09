import db from "./../../firebaseConfig"
import {doc, getDocs, addDoc,  updateDoc, deleteDoc, collection, query, where, onSnapshot, arrayUnion } from "firebase/firestore"

function PassSession(
  password,
  wating = () => {},
  start = () => {},
  errorRoomFull = () => {},
  banned = () => {},
) {
  const gameplnum = 2;
  const playerID = crypto.randomUUID();
  let usSession;
  let ownSessionID = "";
  let pingReplyed = false;
  let joining = false;
  let prevStart = false;
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
  };
  // セッション更新監視
  const onHostChange = async (e) => {
    console.log("session update:", e.id, "|", e.data())
    // 接続確認
    let prev = joining;
    if(e.data().player_id.includes(playerID)){
      joining = true;
      if(e.data().started && ! prevStart){
        start();
        prevStart = true
      }
    }else{
      joining = false;
      prevStart= false;
    }
    if(prev && ! joining){
      usSession();
      if(e.data().player_id.length == 0){
        await deleteDoc(doc(db, "active_sessions", e.id));
      }
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
        }, 3000)
        let allraedy = true;
        e.data().player_id.forEach((id) => {
          allraedy = allraedy && livings.includes(id);
        })
        if(allraedy){
          pingExit(livings);
        }
      }
    }
  };
  // セッション監視を設定
  const subSession = async (newID) => {
    if(usSession != undefined){
      usSession();
    }
    setTimeout(() => {
      usSession = onSnapshot(doc(db, "active_sessions", newID), (e) => {
        onHostChange(e);
      });
    }, 500);
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
        pinging: "",
        living: [],
        started: false
      });
      ownSessionID = docRef.id;
      wating();
      await subSession(docRef.id);
    }else{
      // 見つかったら名簿に追加
      const docMatched = doc(db, "active_sessions", matched.id);
      if(matched.data().player_id.length < gameplnum){
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
      await subSession(matched.id);
    }
  };
  tryPassword(password);
  const ping = async () => {
    console.log("pinging...");
    pingReplyed = false;
    await updateDoc(doc(db, "active_sessions", ownSessionID), {
      pinging: playerID,
      living: [],
      started: false
    });
  }
  return ({
    ping: ping,
  })
}
export default PassSession