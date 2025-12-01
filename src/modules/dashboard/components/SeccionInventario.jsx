// sections/SeccionInventario.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Warning,
  Error,
  Schedule,
  Inventory
} from '@mui/icons-material';

// Services
import dashboardService from '../services/dashboard.service';

// Colores
import colors from '../../../theme/colores';

const SeccionInventario = ({ sucursalId }) => {
  const [tabActiva, setTabActiva] = useState(0);
  const [bajoStock, setBajoStock] = useState([]);
  const [lotesVencidos, setLotesVencidos] = useState([]);
  const [lotesPorVencer, setLotesPorVencer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sucursalId) {
      cargarDatosInventario();
    }
  }, [sucursalId]);

  const cargarDatosInventario = async () => {
    try {
      setLoading(true);
      
      const [resBajoStock, resVencidos, resPorVencer] = await Promise.all([
        dashboardService.getBajoStock(sucursalId),
        dashboardService.getLotesVencidos(sucursalId),
        dashboardService.getLotesPorVencer(sucursalId, 30)
      ]);
      
      setBajoStock(resBajoStock.data.data || []);
      setLotesVencidos(resVencidos.data.data || []);
      setLotesPorVencer(resPorVencer.data.data || []);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorUrgencia = (urgencia) => {
    switch (urgencia) {
      case 'critico': return colors.status.error;
      case 'alto': return colors.status.warning;
      case 'medio': return colors.status.info;
      default: return colors.text.disabled;
    }
  };

  const getIconoUrgencia = (urgencia) => {
    switch (urgencia) {
      case 'critico': return <Error />;
      case 'alto': return <Warning />;
      case 'medio': return <Schedule />;
      default: return <Inventory />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: colors.text.secondary }}>Cargando inventario...</Typography>
      </Box>
    );
  }

  const totalAlertas = bajoStock.length + lotesVencidos.length + lotesPorVencer.length;
  const perdidaTotal = lotesVencidos.reduce((total, lote) => total + (lote.costo_total_perdido || 0), 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Alertas Resumen */}
      {totalAlertas > 0 && (
        <Alert severity="warning" icon={<Warning />}
          sx={{ 
            backgroundColor: colors.status.warning + '20',
            border: `1px solid ${colors.status.warning}`
          }}
        >
          <Typography variant="h6" sx={{ color: colors.text.primary }}>
            {totalAlertas} Alertas de Inventario
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.primary }}>
            {bajoStock.length} productos con stock bajo • 
            {lotesVencidos.length} lotes vencidos • 
            {lotesPorVencer.length} lotes por vencer
          </Typography>
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.status.warning}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, color: colors.status.warning, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.status.warning }}>
                {bajoStock.length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Stock Bajo
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
              <Error sx={{ fontSize: 40, color: colors.status.error, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.status.error }}>
                {lotesVencidos.length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Lotes Vencidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card sx={{ 
            border: `2px solid ${colors.accent.main}`,
            backgroundColor: colors.background.paper
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: colors.accent.main, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.accent.main }}>
                {lotesPorVencer.length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Por Vencer
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
              <Inventory sx={{ fontSize: 40, color: colors.primary.main, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: colors.primary.main }}>
                ${perdidaTotal}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Pérdida Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para diferentes alertas */}
      <Paper sx={{ 
        backgroundColor: colors.background.paper,
        border: `1px solid ${colors.border.light}`
      }}>
        <Tabs
          value={tabActiva}
          onChange={(e, nuevoValor) => setTabActiva(nuevoValor)}
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
          <Tab label={`Stock Bajo (${bajoStock.length})`} />
          <Tab label={`Lotes Vencidos (${lotesVencidos.length})`} />
          <Tab label={`Por Vencer (${lotesPorVencer.length})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 1: Stock Bajo */}
          {tabActiva === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {bajoStock.length === 0 ? (
                <Typography sx={{ color: colors.status.success, textAlign: 'center', py: 4 }}>
                  ✅ Todo el stock está en niveles adecuados
                </Typography>
              ) : (
                bajoStock.map((producto) => (
                  <Box
                    key={producto.insumo_id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      border: `1px solid ${colors.status.warning}`,
                      borderRadius: 2,
                      backgroundColor: colors.status.warning + '10'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.text.primary }}>
                        {producto.insumo_nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Stock actual: {producto.cantidad_actual} | Mínimo: {producto.minimo_stock}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`Faltan ${producto.faltante}`} 
                      sx={{ 
                        backgroundColor: colors.status.warning,
                        color: colors.primary.contrastText
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>
          )}

          {/* Tab 2: Lotes Vencidos */}
          {tabActiva === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {lotesVencidos.length === 0 ? (
                <Typography sx={{ color: colors.status.success, textAlign: 'center', py: 4 }}>
                  ✅ No hay lotes vencidos
                </Typography>
              ) : (
                lotesVencidos.map((lote) => (
                  <Box
                    key={lote.lote_id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      border: `1px solid ${colors.status.error}`,
                      borderRadius: 2,
                      backgroundColor: colors.status.error + '10'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.text.primary }}>
                        {lote.insumo_nombre} - {lote.lote}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Vencido: {new Date(lote.fecha_caducidad).toLocaleDateString()} | 
                        Cantidad: {lote.cantidad_disponible}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip 
                        label="VENCIDO" 
                        sx={{ 
                          backgroundColor: colors.status.error,
                          color: colors.primary.contrastText,
                          mb: 1
                        }}
                      />
                      <Typography variant="subtitle2" sx={{ color: colors.status.error }}>
                        Pérdida: ${lote.costo_total_perdido}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}

          {/* Tab 3: Lotes por Vencer */}
          {tabActiva === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {lotesPorVencer.length === 0 ? (
                <Typography sx={{ color: colors.status.success, textAlign: 'center', py: 4 }}>
                  ✅ No hay lotes por vencer en los próximos 30 días
                </Typography>
              ) : (
                lotesPorVencer.map((lote) => (
                  <Box
                    key={lote.lote_id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      border: `1px solid ${getColorUrgencia(lote.urgencia)}`,
                      borderRadius: 2,
                      backgroundColor: getColorUrgencia(lote.urgencia) + '10'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getIconoUrgencia(lote.urgencia)}
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.text.primary }}>
                          {lote.insumo_nombre} - {lote.lote}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          Vence: {new Date(lote.fecha_caducidad).toLocaleDateString()} | 
                          Días: {lote.dias_para_vencer} | 
                          Cantidad: {lote.cantidad_disponible}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={lote.urgencia?.toUpperCase()} 
                      sx={{ 
                        backgroundColor: getColorUrgencia(lote.urgencia),
                        color: colors.primary.contrastText
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SeccionInventario;