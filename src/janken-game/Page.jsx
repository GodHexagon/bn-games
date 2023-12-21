// react and firebase
import { useState } from 'react'
//components
import StartModal from './startModal'
import RSPButton from './rspButton'
import PassSession from './PassSession'
// mui componetns
import { Container, CircularProgress, Backdrop, Button } from '@mui/material'

function Page() {
  const wait = () => {
    console.log("waiting for players...")
    setProgressing(false);
  }
  const start = () => {
    console.log("game start!");
    setProgressing(false);
  }
  const disconnect = () => {
  }
  const banned = (isFUll) => {
    console.warn("session removed you");
    if(isFUll){
      console.log('Session has full')
    }
    setProgressing(false);
  }

  const [openStartModal, setOpenStartModal] = useState(true);
  const [progressing, setProgressing] = useState(false);
  const [game, setGame] = useState({});

  const hSubmitPassword = (e, password) => {
    setGame(PassSession(
      password,
      wait,
      start,
      disconnect,
      banned,
    ));
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
