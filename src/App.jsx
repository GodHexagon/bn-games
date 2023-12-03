import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import db from "../firebaseConfig"
import {doc, getDoc, setDoc } from "firebase/firestore"

function App() {
  const countSync = async (num) => {
    if (num != undefined){
      setCount(num);
      await setDoc(doc(db, "host", "primary"), {
        count: num
      });
    }

    const docRef = doc(db, "host", "primary");
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    num = parseInt(data.count);

    setCount(num);

    return num;
  };

  const [count, setCount] = useState(0);
  countSync();

  const hCountUp = () => {
    countSync(count + 1);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => hCountUp()}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
