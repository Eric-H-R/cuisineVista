import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import FormularioCompras from '../components/FormularioCompras';
import FormularioRecepcion from '../components/FormularioRecepcion';
import CardCompra from '../components/CardCompra';
import CardRecepcion from '../components/CardRecepcion';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';

// TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API 
import comprasService from '../services/compras.service';
import recepcionesService from '../../recepciones/services/recepciones.service'; // SERVICIO CORREGIDO
import colors from '../../../theme/colores';

// Mapeo de estatus numéricos a texto
const MAPEO_ESTATUS = {
  1: 'Registrada',
  2: 'Inventariada', 
  3: 'Cancelada'
};

// Mapeo de estatus para recepciones
const MAPEO_ESTATUS_RECEPCION = {
  1: 'Activa',
  2: 'Procesada', 
  3: 'Cancelada'
};

const Compras = () => {
  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState([]);
  const [recepciones, setRecepciones] = useState([]); // NUEVO STATE
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sucursalId, setSucursalId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Obtener sucursal_id del localStorage al cargar
  useEffect(() => {
    const sucursal = localStorage.getItem('sucursalId');
    
    if (sucursal) {
      const sucursalIdNum = parseInt(sucursal, 10);
      
      if (!isNaN(sucursalIdNum)) {
        setSucursalId(sucursalIdNum);
        loadCompras(sucursalIdNum);
        loadRecepciones(sucursalIdNum);
      } else {
        toast.error('ID de sucursal inválido');
        setLoading(false);
      }
    } else {
      toast.error('No se encontró la sucursal en el sistema');
      setLoading(false);
    }
  }, []);

  const loadCompras = async (sucursalId) => {
    try {
      setLoading(true);
      const { data } = await comprasService.getBySucursal(sucursalId);
      
      if (data && data.success && Array.isArray(data.data)) {
        setCompras(data.data);
      } else {
        setCompras([]);
        toast.warning('No se pudieron cargar las compras');
      }
    } catch (error) {
      console.error('Error al cargar compras:', error);
      toast.error('Error cargando las compras');
    } finally {
      setLoading(false);
    }
  };

  // NUEVA FUNCIÓN: Cargar recepciones
  const loadRecepciones = async (sucursalId) => {
    try {
      setLoading(true);
      const { data } = await recepcionesService.getAllRecepciones(sucursalId);
      
      if (data && data.success && Array.isArray(data.data)) {
        setRecepciones(data.data);
      } else {
        setRecepciones([]);
        toast.warning('No se pudieron cargar las recepciones');
      }
    } catch (error) {
      console.error('Error al cargar recepciones:', error);
      toast.error('Error cargando las recepciones');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCompra = () => {
    setOpenModal(true);
  };

  const [openRecepcionForm, setOpenRecepcionForm] = useState(false);
  const [recepcionCompraId, setRecepcionCompraId] = useState(null);
  const handleOpenRecepcionForm = () => setOpenRecepcionForm(true);
  const handleCloseRecepcionForm = () => setOpenRecepcionForm(false);

  const handleOpenRecepcionFormWithCompra = (compraId) => {
    setRecepcionCompraId(compraId);
    setOpenRecepcionForm(true);
  };

  const handleSaveRecepcion = async (payload) => {
    try {
      setLoading(true);
      await recepcionesService.createRecepcion(payload);
      toast.success('Recepción registrada correctamente');
      handleCloseRecepcionForm();
      loadCompras(sucursalId);
      loadRecepciones(sucursalId); // RECARGAR RECEPCIONES DESPUÉS DE CREAR
    } catch (error) {
      console.error('Error guardando recepción:', error);
      const errorMessage = error.response?.data?.message || 'Error guardando la recepción';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // NUEVA FUNCIÓN: Cancelar recepción
  const handleCancelarRecepcion = (recepcion) => {
    setConfirmDialog({
      open: true,
      title: 'Cancelar Recepción',
      message: `¿Estás seguro de que deseas cancelar la recepción #${recepcion.id_recepcion}? Esta acción no se puede deshacer.`,
      onConfirm: () => confirmarCancelarRecepcion(recepcion)
    });
  };

  const confirmarCancelarRecepcion = async (recepcion) => {
    try {
      setLoading(true);
      const data = { revertir_compra: true }; // Datos según tu API
      await recepcionesService.cancelarRecepcion(recepcion.id_recepcion, data);
      toast.success('Recepción cancelada correctamente');
      loadRecepciones(sucursalId); // Recargar recepciones
      loadCompras(sucursalId); // Recargar compras por si afecta el estado
    } catch (error) {
      console.error('Error cancelando recepción:', error);
      const errorMessage = error.response?.data?.message || 'Error cancelando la recepción';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      handleCloseConfirmDialog();
    }
  };

  const handleVerDetalleRecepcion = (recepcion) => {
    toast.info(`Detalle de recepción #${recepcion.id_recepcion} - Próximamente`);
  };

  const handleSaveCompra = async (compraData) => {
    try {
      setLoading(true);
      
      const datosCompleta = {
        ...compraData,
        sucursal_id: sucursalId
      };
      
      await comprasService.create(datosCompleta);
      toast.success('Compra registrada correctamente');
      
      setOpenModal(false);
      loadCompras(sucursalId);
    } catch (error) {
      console.error('Error guardando compra:', error);
      const errorMessage = error.response?.data?.message || 'Error guardando la compra';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarCompra = (compra) => {
    setConfirmDialog({
      open: true,
      title: 'Cancelar Compra',
      message: `¿Estás seguro de que deseas cancelar la compra ${compra.folio || `#${compra.id_compra || compra.id}`}? Esta acción no se puede deshacer.`,
      onConfirm: () => confirmarCancelarCompra(compra)
    });
  };

  const confirmarCancelarCompra = async (compra) => {
    try {
      setLoading(true);
      await comprasService.cancelar(compra.id_compra || compra.id);
      toast.success('Compra cancelada correctamente');
      loadCompras(sucursalId);
      loadRecepciones(sucursalId); // Recargar recepciones por si hay cambios
    } catch (error) {
      console.error('Error cancelando compra:', error);
      const errorMessage = error.response?.data?.message || 'Error cancelando la compra';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      handleCloseConfirmDialog();
    }
  };

  // Función para cerrar el diálogo de confirmación
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

  // Función para obtener el texto del estatus
  const getEstatusTexto = (estatusNumero) => {
    return MAPEO_ESTATUS[estatusNumero] || 'desconocido';
  };

  // Función para verificar si está cancelada
  const esCancelada = (compra) => {
    return compra.estatus === 3; // 3 = Cancelada
  };

  // Función para verificar si está inventariada
  const esInventariada = (compra) => {
    return compra.estatus === 2; // 2 = Inventariada
  };

  // Función para verificar si está registrada
  const esRegistrada = (compra) => {
    return compra.estatus === 1; // 1 = Registrada
  };

  // NUEVAS FUNCIONES PARA RECEPCIONES
  const esRecepcionActiva = (recepcion) => {
    return recepcion.estatus === 1; // 1 = Activa
  };

  const esRecepcionProcesada = (recepcion) => {
    return recepcion.estatus === 2; // 2 = Procesada
  };

  const esRecepcionCancelada = (recepcion) => {
    return recepcion.estatus === 3; // 3 = Cancelada
  };

  // Filtrar compras según pestaña activa y búsqueda
  const filteredCompras = useMemo(() => {
    let dataToFilter = compras;

    // Filtrar por estado según la pestaña
    switch (activeTab) {
      case 1: // Registradas
        dataToFilter = compras.filter(compra => esRegistrada(compra));
        break;
      case 2: // Inventariadas
        dataToFilter = compras.filter(compra => esInventariada(compra));
        break;
      case 3: // Canceladas
        dataToFilter = compras.filter(compra => esCancelada(compra));
        break;
      default: // Todas
        dataToFilter = compras;
    }

    // Aplicar búsqueda
    return dataToFilter.filter(compra => {
      const estatusTexto = getEstatusTexto(compra.estatus);
      return searchTerm === '' || 
        compra.proveedor_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (compra.folio && compra.folio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        `#${compra.id_compra || compra.id}`.includes(searchTerm) ||
        estatusTexto.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [compras, searchTerm, activeTab]);

  // NUEVO: Filtrar recepciones según pestaña activa y búsqueda
  const filteredRecepciones = useMemo(() => {
    if (activeTab < 4) return []; // Solo mostrar recepciones en pestañas 4-7

    let dataToFilter = recepciones;

  // Filtrar por estado según la pestaña - CORREGIDO
    switch (activeTab) {
      case 4: // Todas las recepciones
        dataToFilter = recepciones;
        break;
      case 5: // Activas
        dataToFilter = recepciones.filter(recepcion => esRecepcionActiva(recepcion));
        break;
      case 6: // Procesadas
        dataToFilter = recepciones.filter(recepcion => esRecepcionProcesada(recepcion));
        break;
      case 7: // Canceladas
        dataToFilter = recepciones.filter(recepcion => esRecepcionCancelada(recepcion));
        break;
      default: // Todas las recepciones
        dataToFilter = recepciones;
    }

    // Aplicar búsqueda
    return dataToFilter.filter(recepcion => {
      const estatusTexto = MAPEO_ESTATUS_RECEPCION[recepcion.estatus] || 'desconocido';
      return searchTerm === '' || 
        `#${recepcion.id_recepcion}`.includes(searchTerm) ||
        `#${recepcion.compra_id}`.includes(searchTerm) ||
        recepcion.notas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estatusTexto.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [recepciones, searchTerm, activeTab]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Calcular estadísticas ACTUALIZADAS
  const statsData = [
    { 
      title: 'Total de Compras', 
      value: compras.length,
      icon: 'shopping_cart',
      color: colors.primary.main
    },
    { 
      title: 'Registradas', 
      value: compras.filter(esRegistrada).length,
      icon: 'check_circle',
      color: colors.status.info
    },
    { 
      title: 'Inventariadas', 
      value: compras.filter(esInventariada).length,
      icon: 'inventory',
      color: colors.status.success
    },
    { 
      title: 'Canceladas', 
      value: compras.filter(esCancelada).length,
      icon: 'cancel',
      color: colors.status.error
    },
    { 
      title: 'Total Recepciones', 
      value: recepciones.length,
      icon: 'local_shipping',
      color: colors.secondary.main
    }
  ];

  // NUEVA: Función para mensajes vacíos de recepciones
  const getEmptyStateMessageRecepciones = () => {
    if (searchTerm && filteredRecepciones.length === 0) {
      return `No se encontraron recepciones para "${searchTerm}"`;
    }
    
    switch (activeTab) {
      case 4:
        return recepciones.length === 0 
          ? 'No hay recepciones registradas.' 
          : 'No se encontraron recepciones con los criterios de búsqueda.';
      case 5:
        return 'No hay recepciones activas en este momento.';
      case 6:
        return 'No hay recepciones procesadas.';
      case 7:
        return 'No hay recepciones canceladas.';
      default:
        return 'No se encontraron recepciones.';
    }
  };

  const getEmptyStateMessage = () => {
    if (searchTerm && filteredCompras.length === 0) {
      return `No se encontraron compras para "${searchTerm}"`;
    }
    
    switch (activeTab) {
      case 0:
        return compras.length === 0 
          ? 'No hay compras registradas. Registra la primera compra.' 
          : 'No se encontraron compras con los criterios de búsqueda.';
      case 1:
        return 'No hay compras registradas en este momento.';
      case 2:
        return 'No hay compras inventariadas.';
      case 3:
        return 'No hay compras canceladas.';
      default:
        return 'No se encontraron compras.';
    }
  };

  const getEmptyStateIcon = () => {
    if (searchTerm && filteredCompras.length === 0) {
      return <ShoppingCartIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
    }
    
    switch (activeTab) {
      case 1:
        return <CheckCircleIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
      case 2:
        return <InventoryIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
      case 3:
        return <CancelIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
      default:
        return <ShoppingCartIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
    }
  };

  // NUEVA: Icono para estados vacíos de recepciones
  const getEmptyStateIconRecepciones = () => {
    if (searchTerm && filteredRecepciones.length === 0) {
      return <LocalShippingIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
    }
    
    switch (activeTab) {
      case 5:
        return <CheckCircleIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
      case 6:
        return <InventoryIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
      case 7:
        return <CancelIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
      default:
        return <LocalShippingIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />;
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={handleCloseConfirmDialog}
        onCancel={handleCloseConfirmDialog}
        confirmText="Cancelar"
        cancelText="Mantener"
      />

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
          <Box>
            <Typography variant="h5" component="h1" fontWeight={700} gutterBottom sx={{ color: colors.text.primary }}>
              Gestión de Compras y Recepciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administra las compras, recepciones e inventario del restaurante
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              label={`Sucursal: ${sucursalId ?? 'No configurada'}`}
              sx={{
                bgcolor: sxBg(colors.background.light),
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                fontWeight: 600
              }}
            />

            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleNewCompra}
              disabled={!sucursalId}
              sx={{
                backgroundColor: colors.primary.main,
                color: colors.primary.contrastText,
                fontWeight: 700,
                px: 3,
                py: 1.1,
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                '&:hover': {
                  backgroundColor: colors.primary.dark
                }
              }}
            >
              NUEVA COMPRA
            </Button>
          </Box>
        </Box>

        {!sucursalId && !loading && (
          <Paper elevation={0} sx={{ textAlign: 'center', py: 3, backgroundColor: colors.status.warning ?? '#FFF4E5', borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" color="warning.dark">
              No se ha configurado la sucursal
            </Typography>
            <Typography variant="body2" color="warning.dark">
              Por favor, selecciona una sucursal primero
            </Typography>
          </Paper>
        )}

        {sucursalId && (
          <>
            <FormularioCompras
              open={openModal}
              onClose={() => setOpenModal(false)}
              onSave={handleSaveCompra}
              loading={loading}
              sucursalId={sucursalId}
            />

            <FormularioRecepcion
              open={openRecepcionForm}
              onClose={handleCloseRecepcionForm}
              onSave={handleSaveRecepcion}
              loading={loading}
              sucursalId={sucursalId}
              initialCompraId={recepcionCompraId}
            />

            <Box sx={{ my: 2 }}>
              <CardEstadisticas cardsData={statsData} />
            </Box>

            {/* Pestañas rediseñadas */}
            <Paper elevation={0} sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: colors.background.light }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ style: { backgroundColor: colors.primary.main, height: 3, borderRadius: 3 } }}
              >
                <Tab
                  label={`Todas las compras(${compras.length})`}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 140,
                    px: 2,
                    mr: 1,
                    '&.Mui-selected': {
                      color: colors.primary.dark,
                      backgroundColor: colors.primary.light,
                      borderRadius: 1
                    }
                  }}
                />

                <Tab
                  label={`Registradas (${compras.filter(esRegistrada).length})`}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 180,
                    px: 2,
                    '&.Mui-selected': {
                      color: colors.status.info,
                      backgroundColor: colors.alpha?.['10'] ? `${colors.primary.main}${colors.alpha['10']}` : colors.primary.light,
                      borderRadius: 1
                    }
                  }}
                />

                <Tab
                  label={`Inventariadas (${compras.filter(esInventariada).length})`}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 180,
                    px: 2,
                    '&.Mui-selected': {
                      color: colors.status.success,
                      backgroundColor: colors.alpha?.['10'] ? `${colors.status.success}${colors.alpha['10']}` : colors.status.success,
                      borderRadius: 1
                    }
                  }}
                />

                <Tab
                  label={`Canceladas (${compras.filter(esCancelada).length})`}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 160,
                    px: 2,
                    '&.Mui-selected': {
                      color: colors.status.error,
                      backgroundColor: colors.alpha?.['10'] ? `${colors.status.error}${colors.alpha['10']}` : colors.status.error,
                      borderRadius: 1
                    }
                  }}
                />

                {/* RECEPCIONES */}
                <Tab
                  label={`Recepciones (${recepciones.length})`}
                  sx={{ textTransform: 'none', fontWeight: 600, minWidth: 160 }}
                />

                <Tab
                  label={`Activas (${recepciones.filter(esRecepcionActiva).length})`}
                  sx={{ textTransform: 'none', fontWeight: 600, minWidth: 160 }}
                />

                <Tab
                  label={`Procesadas (${recepciones.filter(esRecepcionProcesada).length})`}
                  sx={{ textTransform: 'none', fontWeight: 600, minWidth: 160 }}
                />

                <Tab
                  label={`Canceladas (${recepciones.filter(esRecepcionCancelada).length})`}
                  sx={{ textTransform: 'none', fontWeight: 600, minWidth: 160 }}
                />
              </Tabs>
            </Paper>

            {/* Barra de búsqueda con contador de resultados */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <BarraBusqueda 
                  placeholder={
                    activeTab < 4 
                      ? "Buscar compras por proveedor, folio o estado..."
                      : "Buscar recepciones por ID, compra o estado..."
                  }
                  onSearch={handleSearch}
                  value={searchTerm}
                />
              </Box>
              
              {/* Contador de resultados */}
              {searchTerm && (
                <Chip
                  label={
                    activeTab < 4 
                      ? `${filteredCompras.length} compra${filteredCompras.length !== 1 ? 's' : ''}`
                      : `${filteredRecepciones.length} recepción${filteredRecepciones.length !== 1 ? 'es' : ''}`
                  }
                  variant="outlined"
                  sx={{ borderColor: colors.border.main }}
                />
              )}
            </Box>

            {loading ? (
              <LoadingComponent message={
                activeTab < 4 ? "Cargando compras..." : "Cargando recepciones..."
              } />
            ) : (
              <>
                {/* MOSTRAR COMPRAS (Pestañas 0-3) */}
                {activeTab < 4 && (
                  <Grid container spacing={3}>
                    {filteredCompras.map((compra) => (  
                      <Grid size={{xs:12, md:6, lg:4}}key={compra.id_compra || compra.id}>
                        <CardCompra 
                          compra={compra}
                          onCancelar={() => handleCancelarCompra(compra)}
                          onCrearRecepcion={(id) => handleOpenRecepcionFormWithCompra(id)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* MOSTRAR RECEPCIONES (Pestañas 4-7) */}
                {activeTab >= 4 && (
                  <Grid container spacing={3}>
                    {filteredRecepciones.map((recepcion) => (  
                      <Grid size={{xs:12, md:6, lg:4}} key={recepcion.id_recepcion}>
                        <CardRecepcion 
                          recepcion={recepcion}
                          onCancelar={handleCancelarRecepcion}
                          onVerDetalle={handleVerDetalleRecepcion}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}

            {/* ESTADOS VACÍOS PARA COMPRAS */}
            {!loading && activeTab < 4 && filteredCompras.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                {getEmptyStateIcon()}
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchTerm ? `Búsqueda: "${searchTerm}"` : 'No se encontraron compras'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {getEmptyStateMessage()}
                </Typography>
                {!searchTerm && activeTab === 0 && compras.length === 0 && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewCompra}
                    sx={{
                      bgcolor: colors.primary.main,
                      px: 4,
                      py: 1.5,
                      mt: 2
                    }}
                  >
                    Registrar Primera Compra
                  </Button>
                )}
                {searchTerm && (
                  <Button
                    variant="outlined"
                    onClick={() => setSearchTerm('')}
                    sx={{ mt: 2 }}
                  >
                    Limpiar búsqueda
                  </Button>
                )}
              </Box>
            )}

            {/* ESTADOS VACÍOS PARA RECEPCIONES */}
            {!loading && activeTab >= 4 && filteredRecepciones.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                {getEmptyStateIconRecepciones()}
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchTerm ? `Búsqueda: "${searchTerm}"` : 'No se encontraron recepciones'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {getEmptyStateMessageRecepciones()}
                </Typography>
                {searchTerm && (
                  <Button
                    variant="outlined"
                    onClick={() => setSearchTerm('')}
                    sx={{ mt: 2 }}
                  >
                    Limpiar búsqueda
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Compras;

// -----------------
// Helpers small inline used in this file intentionally to avoid breaking imports
function sxBg(color) {
  // Try to use a light background fallback
  return color || 'transparent';
}
