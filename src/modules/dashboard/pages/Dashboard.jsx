// DashboardPrincipal.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Star as StarIcon,
  Inventory as InventoryIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  Event as EventIcon,
  AttachMoney
} from '@mui/icons-material';

// Components
import FiltrosDashboard from '../components/FiltrosDashboard';
import SeccionCalificaciones from '../components/SeccionCalificacones';
import SeccionInventario from '../components/SeccionInventario';
import SeccionPedidos from '../components/SeccionPedidos'
import SeccionReservas from '../components/SeccionReservas';
import SeccionVentas from '../components/SeccionVentas';
import SeccionResumen from '../components/SeccionResumen';

import { themeColors, getColor } from '../../../helpers/colorHelpers';
import colors from '../../../theme/colores';

const DashboardPrincipal = () => {
  const [seccionActiva, setSeccionActiva] = useState(0);
  const [filtros, setFiltros] = useState({
    fecha_desde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días atrás
    fecha_hasta: new Date().toISOString().split('T')[0] // Hoy
  });
  const [sucursalId, setSucursalId] = useState(null);

   const secciones = [
    { label: 'Resumen General', icon: <DashboardIcon />, component: <SeccionResumen filtros={filtros} sucursalId={sucursalId} /> },
    { label: 'Calificaciones', icon: <StarIcon />, component: <SeccionCalificaciones filtros={filtros} sucursalId={sucursalId} /> },
    { label: 'Inventario', icon: <InventoryIcon />, component: <SeccionInventario sucursalId={sucursalId} /> },
    { label: 'Pedidos', icon: <RestaurantIcon />, component: <SeccionPedidos filtros={filtros} sucursalId={sucursalId} /> },
    { label: 'Reservas', icon: <EventIcon />, component: <SeccionReservas filtros={filtros} sucursalId={sucursalId} /> },
    { label: 'Ventas', icon: <AttachMoney />, component: <SeccionVentas filtros={filtros} sucursalId={sucursalId} /> }
  ];

  // Obtener sucursalId del localStorage al cargar
  useEffect(() => {
    const sucursal = localStorage.getItem('sucursalId');
    if (sucursal) {
      const sucursalIdNum = parseInt(sucursal, 10);
      if (!isNaN(sucursalIdNum)) {
        setSucursalId(sucursalIdNum);
      }
    }
  }, []);

  const handleCambioSeccion = (event, nuevoValor) => {
    setSeccionActiva(nuevoValor);
  };

  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  if (!sucursalId) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No se ha configurado la sucursal
          </Typography>
        </Box>
      </Container>
    );
  }

   return (
    <Container maxWidth="xl" sx={{ mt: 2, backgroundColor: colors.background.default, minHeight: '100vh', py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: colors.primary.main }}>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ color: colors.text.secondary }}>
          Monitorea el desempeño de tu restaurante en tiempo real
        </Typography>
      </Box>

      {/* Filtros Globales */}
      <FiltrosDashboard 
        filtros={filtros}
        onFiltrosChange={handleFiltrosChange}
        sucursalId={sucursalId}
      />

      {/* Tabs de Secciones */}
      <Paper sx={{ 
        mb: 3, 
        backgroundColor: colors.background.paper,
        border: `1px solid ${colors.border.light}`
      }}>
        <Tabs
          value={seccionActiva}
          onChange={handleCambioSeccion}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: colors.text.secondary,
              '&.Mui-selected': {
                color: colors.primary.main,
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: colors.primary.main,
            }
          }}
        >
          {secciones.map((seccion, index) => (
            <Tab
              key={index}
              label={seccion.label}
              icon={seccion.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Contenido de la Sección Activa */}
      <Box>
        {secciones[seccionActiva].component}
      </Box>
    </Container>
  );
};


export default DashboardPrincipal;