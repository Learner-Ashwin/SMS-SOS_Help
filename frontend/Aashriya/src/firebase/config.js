// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAE1bULHVofT8Cla8OCceEvqxpDph2DQJg",
  authDomain: "aashriya-b818e.firebaseapp.com",
  projectId: "aashriya-b818e",
  storageBucket: "aashriya-b818e.firebasestorage.app",
  messagingSenderId: "58055907927",
  appId: "1:58055907927:web:a9abdc9c045cb9b22f2112",
  measurementId: "G-WG08QEHCZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export default app;