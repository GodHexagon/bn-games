// react
import { useState } from 'react'
// firebase
import db from "./../../firebaseConfig"
import {doc, getDocs, addDoc, updateDoc, deleteDoc,  collection, query, where, onSnapshot} from "firebase/firestore"
//component
import RSPButton from './rspButton'
// contents
import rockIconSrc from './../assets/rock.png';
import scissorsIconSrc from './../assets/scissors.png';
import paperIconSrc from './../assets/paper.png';
const rspIconSrc = [rockIconSrc, scissorsIconSrc, paperIconSrc];
// mui componetns
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography'

var usSession;
var jID = 0;
var oppJID = 0;
function App() {
  // セッション監視を設定
  const subSession = (newID) => {
    if(usSession != undefined){
      usSession();
    }
    setTimeout(() => {
      const docData = doc(db, "j_s_session", newID);
      usSession = onSnapshot(docData, (e) => {
        if(e.data() != undefined){
          onGetJID(e, true);
        }
      });
    }, 200);
  }
  const tryPassword = async () => {
    // 合言葉でDBを検索し変数に格納
    const q = query(collection(db, "j_s_session"), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    var matched;
    querySnapshot.forEach((doc) => {
      console.log("matched session:", doc.id, " => ", doc.data());
      matched = doc;
    });

    if(matched === undefined){
      // 見つからなかったら新規作成
      const docRef = await addDoc(collection(db, "j_s_session"), {
        password: password,
        host: jID,
        cli: 0
      });
      subSession(docRef.id);
      wating();
    }else{
      // 見つかったら
      onGetJID(matched, false);
      await updateDoc(doc(db, "j_s_session", matched.id), {
        cli: jID
      })
    }
  };
// - - - back/front interface - - -
  const wating = () => {
    console.log("wating for player...");
  };
  const onGetJID = async (e, host) => {
    oppJID = host? e.data().cli:e.data().host; 
    if(oppJID != 0){
      console.log("Janken is:", jID, " | ", oppJID);
      setWin(1 + (
        (jID == 1 && oppJID == 2) ||
        (jID == 2 && oppJID == 3) ||
        (jID == 3 && oppJID == 1)
        ? 1:0) + (
        (jID == 1 && oppJID == 3) ||
        (jID == 2 && oppJID == 1) ||
        (jID == 3 && oppJID == 2)
        ? -1:0)
      );
      setFOppJID(oppJID);
      setButtonDisabled(false);
      if(e.data().cli != 0 && e.data().host){
        deleteDoc(doc(db, "j_s_session", e.id))
      }
    }
  };
// - - - frontend with react - - -
  const [progressing, setProgressing] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [password, setPassword] = useState('');
  const [fjID, setFJID] = useState(0);
  const [foppJID, setFOppJID] = useState(0);
  const [win, setWin] = useState(1);// 0:defeat, 1:draw, 2: win

  const hSetJID = (e, i) => {
    setFJID(i);
  }
  const hSubmitPassword = (e) => {
    jID = fjID;
    oppJID = 0;
    if(jID != 0){
      tryPassword();
      setProgressing(true);
      setButtonDisabled(true);
      setFOppJID(0);
      setWin(1);
    }
  };

  return (
    <>
      <Container>
        <Typography variant='h1' sx={{ fontStyle: 'italic'}}>Janken <span style={{color: 'lightblue'}}>S </span></Typography>
        <Box sx={{ 
          display: 'flex', 
          flexFlow: 'column',
          gap: '30px',
        }}>
          <TextField id='password' label='合言葉を入力' variant='outlined' onChange={(e) => setPassword(e.target.value)} />
          <Typography variant='h5'>選択してください</Typography>
          <RSPButton 
            disabled={buttonDisabled}
            selection={fjID}
            onClick={hSetJID}
          />
          <Button variant="contained" disabled={buttonDisabled} onClick={(e) => {hSubmitPassword(e)}}>Submit!</Button>
          <Typography variant='h4'>相手の選択</Typography>
          <Box sx={{
            display: progressing? 'flex':'none',
            flexFlow: 'row',
            justifyContent: 'center'
          }}>
            <Alert severity={['error', 'warning', 'success'][win]} sx={{
              display: foppJID == 0? 'none':'flex',
            }}>
              <AlertTitle>{['Defeat...', 'Draw...', 'Victory!'][win]}</AlertTitle>
              <img src={rspIconSrc[foppJID - 1]} alt="result" width='100%' />
            </Alert>
            <Box sx={{
              display: foppJID == 0? 'block':'none',
            }}>
              <CircularProgress color="inherit" size={200} />
              <Typography>相手の選択を待っています・・・。</Typography>
              <Typography variant='caption'>ボタンを押すとゲームを終了して再読み込みします：
                <Button variant='outlined' onClick={() => window.location.reload()}>再読み込み</Button>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default App
