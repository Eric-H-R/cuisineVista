// sections/SeccionReservas.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  EventAvailable,
  EventBusy,
  People,
  TrendingDown,
  Schedule
} from '@mui/icons-material';

// Chart.js
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Services
import dashboardService from '../services/dashboard.service';

// Colores
import colors from '../../../theme/colores';

const SeccionReservas = ({ filtros, sucursalId }) => {
  const [estadosReservas, setEstadosReservas] = useState([]);
  const [tasaNoShow, setTasaNoShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sucursalId) {
      cargarDatosReservas();
    }
  }, [filtros, sucursalId]);

  const cargarDatosReservas = async () => {
    try {
      setLoading(true);
      
      const [resEstados, resNoShow] = await Promise.all([
        dashboardService.getEstadosReservas({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId
        }),
        dashboardService.getTasaNoShow({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId
        })
      ]);
      
      setEstadosReservas(resEstados.data.data || []);
      setTasaNoShow(resNoShow.data.data || null);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos para gráfica de estados de reservas
  const datosEstadosReservas = {
    labels: estadosReservas.map(item => item.estado_nombre),
    datasets: [{
      data: estadosReservas.map(item => item.cantidad),
      backgroundColor: [
        colors.primary.main,
        colors.secondary.main,
        colors.status.success,
        colors.status.error,
        colors.status.warning
      ],
      borderWidth: 2,
      borderColor: colors.background.light
    }]
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: colors.text.secondary }}>Cargando datos de reservas...</Typography>
      </Box>
    );
  }

  const totalReservas = estadosReservas.reduce((sum, item) => sum + item.cantidad, 0);
  const reservasCompletadas = estadosReservas.find(item => item.estado_nombre === 'Completada')?.cantidad || 0;
  const reservasNoShow = estadosReservas.find(item => item.estado_nombre === 'No Show')?.cantidad || 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Alertas Importantes */}
      {tasaNoShow?.tasa_noshow > 10 && (
        <Alert severity="warning"
          sx={{ 
            backgroundColor: colors.status.warning + '20',
            border: `1px solid ${colors.status.warning}`
          }}
        >
          <Typography variant="h6" sx={{ color: colors.text.primary }}>
            ⚠️ Tasa de No-Show Alta: {tasaNoShow?.tasa_noshow}%
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.primary }}>
            Considera implementar recordatorios o políticas de confirmación
          </Typography>
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.primary.main}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventAvailable sx={{ fontSize: 40, color: colors.primary.main, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.primary.main }}>
                {totalReservas}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Total Reservas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.status.success}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: colors.status.success, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.status.success }}>
                {reservasCompletadas}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Reservas Completadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.status.error}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventBusy sx={{ fontSize: 40, color: colors.status.error, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.status.error }}>
                {reservasNoShow}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                No-Shows
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${tasaNoShow?.tasa_noshow > 10 ? colors.status.error : colors.status.warning}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDown sx={{ 
                fontSize: 40, 
                color: tasaNoShow?.tasa_noshow > 10 ? colors.status.error : colors.status.warning, 
                mb: 1 
              }} />
              <Typography 
                variant="h4" 
                fontWeight="bold"
                sx={{ color: tasaNoShow?.tasa_noshow > 10 ? colors.status.error : colors.status.warning }}
              >
                {tasaNoShow?.tasa_noshow || 0}%
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Tasa No-Show
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficas y Métricas */}
      <Grid container spacing={3}>
        
        {/* Estados de Reservas - Dona */}
        <Grid size={{xs: 12, md: 6}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Distribución de Estados de Reservas
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut 
                data={datosEstadosReservas}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Métricas de Performance */}
        <Grid size={{xs: 12, md: 6}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Métricas de Performance
            </Typography>
            
            {/* Tasa de No-Show */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Tasa de No-Show
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: colors.text.primary }}>
                  {tasaNoShow?.tasa_noshow || 0}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={tasaNoShow?.tasa_noshow || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: colors.border.light,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 
                      tasaNoShow?.tasa_noshow > 15 ? colors.status.error :
                      tasaNoShow?.tasa_noshow > 8 ? colors.status.warning : colors.status.success,
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
                {tasaNoShow?.noshows || 0} de {tasaNoShow?.total_reservas || 0} reservas no asistieron
              </Typography>
            </Box>

            {/* Tasa de Completación */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Tasa de Completación
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: colors.text.primary }}>
                  {totalReservas > 0 ? Math.round((reservasCompletadas / totalReservas) * 100) : 0}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={totalReservas > 0 ? (reservasCompletadas / totalReservas) * 100 : 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: colors.border.light,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: colors.status.success,
                  }
                }}
              />
            </Box>

            {/* Eficiencia de Mesas */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Eficiencia de Ocupación
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: colors.text.primary }}>
                  {totalReservas > 0 ? Math.round(((totalReservas - reservasNoShow) / totalReservas) * 100) : 0}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={totalReservas > 0 ? ((totalReservas - reservasNoShow) / totalReservas) * 100 : 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: colors.border.light,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: colors.primary.main,
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
                Porcentaje de reservas que efectivamente ocuparon mesas
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Resumen Detallado */}
        <Grid size={{xs: 12}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Resumen Detallado por Estado
            </Typography>
            <Grid container spacing={2}>
              {estadosReservas.map((estado) => (
                <Grid size={{xs: 12, sm: 6, md: 4, lg: 2.4}} key={estado.estado}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      textAlign: 'center',
                      borderColor: 
                        estado.estado_nombre === 'No Show' ? colors.status.error :
                        estado.estado_nombre === 'Completada' ? colors.status.success :
                        estado.estado_nombre === 'Cancelada' ? colors.status.warning : colors.primary.main,
                      backgroundColor: colors.background.light
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold"
                        sx={{
                          color:
                            estado.estado_nombre === 'No Show' ? colors.status.error :
                            estado.estado_nombre === 'Completada' ? colors.status.success :
                            estado.estado_nombre === 'Cancelada' ? colors.status.warning : colors.primary.main
                        }}
                      >
                        {estado.cantidad}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {estado.estado_nombre}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        {totalReservas > 0 ? Math.round((estado.cantidad / totalReservas) * 100) : 0}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SeccionReservas;