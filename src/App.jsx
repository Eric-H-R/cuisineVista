import Layout from './components/LayoutMenu/Layout';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Usuarios from './modules/usuarios/pages/Usuarios'
import Dashboard from './modules/dashboard/pages/Dashboard';
import Ordenes from './modules/ordenes/pages/Ordenes';
import Pagos from './modules/pagos/pages/Pagos'
import Sucursales from './modules/sucursales/pages/Sucursales';
import Reservas from './modules/reservas/pages/Reservas';
import Mesas from './modules/mesas/pages/Mesas';
import Menus from './modules/menus/pages/Menus';
import Insumos from './modules/insumos/pages/Insumos';
import Configuracion from './modules/configuraciones/pages/Configuraciones';
import Login from './modules/auth/components/login/login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
     
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/mesas" element={<Mesas />} />
          <Route path="/menu" element={<Menus/>} />
          <Route path="/inventario" element={<Insumos/>} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/pagos" element={<Pagos />}/>
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;