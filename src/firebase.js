import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";  

const firebaseConfig = {
  apiKey: "AIzaSyBCFwoNrMOaltBQb3WE97H2IbCrjgHPj5M",
  authDomain: "cuisine-push-new.firebaseapp.com",
  projectId: "cuisine-push-new",
  storageBucket: "cuisine-push-new.firebasestorage.app",
  messagingSenderId: "674253062496",
  appId: "1:674253062496:web:7282887cc6e354bddede05",
  measurementId: "G-4WHPZHT8WF"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const messaging = getMessaging(app);