import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ScaleIcon from '@mui/icons-material/Scale';
//import CardEstadisticas from '../../../components/CardEstadisticas';
//import BarraBusqueda from '../../../components/BarraBusqueda';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import FormularioUnidades from '../components/FormularioUnidades';
import CardUnidad from '../components/CardUnidad';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';

// TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API 
import unidadesService from '../services/unidades.service';
import colors from '../../../theme/colores';

const Unidades = () => {
  const [loading, setLoading] = useState(true);
  const [unidades, setUnidades] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [unidadToEdit, setUnidadToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Cargar unidades al montar el componente
  useEffect(() => {
    loadUnidades();
  }, []);

  const loadUnidades = async () => {
    try {
      setLoading(true);
      const { data } = await unidadesService.getAll();
      
      if (data && data.success && Array.isArray(data.data)) {
        setUnidades(data.data);
      } else {
        setUnidades([]);
        toast.warning('No se pudieron cargar las unidades');
      }
    } catch (error) {
      console.error('Error al cargar unidades:', error);
      toast.error('Error cargando las unidades de medida');
    } finally {
      setLoading(false);
    }
  };

  const handleNewUnidad = (unidad = null) => {
    setUnidadToEdit(unidad);
    setOpenModal(true);
  };

  const handleSaveUnidad = async (unidadData) => {
    try {
      setLoading(true);
      
      if (unidadToEdit) {
        // MODO EDICIÓN
        await unidadesService.update(unidadToEdit.id_unidad || unidadToEdit.clave, unidadData);
        toast.success(`Unidad "${unidadData.nombre}" actualizada correctamente`);
      } else {
        // CREACIÓN
        await unidadesService.create(unidadData);
        toast.success(`Unidad "${unidadData.nombre}" creada correctamente`);
      }
      
      setOpenModal(false);
      setUnidadToEdit(null);
      loadUnidades();
    } catch (error) {
      console.error('Error guardando unidad:', error);
      const errorMessage = error.response?.data?.message || 'Error guardando la unidad';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarUnidad = (unidad) => {
    setConfirmDialog({
      open: true,
      title: 'Eliminar Unidad',
      message: `¿Estás seguro de que deseas eliminar la unidad "${unidad.nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: () => confirmarEliminarUnidad(unidad)
    });
  };

  const confirmarEliminarUnidad = async (unidad) => {
    try {
      setLoading(true);
      await unidadesService.delete(unidad.id || unidad.clave);
      toast.success(`Unidad "${unidad.nombre}" eliminada correctamente`);
      loadUnidades();
    } catch (error) {
      console.error('Error eliminando unidad:', error);
      const errorMessage = error.response?.data?.message || 'Error eliminando la unidad';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  };

  // Filtrar unidades
  const filteredUnidades = useMemo(() => {
    return unidades.filter(unidad => {
      return searchTerm === '' || 
        unidad.clave?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unidad.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (unidad.simbolo && unidad.simbolo.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [unidades, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Calcular estadísticas
  const statsData = [
    { 
      title: 'Total de Unidades', 
      value: unidades.length,
      icon: 'scale',
      color: colors.primary.main
    },
    { 
      title: 'Unidades Filtradas', 
      value: filteredUnidades.length,
      icon: 'filter_list',
      color: colors.secondary.main
    },
    { 
      title: 'Unidades de Peso', 
      value: unidades.filter(u => u.clave?.toLowerCase().includes('kg') || u.clave?.toLowerCase().includes('g') || u.clave?.toLowerCase().includes('lb')).length,
      icon: 'fitness_center',
      color: colors.accent.main
    },
    { 
      title: 'Unidades de Volumen', 
      value: unidades.filter(u => u.clave?.toLowerCase().includes('lt') || u.clave?.toLowerCase().includes('ml') || u.clave?.toLowerCase().includes('l')).length,
      icon: 'water_drop',
      color: colors.status.info
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
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      />

      <Container maxWidth="xl" sx={{ mt: 0 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Unidades de Medida
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra las unidades de medida del sistema
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleNewUnidad()}
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
            NUEVA UNIDAD
          </Button>
        </Box>

        <FormularioUnidades
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setUnidadToEdit(null);
          }}
          onSave={handleSaveUnidad}
          unidadToEdit={unidadToEdit}
          loading={loading}
        />

        {/*<CardEstadisticas cardsData={statsData} />

        <BarraBusqueda 
          placeholder="Buscar unidades por clave, nombre o símbolo..."
          onSearch={handleSearch}
          value={searchTerm}
        />
*/}
        {loading ? (
          <LoadingComponent message="Cargando unidades de medida..." />
        ) : (
          <Grid container spacing={3}>
            {filteredUnidades.map((unidad) => (  
              <Grid size={{xs:12, md:6, lg:4}} key={unidad.clave || unidad.id}>
                <CardUnidad 
                  unidad={unidad}
                  onEdit={() => handleNewUnidad(unidad)}
                  onEliminar={() => handleEliminarUnidad(unidad)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && filteredUnidades.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ScaleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No se encontraron unidades
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {unidades.length === 0 
                ? 'No hay unidades de medida registradas. Crea la primera unidad.' 
                : 'Intenta con otros términos de búsqueda.'
              }
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Unidades;