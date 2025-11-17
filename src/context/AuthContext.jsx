import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [sucursal, setSucursal] = useState( localStorage.getItem("sucursalId") || null);

  // Login completo
  const login = (tokenValue, userData) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(tokenValue);
    setUser(userData);
  };

  // Guardar sucursal seleccionada
  const seleccionarSucursal = (idSucursal) => {
    localStorage.setItem("sucursalId", idSucursal);
    setSucursal(idSucursal);
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setSucursal(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        sucursal,
        login,
        logout,
        seleccionarSucursal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
