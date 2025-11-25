import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(async (config) => {
  const metodo = (config.method || "").toUpperCase();
  const esModificacion = ["POST", "PUT", "DELETE"].includes(metodo);

  // ---------------------------------------------
  // 1. Si NO hay internet → guardar en cola SW
  // ---------------------------------------------
  if (esModificacion && !navigator.onLine) {
    console.warn("OFFLINE → Guardando en cola:", config.url);

    // Mandar al service worker
    const token = localStorage.getItem('token');
    const message = {
      type: "GUARDAR_OFFLINE",
      method: metodo,
      // URL ABSOLUTA (super importante)
      url: `${API.defaults.baseURL}${config.url}`,
      // cuerpo de la petición
      body: config.data,
      token: token || undefined,
    };

    try {
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage(message);
        console.log('[API] GUARDAR_OFFLINE enviado al SW (controller):', message.url);
      } else {
        const reg = await navigator.serviceWorker.ready;
        if (reg?.active) {
          reg.active.postMessage(message);
          console.log('[API] GUARDAR_OFFLINE enviado al SW (reg.active):', message.url);
        } else {
          console.warn('[API] No se encontró SW activo para GUARDAR_OFFLINE');
        }
      }
    } catch (err) {
      console.error('[API] Error enviando GUARDAR_OFFLINE al SW', err);
    }

    // Evitar que Axios haga petición real
    return Promise.reject({
      offline: true,
      message: "Guardado offline. Se enviará cuando vuelva la conexión.",
    });
  }

  // ---------------------------------------------
  // 2. Si hay internet → continuar normalmente
  // ---------------------------------------------
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default API;
