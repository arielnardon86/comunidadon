// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE16eLsg-LWoKDGUhQ6FldT5_j_asdFIY",
  authDomain: "reservations-77bbd.firebaseapp.com",
  projectId: "reservations-77bbd",
  storageBucket: "reservations-77bbd.appspot.com", // ⚠️ Estaba mal escrito
  messagingSenderId: "684359950273",
  appId: "1:684359950273:web:934203712ca8a6cf919940",
  measurementId: "G-QEW1DVZFHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; // ✅ Exportación nombrada
