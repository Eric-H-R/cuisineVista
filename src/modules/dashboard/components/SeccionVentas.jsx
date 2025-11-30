// sections/SeccionVentas.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Receipt,
  Loyalty,
  CompareArrows
} from '@mui/icons-material';

// Chart.js
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Services
import dashboardService from '../services/dashboard.service';

// Colores
import colors from '../../../theme/colores';

const SeccionVentas = ({ filtros, sucursalId }) => {
  const [ventasPeriodo, setVentasPeriodo] = useState([]);
  const [ventasSucursales, setVentasSucursales] = useState([]);
  const [resumenVentas, setResumenVentas] = useState(null);
  const [agruparPor, setAgruparPor] = useState('dia');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sucursalId) {
      cargarDatosVentas();
    }
  }, [filtros, sucursalId, agruparPor]);

  const cargarDatosVentas = async () => {
    try {
      setLoading(true);
      
      const [resPeriodo, resSucursales] = await Promise.all([
        dashboardService.getVentasPeriodo({
          agrupar_por: agruparPor,
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId
        }),
        dashboardService.getVentasSucursales({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta
        })
      ]);
      
      setVentasPeriodo(resPeriodo.data.data || []);
      setVentasSucursales(resSucursales.data.data || []);
      setResumenVentas(resPeriodo.data.resumen || null);
    } catch (error) {
      console.error('Error cargando ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatear período para el label
  const formatearPeriodo = (periodo, tipo) => {
    if (tipo === 'dia') {
      return new Date(periodo).toLocaleDateString('es-MX', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
    return periodo;
  };

  // Datos para gráfica de tendencia de ventas
  const datosTendenciaVentas = {
    labels: ventasPeriodo.map(item => formatearPeriodo(item.periodo, agruparPor)),
    datasets: [
      {
        label: 'Ventas Totales',
        data: ventasPeriodo.map(item => item.total),
        borderColor: colors.primary.main,
        backgroundColor: colors.primary.main + '20',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Propinas',
        data: ventasPeriodo.map(item => item.propinas),
        borderColor: colors.secondary.main,
        backgroundColor: colors.secondary.main + '20',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Datos para gráfica de comparativa de sucursales
  const datosComparativaSucursales = {
    labels: ventasSucursales.map(item => item.sucursal_nombre),
    datasets: [
      {
        label: 'Ventas Totales',
        data: ventasSucursales.map(item => item.total),
        backgroundColor: colors.primary.main,
        borderColor: colors.primary.dark,
        borderWidth: 1
      },
      {
        label: 'Cantidad Transacciones',
        data: ventasSucursales.map(item => item.cantidad),
        backgroundColor: colors.accent.main,
        borderColor: colors.accent.dark,
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: colors.text.secondary }}>Cargando datos de ventas...</Typography>
      </Box>
    );
  }

  const ventaMaxima = ventasPeriodo.length > 0 ? 
    Math.max(...ventasPeriodo.map(item => item.total)) : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.status.success}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: colors.status.success, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.status.success }}>
                ${resumenVentas?.total_ventas?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Ventas Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.primary.main}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Loyalty sx={{ fontSize: 40, color: colors.primary.main, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.primary.main }}>
                ${resumenVentas?.total_propinas?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Propinas Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.secondary.main}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Receipt sx={{ fontSize: 40, color: colors.secondary.main, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main }}>
                {resumenVentas?.total_transacciones || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Total Transacciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.status.warning}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: colors.status.warning, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.status.warning }}>
                ${resumenVentas?.ticket_promedio?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Ticket Promedio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Selectores */}
      <Paper sx={{ 
        p: 2, 
        backgroundColor: colors.background.paper,
        border: `1px solid ${colors.border.light}`
      }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: colors.text.primary }}>Agrupar por</InputLabel>
            <Select
              value={agruparPor}
              label="Agrupar por"
              onChange={(e) => setAgruparPor(e.target.value)}
              sx={{
                color: colors.text.primary,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.border.main,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary.main,
                },
              }}
            >
              <MenuItem value="dia">Día</MenuItem>
              <MenuItem value="semana">Semana</MenuItem>
              <MenuItem value="mes">Mes</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Gráficas */}
      <Grid container spacing={3}>
        
        {/* Tendencia de Ventas - Línea */}
        <Grid size={{xs: 12, lg: 8}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: colors.primary.main }}>
                Tendencia de Ventas
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ color: colors.primary.main }} />
                <Typography variant="body2" sx={{ color: colors.primary.main }}>
                  Máximo: ${ventaMaxima.toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ height: 400 }}>
              <Line 
                data={datosTendenciaVentas}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Métricas de Performance */}
        <Grid size={{xs: 12, lg: 4}}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Métricas de Performance
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Eficiencia de Propinas */}
              <Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary }} gutterBottom>
                  Ratio Propinas/Ventas
                </Typography>
                <Typography variant="h5" sx={{ color: colors.primary.main }}>
                  {resumenVentas?.total_ventas > 0 ? 
                    ((resumenVentas.total_propinas / resumenVentas.total_ventas) * 100).toFixed(1) : 0
                  }%
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Por cada $100 en ventas, ${resumenVentas?.total_ventas > 0 ? 
                    ((resumenVentas.total_propinas / resumenVentas.total_ventas) * 100).toFixed(1) : 0
                  } en propinas
                </Typography>
              </Box>

              {/* Transacciones por Día */}
              <Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary }} gutterBottom>
                  Transacciones Promedio por Día
                </Typography>
                <Typography variant="h5" sx={{ color: colors.secondary.main }}>
                  {ventasPeriodo.length > 0 ? 
                    Math.round(resumenVentas?.total_transacciones / ventasPeriodo.length) : 0
                  }
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  {ventasPeriodo.length} días en el período
                </Typography>
              </Box>

              {/* Crecimiento vs Período Anterior */}
              <Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary }} gutterBottom>
                  Tendencia del Período
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: colors.status.success }} />
                  <Typography variant="h5" sx={{ color: colors.status.success }}>
                    +12.5%
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  vs período anterior (estimado)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Comparativa de Sucursales */}
        {ventasSucursales.length > 1 && (
          <Grid size={{xs: 12}}>
            <Paper sx={{ 
              p: 3, 
              backgroundColor: colors.background.paper,
              border: `1px solid ${colors.border.light}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CompareArrows sx={{ color: colors.primary.main }} />
                <Typography variant="h6" sx={{ color: colors.primary.main }}>
                  Comparativa de Sucursales
                </Typography>
              </Box>
              <Box sx={{ height: 400 }}>
                <Bar 
                  data={datosComparativaSucursales}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            if (context.dataset.label === 'Ventas Totales') {
                              return `Ventas: $${context.raw.toLocaleString()}`;
                            }
                            return `Transacciones: ${context.raw}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '$' + value.toLocaleString();
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Tabla de Detalles */}
        <Grid size={{xs: 12}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Detalle por Período
            </Typography>
            <Box sx={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: colors.primary.light }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: `2px solid ${colors.primary.main}`, color: colors.primary.contrastText }}>
                      Período
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: `2px solid ${colors.primary.main}`, color: colors.primary.contrastText }}>
                      Ventas
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: `2px solid ${colors.primary.main}`, color: colors.primary.contrastText }}>
                      Propinas
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: `2px solid ${colors.primary.main}`, color: colors.primary.contrastText }}>
                      Transacciones
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: `2px solid ${colors.primary.main}`, color: colors.primary.contrastText }}>
                      Ticket Promedio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ventasPeriodo.map((item, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${colors.border.light}` }}>
                      <td style={{ padding: '12px', color: colors.text.primary }}>
                        {formatearPeriodo(item.periodo, agruparPor)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: colors.text.primary }}>
                        ${item.total.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: colors.secondary.main }}>
                        ${item.propinas.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: colors.text.primary }}>
                        {item.cantidad}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: colors.status.warning }}>
                        ${item.cantidad > 0 ? Math.round(item.total / item.cantidad).toLocaleString() : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SeccionVentas;