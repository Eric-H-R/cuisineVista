import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";  

const firebaseConfig = {
  apiKey: "AIzaSyD4-__I3X8-Ey71TRcioGZ8nq9d7fXaKbA",
  authDomain: "push-notifications-cuisine.firebaseapp.com",
  projectId: "push-notifications-cuisine",
  storageBucket: "push-notifications-cuisine.firebasestorage.app",
  messagingSenderId: "65217047825",
  appId: "1:65217047825:web:0d580a2f3df43c729930b0",
  measurementId: "G-RMN6HGWZ21"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const messaging = getMessaging(app);