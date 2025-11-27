import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  Update as UpdateIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import colors from '../../../theme/colores';
import CardCliente from './CardCliente';
import FiltrosMetricas from './FiltrosMetricas';

const ModalMetricas = ({ 
  open, 
  onClose, 
  onGenerarCampania,
  // ✅ TODAS LAS PROPS NECESARIAS
  tipoMetrica = 'clientes_vip',
  clientes = [],
  clientesSeleccionados = [],
  onSeleccionarCliente,
  loading = false,
  parametros = {},
  onParametrosChange,
  onCambioMetrica,
  tabActual = 0
}) => {
  const [tabLocal, setTabLocal] = useState(tabActual);

  const metricas = [
    { 
      key: 'clientes_vip',
      label: 'Clientes VIP', 
      icon: <StarIcon />,
      color: colors.status.warning,
      descripcion: 'Los clientes que más han gastado'
    },
    { 
      key: 'clientes_frecuentes',
      label: 'Clientes Frecuentes', 
      icon: <UpdateIcon />,
      color: colors.primary.main,
      descripcion: 'Clientes con más visitas y pedidos'
    },
    { 
      key: 'clientes_inactivos',
      label: 'Clientes Inactivos', 
      icon: <PersonAddIcon />,
      color: colors.status.error,
      descripcion: 'Clientes que no visitan hace tiempo'
    },
    { 
      key: 'clientes_nuevos',
      label: 'Clientes Nuevos', 
      icon: <TrendingUpIcon />,
      color: colors.status.success,
      descripcion: 'Clientes recién registrados'
    },
    { 
      key: 'clientes_por_canal',
      label: 'Por Canal', 
      icon: <CategoryIcon />,
      color: colors.secondary.main,
      descripcion: 'Segmentación por preferencia de canal'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabLocal(newValue);
    if (onCambioMetrica) {
      onCambioMetrica(newValue);
    }
  };

  const handleGenerarCampania = () => {
    if (clientesSeleccionados.length === 0) {
      toast.error('Selecciona al menos un cliente');
      return;
    }
    
    const metricaActual = metricas[tabLocal];
    
    // Generar datos automáticos para la campaña
    const codigo = generarCodigoCupon(metricaActual.key);
    const descuento = calcularDescuentoSugerido(metricaActual.key);
    const fechaVigencia = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días
    
    onGenerarCampania({
      clientesSeleccionados,
      tipoMetrica: metricaActual.key,
      nombre_campania: `Campaña ${metricaActual.label}`,
      codigo: codigo,
      porcentaje_desc: descuento,
      fecha_vigencia: fechaVigencia
    });
  };

  // Funciones auxiliares
  const generarCodigoCupon = (tipoMetrica) => {
    const prefijos = {
      clientes_vip: 'VIP',
      clientes_frecuentes: 'FREQ',
      clientes_inactivos: 'EXTR',
      clientes_nuevos: 'BIEN',
      clientes_por_canal: 'PREF'
    };
    const prefijo = prefijos[tipoMetrica] || 'CAMP';
    const numero = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefijo}${numero}`;
  };

  const calcularDescuentoSugerido = (tipoMetrica) => {
    const descuentos = {
      clientes_vip: 20,
      clientes_frecuentes: 15,
      clientes_inactivos: 25,
      clientes_nuevos: 10,
      clientes_por_canal: 15
    };
    return descuentos[tipoMetrica] || 10;
  };

  const metricaActual = metricas[tabLocal];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: colors.background.light,
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: colors.primary.main,
        color: colors.primary.contrastText,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CampaignIcon />
          <Typography variant="h6" component="div" fontWeight="bold">
            Crear Campaña desde Métricas
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
          sx={{ color: colors.primary.contrastText }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', height: '500px' }}>
        {/* Tabs de Métricas */}
        <Tabs 
          value={tabLocal} 
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {metricas.map((metrica, index) => (
            <Tab 
              key={metrica.key}
              label={metrica.label}
              icon={metrica.icon}
              iconPosition="start"
              sx={{ 
                minHeight: 64,
                color: colors.text.primary,
                '&.Mui-selected': {
                  color: metrica.color
                }
              }}
            />
          ))}
        </Tabs>

        {/* Descripción de la Métrica */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" color={colors.text.primary}>
            {metricaActual.label}
          </Typography>
          <Typography variant="body2" color={colors.text.secondary}>
            {metricaActual.descripcion}
          </Typography>
        </Box>

        {/* Filtros Específicos */}
        {onParametrosChange && (
          <FiltrosMetricas
            tipoMetrica={metricaActual.key}
            parametros={parametros}
            onParametrosChange={onParametrosChange}
            totalClientes={clientes.length}
          />
        )}

        {/* Contador de Selección */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={`${clientesSeleccionados.length} seleccionados`}
            color="primary"
            variant="outlined"
          />
          <Typography variant="body2" color={colors.text.secondary}>
            de {clientes.length} clientes encontrados
          </Typography>
        </Box>

        {/* Lista de Clientes */}
        <Box sx={{ flex: 1, overflow: 'auto', minHeight: 300 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography variant="body2" color={colors.text.secondary}>
                Cargando clientes {metricaActual.label.toLowerCase()}...
              </Typography>
            </Box>
          ) : clientes.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {React.cloneElement(metricaActual.icon, { 
                sx: { fontSize: 48, color: colors.text.secondary, mb: 2 } 
              })}
              <Typography variant="h6" color={colors.text.secondary}>
                No se encontraron clientes
              </Typography>
              <Typography variant="body2" color={colors.text.secondary}>
                Ajusta los filtros o intenta con otra métrica
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {clientes.map((cliente) => (
                <Grid item size={{xs: 12}} key={cliente.id_usuario}>
                  <CardCliente
                    cliente={cliente}
                    seleccionado={clientesSeleccionados.some(c => c.id_usuario === cliente.id_usuario)}
                    onSeleccionar={onSeleccionarCliente}
                    tipoMetrica={metricaActual.key}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${colors.border.light}` }}>
        <Button 
          onClick={onClose}
          sx={{
            color: colors.text.secondary,
            '&:hover': {
              color: colors.primary.main
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={handleGenerarCampania}
          disabled={clientesSeleccionados.length === 0 || loading}
          startIcon={<CampaignIcon />}
          sx={{
            bgcolor: colors.primary.main,
            '&:hover': {
              bgcolor: colors.primary.dark
            },
            '&:disabled': {
              bgcolor: colors.text.disabled
            }
          }}
        >
          Crear Campaña ({clientesSeleccionados.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalMetricas;