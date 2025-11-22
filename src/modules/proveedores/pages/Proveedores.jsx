import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import FormularioProveedores from '../components/FormularioProveedores';
import CardProveedor from '../components/CardProveedor';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';

// TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API 
import proveedoresService from '../services/proveedores.service';
import colors from '../../../theme/colores';

const Proveedores = () => {
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [proveedorToEdit, setProveedorToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Cargar proveedores al montar el componente
  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const { data } = await proveedoresService.getAll();
      
      if (data && data.success && Array.isArray(data.data)) {
        setProveedores(data.data);
      } else {
        setProveedores([]);
        toast.warning('No se pudieron cargar los proveedores');
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      toast.error('Error cargando los proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleNewProveedor = (proveedor = null) => {
    setProveedorToEdit(proveedor);
    setOpenModal(true);
  };

  const handleSaveProveedor = async (proveedorData) => {
    try {
      setLoading(true);
      
      if (proveedorToEdit) {
        // MODO EDICIÓN
        await proveedoresService.update(proveedorToEdit.id_proveedor || proveedorToEdit.id, proveedorData);
        toast.success(`Proveedor "${proveedorData.nombre}" actualizado correctamente`);
      } else {
        // CREACIÓN
        await proveedoresService.create(proveedorData);
        toast.success(`Proveedor "${proveedorData.nombre}" creado correctamente`);
      }
      
      setOpenModal(false);
      setProveedorToEdit(null);
      loadProveedores();
    } catch (error) {
      console.error('Error guardando proveedor:', error);
      const errorMessage = error.response?.data?.message || 'Error guardando el proveedor';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarProveedor = (proveedor) => {
    setConfirmDialog({
      open: true,
      title: 'Eliminar Proveedor',
      message: `¿Estás seguro de que deseas eliminar al proveedor "${proveedor.nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: () => confirmarEliminarProveedor(proveedor)
    });
  };

  const confirmarEliminarProveedor = async (proveedor) => {
    try {
      setLoading(true);
      await proveedoresService.delete(proveedor.id_proveedor || proveedor.id);
      toast.success(`Proveedor "${proveedor.nombre}" eliminado correctamente`);
      loadProveedores();
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      const errorMessage = error.response?.data?.message || 'Error eliminando el proveedor';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  };

  // Filtrar proveedores
  const filteredProveedores = useMemo(() => {
    return proveedores.filter(proveedor => {
      return searchTerm === '' || 
        proveedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.telefono?.includes(searchTerm);
    });
  }, [proveedores, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

  // Calcular estadísticas
  const statsData = [
    { 
      title: 'Total de Proveedores', 
      value: proveedores.length,
      icon: 'local_shipping',
      color: colors.primary.main
    },
    { 
      title: 'Proveedores Filtrados', 
      value: filteredProveedores.length,
      icon: 'filter_list',
      color: colors.secondary.main
    },
    { 
      title: 'Activos Recientemente', 
      value: proveedores.filter(p => p.es_activo).length,
      icon: 'check_circle',
      color: colors.status.success
    }
  ];

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
      />

      <Container maxWidth="xl" sx={{ mt: 0 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Proveedores
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra los proveedores del restaurante
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleNewProveedor()}
            sx={{
              backgroundColor: colors.primary.main,
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                backgroundColor: colors.primary.dark
              }
            }}
          >
            NUEVO PROVEEDOR
          </Button>
        </Box>

        <FormularioProveedores
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setProveedorToEdit(null);
          }}
          onSave={handleSaveProveedor}
          proveedorToEdit={proveedorToEdit}
          loading={loading}
        />

        <CardEstadisticas cardsData={statsData} />

        <BarraBusqueda 
          placeholder="Buscar proveedores por nombre, email o teléfono..."
          onSearch={handleSearch}
          value={searchTerm}
        />

        {loading ? (
          <LoadingComponent message="Cargando proveedores..." />
        ) : (
          <Grid container spacing={3}>
            {filteredProveedores.map((proveedor) => (  
              <Grid size={{xs: 12, md: 6, lg:4}} key={proveedor.id_proveedor || proveedor.id}>
                <CardProveedor 
                  proveedor={proveedor}
                  onEdit={() => handleNewProveedor(proveedor)}
                  onEliminar={() => handleEliminarProveedor(proveedor)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && filteredProveedores.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LocalShippingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza agregando el primer proveedor al sistema'
              }
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleNewProveedor()}
                sx={{
                  bgcolor: colors.primary.main,
                  px: 4,
                  py: 1.5,
                  mt: 2
                }}
              >
                Crear Primer Proveedor
              </Button>
            )}
          </Box>
        )}
      </Container>
    </>
  );
};

export default Proveedores;