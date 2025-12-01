// sections/SeccionPedidos.jsx
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
  Restaurant,
  Schedule,
  LocalShipping,
  TrendingUp
} from '@mui/icons-material';

// Chart.js
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Services
import dashboardService from '../services/dashboard.service';

// Colores
import colors from '../../../theme/colores';

const SeccionPedidos = ({ filtros, sucursalId }) => {
  const [estadosPedidos, setEstadosPedidos] = useState([]);
  const [pedidosPorHora, setPedidosPorHora] = useState([]);
  const [tiposPedidos, setTiposPedidos] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [topCombos, setTopCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    if (sucursalId) {
      cargarDatosPedidos();
    }
  }, [filtros, sucursalId, topN]);

  const cargarDatosPedidos = async () => {
    try {
      setLoading(true);
      
      const [resEstados, resHoras, resTipos, resProductos, resCombos] = await Promise.all([
        dashboardService.getEstadosPedidos({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId
        }),
        dashboardService.getPedidosPorHora({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId
        }),
        dashboardService.getTiposPedidos({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId
        }),
        dashboardService.getTopProductos({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId,
          top_n: topN
        }),
        dashboardService.getTopCombos({
          fecha_desde: filtros.fecha_desde,
          fecha_hasta: filtros.fecha_hasta,
          sucursal_id: sucursalId,
          top_n: topN
        })
      ]);
      
      setEstadosPedidos(resEstados.data.data || []);
      setPedidosPorHora(resHoras.data.data || []);
      setTiposPedidos(resTipos.data.data || []);
      setTopProductos(resProductos.data.data || []);
      setTopCombos(resCombos.data.data || []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos para gráfica de estados
  const datosEstados = {
    labels: estadosPedidos.map(item => item.estado_nombre),
    datasets: [{
      data: estadosPedidos.map(item => item.cantidad),
      backgroundColor: [
        colors.primary.main,
        colors.secondary.main,
        colors.status.success,
        colors.status.warning,
        colors.status.error,
        colors.accent.main
      ],
      borderWidth: 2,
      borderColor: colors.background.light
    }]
  };

  // Datos para gráfica de horas pico
  const datosHoras = {
    labels: pedidosPorHora.map(item => item.hora_display),
    datasets: [{
      label: 'Pedidos por Hora',
      data: pedidosPorHora.map(item => item.cantidad),
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.dark,
      borderWidth: 1
    }]
  };

  // Datos para gráfica de tipos de pedido
  const datosTipos = {
    labels: tiposPedidos.map(item => item.tipo_nombre),
    datasets: [{
      data: tiposPedidos.map(item => item.cantidad),
      backgroundColor: [colors.primary.main, colors.secondary.main],
      borderWidth: 2
    }]
  };

  // Datos para gráfica de top productos
  const datosTopProductos = {
    labels: topProductos.map(item => item.producto_nombre),
    datasets: [{
      label: 'Veces Pedido',
      data: topProductos.map(item => item.veces_pedido),
      backgroundColor: colors.status.success,
      borderColor: colors.status.success,
      borderWidth: 1
    }]
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: colors.text.secondary }}>Cargando datos de pedidos...</Typography>
      </Box>
    );
  }

  const totalPedidos = estadosPedidos.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.primary.main}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Restaurant sx={{ fontSize: 40, color: colors.primary.main, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.primary.main }}>
                {totalPedidos}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Total Pedidos
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
              <Schedule sx={{ fontSize: 40, color: colors.secondary.main, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.secondary.main }}>
                {pedidosPorHora.length > 0 ? 
                  pedidosPorHora.reduce((max, item) => item.cantidad > max.cantidad ? item : max).hora_display 
                  : '--:--'
                }
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Hora Pico
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
              <LocalShipping sx={{ fontSize: 40, color: colors.status.success, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.status.success }}>
                {tiposPedidos.find(t => t.tipo_nombre === 'Takeaway')?.cantidad || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Pedidos Takeaway
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
                {topProductos[0]?.veces_pedido || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Producto Más Pedido
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Selector de Top N */}
      <Paper sx={{ 
        p: 2, 
        backgroundColor: colors.background.paper,
        border: `1px solid ${colors.border.light}`
      }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: colors.text.primary }}>Mostrar Top</InputLabel>
          <Select
            value={topN}
            label="Mostrar Top"
            onChange={(e) => setTopN(e.target.value)}
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
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Gráficas */}
      <Grid container spacing={3}>
        
        {/* Estados de Pedidos - Dona */}
        <Grid size={{xs: 12, md: 6}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Estados de Pedidos
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut 
                data={datosEstados}
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

        {/* Tipos de Pedido - Pastel */}
        <Grid size={{xs: 12, md: 6}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Tipos de Pedido
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut 
                data={datosTipos}
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

        {/* Horas Pico - Barras */}
        <Grid size={{xs: 12, md: 6}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Pedidos por Hora del Día
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={datosHoras}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Top Productos - Barras Horizontales */}
        <Grid size={{xs: 12, md: 6}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Top {topN} Productos Más Pedidos
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={datosTopProductos}
                options={{
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Top Combos - Lista */}
        <Grid size={{xs: 12}}>
          <Paper sx={{ 
            p: 3, 
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border.light}`
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
              Top {topN} Combos Más Vendidos
            </Typography>
            <Grid container spacing={2}>
              {topCombos.map((combo, index) => (
                <Grid size={{xs: 12, sm: 6, md: 4}} key={combo.combo_id}>
                  <Card variant="outlined" sx={{ 
                    borderColor: colors.primary.light,
                    backgroundColor: colors.background.light
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: colors.primary.main,
                            minWidth: 30,
                            textAlign: 'center'
                          }}
                        >
                          #{index + 1}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.text.primary }}>
                          {combo.combo_nombre}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {combo.veces_pedido} pedidos
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {combo.cantidad_total} unidades
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

export default SeccionPedidos;