import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from "./components/LayoutMenu/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import LoadingComponent from "./components/Loadings/LoadingComponent";
import Tickets from "./modules/tickets/pages/Tickets";

// === Lazy Imports ===
const Login = lazy(() => import("./modules/auth/components/login/login"));
const Tiendas = lazy(() => import("./components/tiendas/pages/Tiendas"));


const Cocina = lazy(() => import ("./modules/cocina/pages/Cocina"));
const Auditoria = lazy(() => import("./modules/auditoria/pages/Auditoria"));
const Combos = lazy(() => import("./modules/combos/pages/Combos"));
const Cuenta = lazy(() => import("./modules/cuenta/pages/Cuenta"));
const Dashboard = lazy(() => import("./modules/dashboard/pages/Dashboard"));
const Ordenes = lazy(() => import("./modules/ordenes/pages/Ordenes"));
const Mesas = lazy(() => import("./modules/mesas/pages/Mesas"));
const Menus = lazy(() => import("./modules/menus/pages/Menus"));
const Insumos = lazy(() => import("./modules/insumos/pages/Insumos"));
const Reservas = lazy(() => import("./modules/reservas/pages/Reservas"));
const Pagos = lazy(() => import("./modules/pagos/pages/Pagos"));
const Sucursales = lazy(() => import("./modules/sucursales/pages/Sucursales"));
const Usuarios = lazy(() => import("./modules/usuarios/pages/Usuarios"));
const Areas = lazy(() => import("./modules/areas/pages/Areas"));
const Horarios = lazy(() => import("./modules/horarios/pages/Horarios"));
const Configuracion = lazy(() => import("./modules/configuraciones/pages/Configuraciones"));
const Recetas = lazy(() => import("./modules/recetas/pages/Recetas"));
const Unidades = lazy(() => import("./modules/unidades/pages/Unidades"));
const Proveedores = lazy(() => import("./modules/proveedores/pages/Proveedores"));
const Compras = lazy(() => import("./modules/compras/pages/Compras"));
const Recepcion = lazy(() => import("./modules/recepciones/pages/Recepcion"));
const Productos = lazy(() => import("./modules/productos/pages/Productos"));
const Campanias = lazy(() => import("./modules/crm/pages/Campanias"))
// Loader básico
const Loader = () => (
  <LoadingComponent message="Cargando..." overlay />
);

const App = () => {
  // Enviar mensaje al SW cuando volvemos online
  window.addEventListener("online", async () => {
    console.log("[App] Online → solicitando procesar cola offline");

    try {
      // Esperar que SW esté listo
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({ type: "PROCESS_OFFLINE_QUEUE" });
      }
    } catch (err) {
      console.error("[App] Error enviando mensaje al SW:", err);
    }
  });

  // Escuchar mensajes desde el Service Worker para notificaciones offline
  useEffect(() => {
    const onMessage = (ev) => {
      const data = ev.data;
      if (!data) return;
      if (data.type === 'OFFLINE_REQUEST_SAVED') {
        toast.info(`Guardado offline: ${data.url}`);
      }
      if (data.type === 'OFFLINE_REQUEST_SENT') {
        toast.success(`Petición offline enviada: ${data.url}`);
      }
      if (data.type === 'OFFLINE_QUEUE_EMPTY') {
        toast.info('Todas las peticiones offline fueron enviadas.');
      }
    };

    if (navigator.serviceWorker && navigator.serviceWorker.addEventListener) {
      navigator.serviceWorker.addEventListener('message', onMessage);
    }

    return () => {
      if (navigator.serviceWorker && navigator.serviceWorker.removeEventListener) {
        navigator.serviceWorker.removeEventListener('message', onMessage);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <ToastContainer position="top-right" />
      <Router>
        {/* Suspense envuelve TODO para cargar módulos en demanda */}
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<Login />} />
            <Route path="/tiendas" element={<Tiendas />} />

            {/* RUTAS PRIVADAS */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/auditoria" element={<Auditoria />} />
                <Route path="/cocina" element={<Cocina />} />
                <Route path="/cuenta" element={<Cuenta />}></Route>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ordenes" element={<Ordenes />} />
                <Route path="/combos" element={<Combos />} />
                <Route path="/areas" element={<Areas />} />
                <Route path="/mesas" element={<Mesas />} />
                <Route path="/productos-recetas-costos" element={<Productos />} />
                <Route path ="/tickets" element = {<Tickets />} />
                <Route path="/insumos" element={<Insumos />} />
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/menus" element={<Menus />} />
                <Route path="/pagos" element={<Pagos />} />
                <Route path="/sucursales" element={<Sucursales />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/horarios" element={<Horarios />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/cuenta" element={<Pagos />} />
                <Route path="/unidades-medida" element={<Unidades />} />
                <Route path="/proveedores" element={<Proveedores />} />
                <Route path="/compras" element={<Compras />} />
                <Route path="/mermas" element={<Recepcion />} />
                <Route path="/crm" element={<Campanias />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
