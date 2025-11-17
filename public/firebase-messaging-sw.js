// Importa Firebase compat (para usar con importScripts)
importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4-__I3X8-Ey71TRcioGZ8nq9d7fXaKbA",
  authDomain: "push-notifications-cuisine.firebaseapp.com",
  projectId: "push-notifications-cuisine",
  storageBucket: "push-notifications-cuisine.firebasestorage.app",
  messagingSenderId: "65217047825",
  appId: "1:65217047825:web:0d580a2f3df43c729930b0",
  measurementId: "G-RMN6HGWZ21"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializa Messaging
const messaging = firebase.messaging(app);
messaging.usePublicVapidKey("BJutNpqHy_LmFuRKDVlzMQ64egU83jTPv5ZFZfuxZr12oWyTGhUBSrlQZW65AnM7EFDid5tKo7kBl22mGHtoOLQ");
// Escucha mensajes en background
messaging.onBackgroundMessage(payload => {
  console.log("Mensaje recibido en ausencia:", payload);

  const notificationTitle = payload.notification?.title || "Notificación";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/vite.svg",
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
