// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRqc94uNkEorwF1Z7cE7qiVr9RSwGzYvc",
  authDomain: "noa-cbt.firebaseapp.com",
  projectId: "noa-cbt",
  storageBucket: "noa-cbt.firebasestorage.app",
  messagingSenderId: "1093529292938",
  appId: "1:1093529292938:web:0f84ce1aa15f2129bf5d73",
  measurementId: "G-EF89Y5X62G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
