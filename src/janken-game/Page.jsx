// react and firebase
import { useState } from 'react'
//components
import StartModal from './startModal'
import RSPButton from './rspButton'
import PassSession from './PassSession'
// mui componetns
import { Container, CircularProgress, Backdrop, Button } from '@mui/material'

let game;

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
    game = PassSession(
      password,
      wating,
      start,
      errorRoomFull,
      banned,
    );
    setOpenStartModal(false);
    setProgressing(true);
  };
  const hPingButton = () => {
    game.ping();
  }

  return (
    <>
      <Container>
        <p>test</p>
        <Button onClick={(e) => hPingButton()}>Submit ping</Button>
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
