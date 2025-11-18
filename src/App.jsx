import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/LayoutMenu/Layout";
import PrivateRoute from "./routes/PrivateRoute";

// === Lazy Imports ===
const Login = lazy(() => import("./modules/auth/components/login/login"));
const Tiendas = lazy(() => import("./components/tiendas/pages/Tiendas"));

const Dashboard = lazy(() => import("./modules/dashboard/pages/Dashboard"));
const Ordenes = lazy(() => import("./modules/ordenes/pages/Ordenes"));
const Mesas = lazy(() => import("./modules/mesas/pages/Mesas"));
const Menus = lazy(() => import("./modules/menus/pages/Menus"));
const Insumos = lazy(() => import("./modules/insumos/pages/Insumos"));
const Reservas = lazy(() => import("./modules/reservas/pages/Reservas"));
const Pagos = lazy(() => import("./modules/pagos/pages/Pagos"));
const Sucursales = lazy(() => import("./modules/sucursales/pages/Sucursales"));
const Usuarios = lazy(() => import("./modules/usuarios/pages/Usuarios"));
const Horarios = lazy(() => import("./modules/horarios/pages/Horarios"));
const Configuracion = lazy(() => import("./modules/configuraciones/pages/Configuraciones"));
const Recetas = lazy(() => import("./modules/recetas/pages/Recetas"));

// Loader básico
const Loader = () => (
  <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
    Cargando módulo...
  </div>
);

const App = () => {
  return (
    <AuthProvider>
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ordenes" element={<Ordenes />} />
                <Route path="/mesas" element={<Mesas />} />
                <Route path="/productos-recetas-costos" element={<Menus />} />
                <Route path="/insumos" element={<Insumos />} />
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/pagos" element={<Pagos />} />
                <Route path="/sucursales" element={<Sucursales />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/horarios" element={<Horarios />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/cuenta" element={<Pagos />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
