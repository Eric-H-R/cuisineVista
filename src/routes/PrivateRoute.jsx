import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import moduleRouteMap from "../config/routes.config";

const PrivateRoute = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/" />;

  // Extrae la "clave" de módulo de la ruta actual, por ejemplo: "/ordenes" => "ORDENES"
  const moduleKey = Object.keys(moduleRouteMap).find(
    key => moduleRouteMap[key] === location.pathname
  );

  // Si la ruta pertenece a un módulo que el usuario no tiene
  if (moduleKey && !user.modulos.some(mod => mod.clave === moduleKey)) {
    // Tomamos el primer módulo que sí tenga
    const firstModulo = user.modulos[0];
    const firstRoute = firstModulo ? moduleRouteMap[firstModulo.clave] : "/dashboard";
    return <Navigate to={firstRoute} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
