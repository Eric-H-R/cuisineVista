import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Sidebar from './SideBar';
import Topbar from './TopBar';
import { Outlet } from 'react-router-dom';
import { useState } from "react";

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar (fijo + temporal) */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* Contenedor principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 260px)` },
          ml: { sm: '260px' },
          mt: '64px', // altura del AppBar
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Barra superior */}
        <Topbar handleDrawerToggle={handleDrawerToggle} />

        {/* Contenido de los módulos */}
        {children}
        <Outlet />
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
