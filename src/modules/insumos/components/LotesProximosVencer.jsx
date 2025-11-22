// LotesProximosVencer.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider
} from '@mui/material';
import { Warning, Error, Info } from '@mui/icons-material';
import insumosService from '../services/insumos.service';
import colors from '../../../theme/colores';

const LotesProximosVencer = () => {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diasProximidad, setDiasProximidad] = useState(30);
  const [sucursalId, setSucursalId] = useState('');

  // Obtener sucursal del localStorage
  useEffect(() => {
    const sucursal = localStorage.getItem('sucursalId');
    if (sucursal) {
      setSucursalId(parseInt(sucursal, 10));
    }
  }, []);

  const cargarLotes = async () => {
    if (!sucursalId) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await insumosService.getLotesProximosVencer(diasProximidad, sucursalId);
      if (data && data.success) {
        setLotes(data.data || []);
      } else {
        setLotes([]);
      }
    } catch (err) {
      console.error('Error cargando lotes próximos a vencer:', err);
      setError('Error al cargar los lotes próximos a vencer');
      setLotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sucursalId) {
      cargarLotes();
    }
  }, [sucursalId, diasProximidad]);

  // Función para obtener color según urgencia
  const getColorUrgencia = (urgencia) => {
    switch (urgencia) {
      case 'Crítica':
        return colors.status.error;
      case 'Alta':
        return colors.status.warning;
      case 'Media':
        return colors.status.info;
      case 'Baja':
        return colors.status.success;
      default:
        return colors.text.disabled;
    }
  };

  // Función para obtener icono según urgencia
  const getIconoUrgencia = (urgencia) => {
    switch (urgencia) {
      case 'Crítica':
        return <Error />;
      case 'Alta':
        return <Warning />;
      default:
        return <Info />;
    }
  };

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'No disponible';
    try {
      return new Date(fechaString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fechaString;
    }
  };

  if (!sucursalId) {
    return (
      <Alert severity="warning">
        No se ha configurado la sucursal. Selecciona una sucursal primero.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header refinado */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: colors.background.paper,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h4" fontWeight="bold" color={colors.text.primary}>
              Lotes Próximos a Vencer
            </Typography>
            <Typography variant="body2" color={colors.text.secondary} sx={{ mt: 1 }}>
              Control preventivo por fechas de caducidad
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} textAlign={{ xs: 'left', sm: 'right' }} sx={{}}>
            <FormControl fullWidth>
              <InputLabel>Días de proximidad</InputLabel>
              <Select
                value={diasProximidad}
                onChange={(e) => setDiasProximidad(e.target.value)}
                label="Días de proximidad"
              >
                <MenuItem value={7}>7 días</MenuItem>
                <MenuItem value={15}>15 días</MenuItem>
                <MenuItem value={30}>30 días</MenuItem>
                <MenuItem value={60}>60 días</MenuItem>
                <MenuItem value={90}>90 días</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Estado de carga */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Sin lotes */}
      {!loading && !error && lotes.length === 0 && (
        <Alert severity="success">
          No hay lotes próximos a vencer en los próximos {diasProximidad} días.
        </Alert>
      )}

      {/* Lotes */}
      {!loading && lotes.length > 0 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            Se encontraron {lotes.length} lote(s) próximo(s) a vencer.
          </Alert>

          <Grid container spacing={3}>
            {lotes.map((lote, index) => (
              <Grid size={{xs:12, md:6, lg:4}} key={lote.id_lote || index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    borderLeft: `6px solid ${getColorUrgencia(lote.urgencia)}`,
                    transition: '0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {lote.insumo_nombre}
                      </Typography>

                      <Chip
                        icon={getIconoUrgencia(lote.urgencia)}
                        label={lote.urgencia}
                        size="small"
                        sx={{
                          backgroundColor: getColorUrgencia(lote.urgencia),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    {/* Info */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Lote:</strong> {lote.lote || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Lote Proveedor:</strong> {lote.lote_proveedor || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Fecha Caducidad:</strong> {formatearFecha(lote.fecha_caducidad)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color:
                            lote.dias_para_vencer <= 7
                              ? colors.status.error
                              : colors.text.secondary,
                          fontWeight: lote.dias_para_vencer <= 7 ? 'bold' : 'normal'
                        }}
                      >
                        <strong>Días para vencer:</strong> {lote.dias_para_vencer}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Stock */}
                    <Grid container spacing={2}>
                      <Grid size={{xs:6}}>
                        <Typography variant="body2" align="center">
                          <strong>Disponible</strong>
                        </Typography>
                        <Typography
                          variant="h5"
                          align="center"
                          color={colors.primary.main}
                          fontWeight="bold"
                        >
                          {lote.cantidad_disponible} {lote.unidad_clave}
                        </Typography>
                      </Grid>

                      <Grid sizw={{xs:6}}>
                        <Typography variant="body2" align="center">
                          <strong>Costo Total</strong>
                        </Typography>
                        <Typography variant="h5" align="center" fontWeight="bold">
                          ${lote.costo_total?.toLocaleString('es-MX') || '0'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default LotesProximosVencer;
