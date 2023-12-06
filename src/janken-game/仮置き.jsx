
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