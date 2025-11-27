/* ============================================================
   FIREBASE (compat)
============================================================ */
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBCFwoNrMOaltBQb3WE97H2IbCrjgHPj5M",
  authDomain: "cuisine-push-new.firebaseapp.com",
  projectId: "cuisine-push-new",
  storageBucket: "cuisine-push-new.firebasestorage.app",
  messagingSenderId: "674253062496",
  appId: "1:674253062496:web:7282887cc6e354bddede05",
  measurementId: "G-4WHPZHT8WF"
});

const messaging = firebase.messaging();
//messaging.usePublicVapidKey("BJutNpqHy_LmFuRKDVlzMQ64egU83jTPv5ZFZfuxZr12oWyTGhUBSrlQZW65AnM7EFDid5tKo7kBl22mGHtoOLQ");
messaging.onBackgroundMessage((payload) => {
  console.log("[FCM] Background message:", payload);
  self.registration.showNotification(
    payload.notification?.title || "Notificación",
    {
      body: payload.notification?.body || "",
      icon: payload.notification?.icon || "/vite.svg",
    }
  );
});

/* ============================================================
   PWA CACHE
============================================================ */
const CACHE_NAME = "PWA-Cache-v1";
const URLS_TO_CACHE = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil((async () => {
    await self.clients.claim();
    // Cleanup old cache entries on activate
    try {
      await cleanupOldEntries('API-RUNTIME-CACHE-v1');
    } catch (e) {
      console.warn('[SW] Error cleaning caches on activate', e);
    }
    try {
      await cleanupOldQueuedRequests(24 * 60 * 60 * 1000);
    } catch (e) {
      console.warn('[SW] Error cleaning old queued requests on activate', e);
    }
  })());
});

/* Cache GET requests */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = event.request.url;

  // TTL (24 hours)
  const TTL_MS = 24 * 60 * 60 * 1000;

  // Helpers to store/read timestamp metadata alongside cached responses
  async function setCacheWithTimestamp(cache, request, response) {
    await cache.put(request, response.clone());
    const metaReq = new Request(request.url + ':meta');
    try {
      await cache.put(metaReq, new Response(String(Date.now())));
    } catch (e) {
      console.warn('[SW] No se pudo guardar metadata de caché', e);
    }
  }

  async function getCachedIfFresh(cache, request) {
    const cached = await cache.match(request);
    if (!cached) return null;
    const meta = await cache.match(new Request(request.url + ':meta'));
    if (!meta) return { stale: false, response: cached };
    const ts = Number(await meta.text());
    if (Number.isNaN(ts)) return { stale: false, response: cached };
    const expired = (Date.now() - ts) > TTL_MS;
    return { stale: expired, response: cached };
  }

  // Runtime cache for selected API GET routes: network-first, fallback to cache when offline
  try {
    // Only handle same-origin API requests or the configured API host
    const apiPattern = /\/api\/(areas|mesas|menus|sucursales|productos|insumos|reservas|ordenes)/i;
    if (apiPattern.test(url)) {
      event.respondWith((async () => {
        const CACHE_NAME = 'API-RUNTIME-CACHE-v1';
        const cache = await caches.open(CACHE_NAME);
        try {
          const networkResponse = await fetch(event.request);
          // store a clone in the cache with timestamp
          try { await setCacheWithTimestamp(cache, event.request, networkResponse); } catch (e) { console.warn('[SW] Error caching network response', e); }
          // Cleanup old entries asynchronously (don't block response)
          cleanupOldEntries('API-RUNTIME-CACHE-v1').catch(err => console.warn('[SW] cleanup error', err));
          return networkResponse;
        } catch (err) {
          console.warn('[SW] Network error fetching API, checking cache', err);
          // Try cached entry and verify TTL
          try {
            const cachedInfo = await getCachedIfFresh(cache, event.request);
            if (cachedInfo && !cachedInfo.stale) return cachedInfo.response;
            // If cached exists but stale, still return it as last-resort when offline
            if (cachedInfo && cachedInfo.stale) {
              console.log('[SW] Cached entry is stale but returning as fallback');
              return cachedInfo.response;
            }
          } catch (e) {
            console.warn('[SW] Error checking cache freshness', e);
          }
          return caches.match('/index.html');
        }
      })());
      return;
    }
  } catch (err) {
    console.warn('[SW] Error applying runtime cache rule', err);
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});

/* ============================================================
   INDEXEDDB – COLA OFFLINE
============================================================ */

function openDB() {
  return new Promise((resolve) => {
    const req = indexedDB.open("offline-db", 1);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("peticiones")) {
        db.createObjectStore("peticiones", { keyPath: "id" });
      }
    };

    req.onsuccess = () => resolve(req.result);
  });
}

async function guardarPeticion(method, url, body, token) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('peticiones', 'readwrite');
      const store = tx.objectStore('peticiones');

      const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2));
      const request = { id, method, url, body, token, created_at: Date.now() };

      const req = store.add(request);
      req.onsuccess = async () => {
        console.log('[SW] Guardada en cola:', request);
        try {
          const all = await getAllRequests(store);
          console.log('[SW] Cantidad en cola ahora:', all.length);
        } catch (e) {
          console.warn('[SW] No se pudo leer cantidad en cola', e);
        }
        // Notificar a clientes que la petición fue guardada
        try { notifyClients({ type: 'OFFLINE_REQUEST_SAVED', id: request.id, url: request.url }); } catch (e) { console.warn('[SW] notifyClients error on save', e); }
        resolve(request.id);
      };
      req.onerror = (e) => {
        console.error('[SW] Error guardando petición en IndexedDB', e);
        reject(e);
      };
    } catch (err) {
      console.error('[SW] Error en guardarPeticion', err);
      reject(err);
    }
  });
}

/* ============================================================
   RECIBIR MENSAJES DESDE LA APP
============================================================ */
self.addEventListener("message", async (event) => {
  const data = event.data;

  if (data?.type === "GUARDAR_OFFLINE") {
    await guardarPeticion(data.method, data.url, data.body, data.token);

    if ("sync" in self.registration) {
      console.log("[SW] Registrando sync…");
      self.registration.sync.register("sync-peticiones-offline");
    }
    return;
  }

  if (data?.type === "PROCESS_OFFLINE_QUEUE") {
    console.log("[SW] Forzando procesamiento...");
    event.waitUntil(procesarCola());
  }
});

// Token enviado desde la app para usar en los reenvíos (si las peticiones encoladas no tienen token)
let swToken = undefined;
self.addEventListener('message', (ev) => {
  const d = ev.data;
  if (!d) return;
  if (d.type === 'SET_TOKEN') {
    swToken = d.token;
    console.log('[SW] Token recibido por SET_TOKEN:', !!swToken);
  }
});

// Enviar mensajes a todas las ventanas/clients controlados por el SW
function notifyClients(message) {
  if (!self.clients || !self.clients.matchAll) return;
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      try {
        client.postMessage(message);
      } catch (e) {
        console.warn('[SW] No se pudo notificar al cliente', e);
      }
    });
  }).catch(err => console.warn('[SW] notifyClients error', err));
}

/* ============================================================
   BACKGROUND SYNC
============================================================ */
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-peticiones-offline") {
    console.log("[SW] BackgroundSync → procesando cola");
    event.waitUntil(procesarCola());
  }
});

/* Utilidad: obtener todas las peticiones */
function getAllRequests(store) {
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = (e) => reject(e);
  });
}

/* ============================================================
   PROCESAR COLA OFFLINE
============================================================ */
let procesando = false;

async function procesarCola() {
  if (procesando) {
    console.warn("[SW] Ya está procesando. Cancelado duplicado.");
    return;
  }

  procesando = true;
  console.log("[SW] Procesando cola offline…");
  // Cleanup queued requests older than TTL before processing
  try { await cleanupOldQueuedRequests(24 * 60 * 60 * 1000); } catch (e) { console.warn('[SW] cleanupOldQueuedRequests error', e); }

  const peticiones = await getAllPeticiones();

  console.log("[SW] Cantidad en cola:", peticiones.length);

  for (const p of peticiones) {
    try {
      console.log("[SW] Enviando:", p);

      const headers = {
        "Content-Type": "application/json",
      };

      const tokenToUse = p.token || swToken;
      if (tokenToUse) {
        headers["Authorization"] = `Bearer ${tokenToUse}`;
      }

      const res = await fetch(p.url, {
        method: p.method,
        headers,
        body: JSON.stringify(p.body),
      });

      if (!res.ok) {
        console.warn("[SW] Error API → se reintentará luego:", await res.text());
        procesando = false;
        return;
      }

      console.log("[SW] OK → Eliminando:", p.id);
      try {
        await deleteRequestById(p.id);
        // Notificar a clientes que la petición fue enviada y eliminada
        try { notifyClients({ type: 'OFFLINE_REQUEST_SENT', id: p.id, url: p.url }); } catch (e) { console.warn('[SW] notifyClients error on sent', e); }
      } catch (e) {
        console.warn('[SW] Error eliminando petición de la cola:', e);
        // don't abort full processing; continue with next
      }

    } catch (err) {
      console.warn("[SW] Error de red → se reintentará luego:", err);
      procesando = false;
      return;
    }
  }

  procesando = false;

  console.log("[SW] Cola completada.");
  // Notificar a clientes que la cola quedó vacía
  try { notifyClients({ type: 'OFFLINE_QUEUE_EMPTY' }); } catch (e) { console.warn('[SW] notifyClients error on queue empty', e); }
}

// Obtener todas las peticiones (abre su propia transacción)
async function getAllPeticiones() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('peticiones', 'readonly');
      const req = tx.objectStore('peticiones').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e);
    } catch (err) {
      reject(err);
    }
  });
}

// Eliminar petición por id usando una transacción independiente
async function deleteRequestById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('peticiones', 'readwrite');
      const req = tx.objectStore('peticiones').delete(id);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e);
    } catch (err) {
      reject(err);
    }
  });
}

// Eliminar peticiones encoladas más antiguas que TTL (ms)
async function cleanupOldQueuedRequests(ttlMs) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('peticiones', 'readwrite');
      const store = tx.objectStore('peticiones');
      const req = store.getAll();
      req.onsuccess = async () => {
        try {
          const now = Date.now();
          const items = req.result || [];
          for (const it of items) {
            if (it.created_at && (now - it.created_at) > ttlMs) {
              try {
                await deleteRequestById(it.id);
                console.log('[SW] Eliminada petición antigua de la cola:', it.id);
              } catch (e) {
                console.warn('[SW] Error eliminando petición antigua', it.id, e);
              }
            }
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      req.onerror = (e) => reject(e);
    } catch (err) {
      reject(err);
    }
  });
}


/* ============================================================
   CACHE CLEANUP (TTL enforcement)
============================================================ */
async function cleanupOldEntries(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const now = Date.now();
    const TTL_MS = 24 * 60 * 60 * 1000;

    for (const key of keys) {
      // we only track meta entries with suffix ':meta'
      if (!key.url.endsWith(':meta')) continue;
      try {
        const metaResp = await cache.match(key);
        if (!metaResp) continue;
        const txt = await metaResp.text();
        const ts = Number(txt);
        if (Number.isNaN(ts)) continue;
        if ((now - ts) > TTL_MS) {
          const originalUrl = key.url.replace(':meta', '');
          console.log('[SW] Cache TTL expired. Removing:', originalUrl);
          try { await cache.delete(new Request(originalUrl)); } catch (e) { console.warn('[SW] Error deleting cached request', e); }
          try { await cache.delete(key); } catch (e) { console.warn('[SW] Error deleting cache meta', e); }
        }
      } catch (e) {
        console.warn('[SW] Error processing cache meta key', key.url, e);
      }
    }
  } catch (e) {
    console.warn('[SW] Error cleaning cache', cacheName, e);
  }
}

