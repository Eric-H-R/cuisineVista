import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import FormularioProducto from '../components/FormularioProducto';
import CardProducto from '../components/CardProducto';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';

// TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API 
import productosService from '../services/productos.service';
import colors from '../../../theme/colores';

const Productos = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const { data } = await productosService.getAll();
      
      if (data && data.success && Array.isArray(data.data)) {
        setProductos(data.data);
      } else {
        setProductos([]);
        toast.warning('No se pudieron cargar los productos');
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error cargando los productos');
    } finally {
      setLoading(false);
    }
  };
  const handleNewProducto = (producto = null) => {
    setProductoToEdit(producto);
    setOpenModal(true);
  };

  const handleSaveProducto = async (productoData) => {
    try {
      setLoading(true);
      
      if (productoToEdit) {
        // MODO EDICIÓN
        await productosService.update(productoToEdit.id_producto, productoData);
        toast.success(`Producto "${productoData.nombre}" actualizado correctamente`);
      } else {
        // CREACIÓN
        await productosService.create(productoData);
        toast.success(`Producto "${productoData.nombre}" creado correctamente`);
      }
      
      setOpenModal(false);
      setProductoToEdit(null);
      loadProductos();
    } catch (error) {
      console.error('Error guardando producto:', error);
      const errorMessage = error.response?.data?.message || 'Error guardando el producto';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarProducto = (producto) => {
    setConfirmDialog({
      open: true,
      title: 'Eliminar Producto',
      message: `¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: () => confirmarEliminarProducto(producto)
    });
  };

  const confirmarEliminarProducto = async (producto) => {
    try {
      setLoading(true);
      await productosService.delete(producto.id_producto);
      toast.success(`Producto "${producto.nombre}" eliminado correctamente`);
      loadProductos();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      const errorMessage = error.response?.data?.message || 'Error eliminando el producto';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  };

  // Filtrar productos
  const filteredProductos = useMemo(() => {
    return productos.filter(producto => {
      return searchTerm === '' || 
        producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [productos, searchTerm]);

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
      title: 'Total de Productos', 
      value: productos.length,
      icon: 'restaurant',
      color: colors.primary.main
    },
    { 
      title: 'Productos Filtrados', 
      value: filteredProductos.length,
      icon: 'filter_list',
      color: colors.secondary.main
    },
    { 
      title: 'Productos Activos', 
      value: productos.filter(p => p.es_activo).length,
      icon: 'check_circle',
      color: colors.status.success
    }
  ];

  return (
    <>
      {/* ToastContainer igual */}
      
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={handleCloseConfirmDialog}
      />

      <Container maxWidth="xl" sx={{ mt: 0, bgcolor: colors.background.default }}>
        {/* Header (ACTUALIZADO CON COLORES) */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 4,
          p: 3,
        }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" color={colors.text.primary}>
              Gestión de Productos
            </Typography>
            <Typography variant="subtitle1" color={colors.text.secondary}>
              Administra los productos del menú
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleNewProducto()}
            sx={{
              backgroundColor: colors.primary.main,
              color: colors.primary.contrastText,
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                backgroundColor: colors.primary.dark
              }
            }}
          >
            NUEVO PRODUCTO
          </Button>
        </Box>

        <FormularioProducto
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setProductoToEdit(null);
          }}
          onSave={handleSaveProducto}
          productoToEdit={productoToEdit}
          loading={loading}
        />

        <CardEstadisticas cardsData={statsData} />

        {/* Barra de búsqueda con colores */}
        <Box sx={{ mb: 3 }}>
          <BarraBusqueda 
            placeholder="Buscar productos por nombre, descripción o código..."
            onSearch={handleSearch}
            value={searchTerm}
          />
        </Box>

        {loading ? (
          <LoadingComponent message="Cargando productos..." />
        ) : (
          <Grid container spacing={3}>
            {filteredProductos.map((producto) => (  
              <Grid size={{xs: 12, md: 6, lg:4}} key={producto.id_producto}>
                <CardProducto 
                  producto={producto}
                  onEdit={() => handleNewProducto(producto)}
                  onEliminar={() => handleEliminarProducto(producto)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && filteredProductos.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            bgcolor: colors.background.paper,
            borderRadius: 2,
            border: `1px solid ${colors.border.light}`
          }}>
            <RestaurantIcon sx={{ 
              fontSize: 64, 
              color: colors.text.secondary, 
              mb: 2 
            }} />
            <Typography variant="h6" color={colors.text.secondary}>
              {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
            </Typography>
            <Typography variant="body2" color={colors.text.secondary} sx={{ mt: 1 }}>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza agregando el primer producto al menú'
              }
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleNewProducto()}
                sx={{
                  bgcolor: colors.primary.main,
                  color: colors.primary.contrastText,
                  px: 4,
                  py: 1.5,
                  mt: 2,
                  '&:hover': {
                    bgcolor: colors.primary.dark
                  }
                }}
              >
                Crear Primer Producto
              </Button>
            )}
          </Box>
        )}
      </Container>
    </>
  );
};


export default Productos;