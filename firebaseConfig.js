// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiOhIJ-J2EkxkRTBIoN1yjTtbHNdA1JCU",
  authDomain: "bn-games-2403f.firebaseapp.com",
  projectId: "bn-games-2403f",
  storageBucket: "bn-games-2403f.appspot.com",
  messagingSenderId: "447248708299",
  appId: "1:447248708299:web:bd4fe3cadf869a1eefa14e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
