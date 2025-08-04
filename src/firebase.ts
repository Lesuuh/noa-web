// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-Yd7Q0pEkSM48PE190w-D89_q45IbmrQ",

  authDomain: "noa-cbt-dd562.firebaseapp.com",

  projectId: "noa-cbt-dd562",

  storageBucket: "noa-cbt-dd562.firebasestorage.app",

  messagingSenderId: "412796345296",

  appId: "1:412796345296:web:110c3982d349a4606db7d5",

  measurementId: "G-DLGQ4CKXGD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const auth = getAuth(app);
