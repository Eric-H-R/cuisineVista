// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js")
    .then(async (reg) => {
      console.log("SW registrado v3");

      const token = localStorage.getItem("token");

      if (token && reg.active) {
        reg.active.postMessage({
          type: "SET_TOKEN",
          token
        });
      }
    })
    .catch(console.error);
}

navigator.serviceWorker.controller?.postMessage({
  type: "SET_TOKEN",
  token: localStorage.getItem("token")
});


// -------------------------------
// PROCESAR COLA CUANDO VUELVE INTERNET
// -------------------------------
window.addEventListener("online", async () => {
  console.log("[APP] Conexión restaurada → procesando cola…");

  const reg = await navigator.serviceWorker.ready;

  if (reg.active) {
    reg.active.postMessage({ type: "PROCESS_OFFLINE_QUEUE" });
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
