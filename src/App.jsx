import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/LayoutMenu/Layout";
import PrivateRoute from "./routes/PrivateRoute";

import Login from "./modules/auth/components/login/login";
import Tiendas from "./components/tiendas/pages/Tiendas";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Ordenes from "./modules/ordenes/pages/Ordenes";
import Mesas from "./modules/mesas/pages/Mesas";
import Menus from "./modules/menus/pages/Menus";
import Insumos from "./modules/insumos/pages/Insumos";
import Reservas from "./modules/reservas/pages/Reservas";
import Pagos from "./modules/pagos/pages/Pagos";
import Sucursales from "./modules/sucursales/pages/Sucursales";
import Usuarios from "./modules/usuarios/pages/Usuarios";
import Horarios from "./modules/horarios/pages/Horarios";
import Configuracion from "./modules/configuraciones/pages/Configuraciones";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/tiendas" element={<Tiendas />} />

          {/* Rutas privadas */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ordenes" element={<Ordenes />} />
              <Route path="/mesas" element={<Mesas />} />
              <Route path="/menu" element={<Menus />} />
              <Route path="/inventario" element={<Insumos />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/sucursales" element={<Sucursales />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/horarios" element={<Horarios />} />
              <Route path="/configuracion" element={<Configuracion />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
