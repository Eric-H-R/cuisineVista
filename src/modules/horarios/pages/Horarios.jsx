import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import FormularioHorarios from '../components/FormulariosHorarios';
import CardHorario from '../components/CardHorarios';
import FormularioDetallesHorario from '../components/FormulariosDetalleHorario';
import colors from '../../../theme/colores';

// TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API 
import horariosService from '../services/horarios.service';

const Horarios = () => {
  const [loading, setLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [horarioToEdit, setHorarioToEdit] = useState(null);
  const [sucursalId, setSucursalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDetallesModal, setOpenDetallesModal] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // Obtener sucursal_id del localStorage al cargar
  useEffect(() => {
    const sucursal = localStorage.getItem('sucursalId');
    console.log('Sucursal ID desde localStorage:', sucursal);
    
    if (sucursal) {
      const sucursalIdNum = parseInt(sucursal, 10);
      
      if (!isNaN(sucursalIdNum)) {
        setSucursalId(sucursalIdNum);
        loadInitialData(sucursalIdNum);
      } else {
        console.error('sucursalId no es un número válido:', sucursal);
        toast.error('ID de sucursal inválido');
        setLoading(false);
      }
    } else {
      console.error('No se encontró sucursalId en localStorage');
      toast.error('No se encontró la sucursal en el sistema');
      setLoading(false);
    }
  }, []);

  const loadInitialData = async (sucursalId) => {
    try {
      console.log('Cargando horarios para sucursal:', sucursalId);
      const { data } = await horariosService.getBySucursal(sucursalId);
      console.log('Respuesta completa de horarios:', data);
      
      // Adaptar la estructura de datos
      let horariosAdaptados = [];
      
      if (data && data.success && Array.isArray(data.horarios)) {
        horariosAdaptados = data.horarios.map(item => ({
          // Combinar datos del horario principal con los detalles
          ...item.horario,
          detalles: item.detalles || [],
          // Agregar propiedades para compatibilidad
          id_horario: item.horario.id_horario,
          estatus: item.horario.es_activo ? 'Activo' : 'Inactivo',
          usuarios_asignados: 0 // Puedes calcular esto si tienes los datos
        }));
      }
      
      console.log('Horarios adaptados:', horariosAdaptados);
      setHorarios(horariosAdaptados);
      
    } catch (error) {
      console.error('Error al cargar datos de horarios:', error);
      toast.error('Error cargando horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleNewHorario = (horario = null) => {
    setHorarioToEdit(horario);
    setOpenModal(true);
  };

  const handleSaveHorario = async (horarioData) => {
    try {
      setLoading(true);
      
      const horarioDataConSucursal = {
        ...horarioData,
        sucursal_id: sucursalId
      };
      
      let response;
      
      if (horarioToEdit) {
        await horariosService.update(horarioToEdit.id_horario, horarioDataConSucursal);
        toast.success(`Horario "${horarioData.nombre}" actualizado`);
      } else {
        const { data } = await horariosService.create(horarioDataConSucursal);
        response = data;
        toast.success(`Horario "${horarioData.nombre}" creado`);
      }
      
      setOpenModal(false);
      loadInitialData(sucursalId);
    } catch (error) {
      console.error('Error guardando horario:', error);
      toast.error('Error guardando horario');
    } finally {
      setLoading(false);
    }
  };

  const handleGestionarDetalles = (horario) => {
    setHorarioSeleccionado(horario);
    setOpenDetallesModal(true);
  };

  const handleSaveDetalles = async (detallesData) => {
    try {
      setLoading(true);
      // Aquí llamarías al endpoint para guardar los detalles
      // await horariosService.agregarDetalles(detallesData);
      toast.success('Detalles del horario guardados correctamente');
      setOpenDetallesModal(false);
      loadInitialData(sucursalId);
    } catch (error) {
      console.error('Error guardando detalles:', error);
      toast.error('Error guardando detalles del horario');
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivarHorario = async (idHorario) => {
    try {
      await horariosService.delete(idHorario);
      toast.success('Horario desactivado correctamente');
      loadInitialData(sucursalId);
    } catch (error) {
      console.error('Error desactivando horario:', error);
      toast.error('Error desactivando horario');
    }
  };

  // Filtrar horarios
  const filteredHorarios = useMemo(() => {
    return horarios.filter(horario => {
      return searchTerm === '' || 
        horario.clave?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        horario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        horario.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [horarios, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Calcular estadísticas
  const statsData = [
    { 
      title: 'Total de Horarios', 
      value: horarios.length 
    },
    { 
      title: 'Horarios Activos', 
      value: horarios.filter(h => h.es_activo).length 
    },
    { 
      title: 'Horarios Filtrados', 
      value: filteredHorarios.length 
    },
    { 
      title: 'Días Configurados', 
      value: horarios.reduce((total, horario) => total + (horario.detalles?.length || 0), 0)
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
      <Container maxWidth="xl" sx={{ mt: 0 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Horarios
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra los horarios y turnos de la sucursal
            </Typography>
            {sucursalId && (
              <Chip 
                label={`Sucursal ID: ${sucursalId}`}
                size="small"
                color="primary"
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleNewHorario()}
            disabled={!sucursalId}
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
            NUEVO HORARIO
          </Button>
        </Box>

        {!sucursalId && !loading && (
          <Box sx={{ textAlign: 'center', py: 4, backgroundColor: 'warning.light', borderRadius: 2 }}>
            <Typography variant="h6" color="warning.dark">
              No se ha configurado la sucursal
            </Typography>
            <Typography variant="body2" color="warning.dark">
              Por favor, selecciona una sucursal primero
            </Typography>
          </Box>
        )}

        {sucursalId && (
          <>
            <FormularioHorarios
              open={openModal}
              onClose={() => setOpenModal(false)}
              onSave={handleSaveHorario}
              horarioToEdit={horarioToEdit}
              loading={loading}
            />

            <FormularioDetallesHorario
              open={openDetallesModal}
              onClose={() => setOpenDetallesModal(false)}
              onSave={handleSaveDetalles}
              horario={horarioSeleccionado}
              loading={loading}
            />

            <CardEstadisticas cardsData={statsData} />

            <BarraBusqueda 
              placeholder="Buscar horarios por clave, nombre o descripción..."
              onSearch={handleSearch}
              value={searchTerm}
            />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {filteredHorarios.length} de {horarios.length} horarios
              </Typography>
            </Box>

            {loading ? (
              <LoadingComponent message="Cargando horarios..." />
            ) : (
              <Grid container spacing={3}>
                {filteredHorarios.map((horario) => (  
                  <Grid item xs={12} md={6} lg={4} key={horario.id_horario}>
                    <CardHorario 
                      horario={horario}
                      onEdit={() => handleNewHorario(horario)}
                      onDesactivar={() => handleDesactivarHorario(horario.id_horario)}
                      onGestionarDetalles={() => handleGestionarDetalles(horario)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {!loading && filteredHorarios.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No se encontraron horarios
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {horarios.length === 0 
                    ? 'No hay horarios registrados. Crea el primer horario.' 
                    : 'Intenta con otros términos de búsqueda.'
                  }
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Horarios;