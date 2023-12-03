// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU1I9oPnHrr_zwk2C-fbsFrBe5gYGHgAU",
  authDomain: "qtr-test.firebaseapp.com",
  projectId: "qtr-test",
  storageBucket: "qtr-test.appspot.com",
  messagingSenderId: "119821397007",
  appId: "1:119821397007:web:44ecf36f260451c0a3877a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
