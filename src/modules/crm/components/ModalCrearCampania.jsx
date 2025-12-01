import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Tabs,
  Tab,
  LinearProgress,
  Checkbox,
  Card,
  CardContent,
  Slider // ← Agregar Slider aquí
} from '@mui/material';
import {
  Close as CloseIcon,
  Campaign as CampaignIcon,
  Discount as DiscountIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Update as UpdateIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import colors from '../../../theme/colores';
import { generarCodigoCupon } from '../../../utils/campanias-utils';
import campaniasService from '../services/campanias.service';

const ModalCrearCampania = ({ open, onClose, onCrearCampania }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    nombre_campania: '',
    codigo: '',
    porcentaje_desc: 10,
    fecha_vigencia: null,
    cliente_ids: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Estados para la segmentación
  const [tipoMetrica, setTipoMetrica] = useState('clientes_vip');
  const [clientes, setClientes] = useState([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [parametrosMetrica, setParametrosMetrica] = useState({
    top_n: 20,
    dias_sin_comprar: 30,
    dias_registro: 30
  });

  const metricas = [
    { 
      key: 'clientes_vip',
      label: 'Clientes VIP', 
      icon: <StarIcon />,
      descripcion: 'Los clientes que más han gastado'
    },
    { 
      key: 'clientes_frecuentes',
      label: 'Clientes Frecuentes', 
      icon: <UpdateIcon />,
      descripcion: 'Clientes con más visitas y pedidos'
    },
    { 
      key: 'clientes_inactivos',
      label: 'Clientes Inactivos', 
      icon: <PersonAddIcon />,
      descripcion: 'Clientes que no visitan hace tiempo'
    },
    { 
      key: 'clientes_nuevos',
      label: 'Clientes Nuevos', 
      icon: <TrendingUpIcon />,
      descripcion: 'Clientes recién registrados'
    },
    { 
      key: 'clientes_por_canal',
      label: 'Por Canal', 
      icon: <CategoryIcon />,
      descripcion: 'Segmentación por preferencia de canal'
    }
  ];

  // Cargar clientes cuando cambia la métrica o parámetros
  useEffect(() => {
    if (activeTab === 0) {
      cargarClientesPorMetrica();
    }
  }, [tipoMetrica, parametrosMetrica, activeTab]);

  const cargarClientesPorMetrica = async () => {
    try {
      setLoadingClientes(true);
      let response;

      switch (tipoMetrica) {
        case 'clientes_vip':
          response = await campaniasService.getClientesVIP(parametrosMetrica.top_n);
          break;
        case 'clientes_frecuentes':
          response = await campaniasService.getClientesFrecuentes(parametrosMetrica.top_n);
          break;
        case 'clientes_inactivos':
          response = await campaniasService.getClientesInactivos(parametrosMetrica.dias_sin_comprar);
          break;
        case 'clientes_nuevos':
          response = await campaniasService.getClientesNuevos(parametrosMetrica.dias_registro);
          break;
        case 'clientes_por_canal':
          response = await campaniasService.getClientesPorCanal();
          break;
        default:
          return;
      }

      setClientes(response.data.clientes || []);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setClientes([]);
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleSeleccionarCliente = (cliente) => {
    setClientesSeleccionados(prev => {
      const existe = prev.find(c => c.id_usuario === cliente.id_usuario);
      if (existe) {
        return prev.filter(c => c.id_usuario !== cliente.id_usuario);
      } else {
        return [...prev, cliente];
      }
    });
  };

  const handleParametrosChange = (parametro, valor) => {
    setParametrosMetrica(prev => ({
      ...prev,
      [parametro]: valor
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre_campania.trim()) {
      newErrors.nombre_campania = 'El nombre de la campaña es requerido';
    }
    
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código de la campaña es requerido';
    }
    
    if (!formData.porcentaje_desc || formData.porcentaje_desc <= 0) {
      newErrors.porcentaje_desc = 'El porcentaje debe ser mayor a 0';
    }
    
    if (!formData.fecha_vigencia) {
      newErrors.fecha_vigencia = 'La fecha de vigencia es requerida';
    }
    
    if (clientesSeleccionados.length === 0) {
      newErrors.clientes = 'Debe seleccionar al menos un cliente';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCrearCampania = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const campaniaData = {
        ...formData,
        fecha_vigencia: formData.fecha_vigencia.toISOString(),
        cliente_ids: clientesSeleccionados.map(c => c.id_usuario)
      };

      await onCrearCampania(campaniaData);
      handleClose();
    } catch (error) {
      console.error('Error creando campaña:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre_campania: '',
      codigo: '',
      porcentaje_desc: 10,
      fecha_vigencia: null,
      cliente_ids: []
    });
    setClientesSeleccionados([]);
    setTipoMetrica('clientes_vip');
    setActiveTab(0);
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderFiltros = () => {
    const metricaActual = metricas.find(m => m.key === tipoMetrica);
    
    if (tipoMetrica === 'clientes_vip' || tipoMetrica === 'clientes_frecuentes') {
      return (
        <FormControl fullWidth size="small">
          <InputLabel>Top N clientes</InputLabel>
          <Select
            value={parametrosMetrica.top_n}
            label="Top N clientes"
            onChange={(e) => handleParametrosChange('top_n', e.target.value)}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
            <MenuItem value={50}>Top 50</MenuItem>
          </Select>
        </FormControl>
      );
    }
    
    if (tipoMetrica === 'clientes_inactivos') {
      return (
        <Box>
          <Typography variant="body2" gutterBottom>
            Días sin comprar: {parametrosMetrica.dias_sin_comprar}
          </Typography>
          <Slider
            value={parametrosMetrica.dias_sin_comprar}
            onChange={(e, newValue) => handleParametrosChange('dias_sin_comprar', newValue)}
            min={7}
            max={180}
            step={7}
            valueLabelDisplay="auto"
          />
        </Box>
      );
    }
    
    if (tipoMetrica === 'clientes_nuevos') {
      return (
        <Box>
          <Typography variant="body2" gutterBottom>
            Días desde registro: {parametrosMetrica.dias_registro}
          </Typography>
          <Slider
            value={parametrosMetrica.dias_registro}
            onChange={(e, newValue) => handleParametrosChange('dias_registro', newValue)}
            min={1}
            max={90}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
      );
    }
    
    return null;
  };

  const renderCardCliente = (cliente) => {
    const seleccionado = clientesSeleccionados.some(c => c.id_usuario === cliente.id_usuario);
    
    return (
      <Card 
        key={cliente.id_usuario}
        sx={{ 
          cursor: 'pointer',
          border: seleccionado ? `2px solid ${colors.primary.main}` : `1px solid ${colors.border.light}`,
          mb: 1
        }}
        onClick={() => handleSeleccionarCliente(cliente)}
      >
        <CardContent sx={{ py: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Checkbox checked={seleccionado} />
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {cliente.nombre_completo}
            </Typography>
            <Typography variant="body2" color={colors.text.secondary}>
              {cliente.email} • {cliente.telefono}
            </Typography>
          </Box>
          <Chip 
            label={cliente.segmento}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={handleClose}
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
              Crear Nueva Campaña
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose}
            sx={{ color: colors.primary.contrastText }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', height: '500px' }}>
          {/* Tabs principales */}
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="1. Segmentación" />
            <Tab label="2. Configuración" disabled={clientesSeleccionados.length === 0} />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Selección de métrica */}
              <FormControl fullWidth>
                <InputLabel>Seleccionar tipo de clientes</InputLabel>
                <Select
                  value={tipoMetrica}
                  label="Seleccionar tipo de clientes"
                  onChange={(e) => setTipoMetrica(e.target.value)}
                >
                  {metricas.map(metrica => (
                    <MenuItem key={metrica.key} value={metrica.key}>
                      {metrica.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Descripción */}
              <Typography variant="body2" color={colors.text.secondary}>
                {metricas.find(m => m.key === tipoMetrica)?.descripcion}
              </Typography>

              {/* Filtros */}
              {renderFiltros()}

              {/* Contador */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={`${clientesSeleccionados.length} seleccionados`}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color={colors.text.secondary}>
                  de {clientes.length} clientes encontrados
                </Typography>
              </Box>

              {/* Lista de clientes */}
              <Box sx={{ flex: 1, overflow: 'auto', border: `1px solid ${colors.border.light}`, borderRadius: 1, p: 1 }}>
                {loadingClientes ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <LinearProgress sx={{ mb: 2 }} />
                    <Typography variant="body2" color={colors.text.secondary}>
                      Cargando clientes...
                    </Typography>
                  </Box>
                ) : clientes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color={colors.text.secondary}>
                      No se encontraron clientes
                    </Typography>
                  </Box>
                ) : (
                  clientes.map(renderCardCliente)
                )}
              </Box>

              {errors.clientes && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.clientes}
                </Alert>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item size={{xs: 12}}>
                <Alert severity="info">
                  <Typography variant="body2">
                    Configura los detalles de la campaña para {clientesSeleccionados.length} cliente{clientesSeleccionados.length !== 1 ? 's' : ''} seleccionado{clientesSeleccionados.length !== 1 ? 's' : ''}
                  </Typography>
                </Alert>
              </Grid>

              <Grid item size={{xs: 12}}>
                <TextField
                  label="Nombre de la Campaña *"
                  value={formData.nombre_campania}
                  onChange={(e) => handleChange('nombre_campania', e.target.value)}
                  fullWidth
                  error={!!errors.nombre_campania}
                  helperText={errors.nombre_campania}
                />
              </Grid>

              <Grid item size={{xs: 12, sm: 6}}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  <TextField
                    label="Código del Cupón *"
                    value={formData.codigo}
                    onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
                    fullWidth
                    error={!!errors.codigo}
                    helperText={errors.codigo}
                  />
                  <Button
                    size="small"
                    onClick={() => handleChange('codigo', generarCodigoCupon(tipoMetrica))}
                    sx={{ mb: 0.5 }}
                  >
                    Generar
                  </Button>
                </Box>
              </Grid>

              <Grid item size={{xs: 12, sm: 6}}>
                <TextField
                  label="Porcentaje de Descuento *"
                  value={formData.porcentaje_desc}
                  onChange={(e) => handleChange('porcentaje_desc', parseFloat(e.target.value) || 0)}
                  fullWidth
                  type="number"
                  error={!!errors.porcentaje_desc}
                  helperText={errors.porcentaje_desc}
                />
              </Grid>

              <Grid item size={{xs: 12}}>
                <DatePicker
                  label="Fecha de Vigencia *"
                  value={formData.fecha_vigencia}
                  onChange={(newValue) => handleChange('fecha_vigencia', newValue)}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.fecha_vigencia,
                      helperText: errors.fecha_vigencia
                    }
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          {activeTab === 0 ? (
            <Button 
              variant="contained" 
              onClick={() => setActiveTab(1)}
              disabled={clientesSeleccionados.length === 0}
            >
              Continuar a Configuración ({clientesSeleccionados.length})
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleCrearCampania}
              disabled={loading}
              startIcon={<CampaignIcon />}
            >
              {loading ? 'Creando...' : 'Crear Campaña'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ModalCrearCampania;