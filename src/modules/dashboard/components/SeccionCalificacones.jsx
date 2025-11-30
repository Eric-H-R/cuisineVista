// sections/SeccionCalificaciones.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import {
  Star,
  TrendingUp,
  TrendingDown,
  RateReview
} from '@mui/icons-material';

// Services
import dashboardService from '../services/dashboard.service';

import { themeColors, getColor } from '../../../helpers/colorHelpers';
import colors from '../../../theme/colores';


const SeccionCalificaciones = ({ filtros, sucursalId }) => {
  const [metricas, setMetricas] = useState(null);
  const [topEmpleados, setTopEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sucursalId) {
      cargarDatosCalificaciones();
    }
  }, [filtros, sucursalId]);

  const cargarDatosCalificaciones = async () => {
    try {
      setLoading(true);
      
      const [resMetricas, resEmpleados] = await Promise.all([
        dashboardService.getPromedioCalificaciones({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId
        }),
        dashboardService.getTopEmpleados({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId,
          top_n: 10
        })
      ]);
      
      setMetricas(resMetricas.data.data);
      setTopEmpleados(resEmpleados.data.data);
    } catch (error) {
      console.error('Error cargando calificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Cargando calificaciones...</Typography>
      </Box>
    );
  }
  console.log(topEmpleados)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* KPI Cards */}
       <Grid container spacing={3}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            backgroundColor: themeColors.primaryLight,
            color: colors.primary.contrastText 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Star sx={{ fontSize: 40, color: 'gold', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metricas?.promedio || 0}
              </Typography>
              <Typography variant="body2">
                Calificación Promedio
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            backgroundColor: themeColors.secondaryLight,
            color: colors.text.primary 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <RateReview sx={{ fontSize: 40, color: themeColors.accent, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metricas?.total_calificaciones || 0}
              </Typography>
              <Typography variant="body2">
                Total Calificaciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            backgroundColor: themeColors.success,
            color: colors.primary.contrastText 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metricas?.calificacion_maxima || 0}
              </Typography>
              <Typography variant="body2">
                Calificación Máxima
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            backgroundColor: themeColors.warning,
            color: colors.primary.contrastText 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDown sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metricas?.calificacion_minima || 0}
              </Typography>
              <Typography variant="body2">
                Calificación Mínima
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Empleados */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Top 10 Empleados Mejor Calificados
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {topEmpleados.map((empleado, index) => (
            <Box
              key={empleado.empleado_id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" color="primary">
                  #{index + 1}
                </Typography>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {empleado.empleado_nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {empleado.total_calificaciones} calificaciones
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: 'gold' }} />
                <Typography variant="h6" color="success.main">
                  {empleado.promedio}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default SeccionCalificaciones;