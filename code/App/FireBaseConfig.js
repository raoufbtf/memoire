import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAJFOdNqQbxTEI7JUWWLmQNmBUgKks7Nq0",
  authDomain: "dsdsdsdssd-fa590.firebaseapp.com",
  projectId: "dsdsdsdssd-fa590",
  storageBucket: "dsdsdsdssd-fa590.appspot.com",
  messagingSenderId: "341067581537",
  appId: "1:341067581537:web:b7f4978215e6f3d3704220"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
