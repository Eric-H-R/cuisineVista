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
import Vacaciones from '../components/Vacaciones';

const Horarios = () => {
  const [loading, setLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [horarioToEdit, setHorarioToEdit] = useState(null);
  const [sucursalId, setSucursalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDetallesModal, setOpenDetallesModal] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [asignacionOpen, setAsignacionOpen] = useState(false);
  const [horarioParaAsignar, setHorarioParaAsignar] = useState(null);
  const [codigosPorHorario, setCodigosPorHorario] = useState({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0] // Fecha actual
  );
  // Obtener sucursal_id del localStorage al cargar
  useEffect(() => {
    const sucursal = localStorage.getItem('sucursalId');
    
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

  useEffect(() => {
    if (sucursalId) {
      cargarCodigos();
    }
  }, [fechaSeleccionada, sucursalId]);

  const loadInitialData = async (sucursalId) => {
    try {
      const { data } = await horariosService.getBySucursal(sucursalId);
      
      // Adaptar la estructura de datos
      let horariosAdaptados = [];
      
      if (data && data.success && Array.isArray(data.horarios)) {
        horariosAdaptados = data.horarios.map(item => ({
          ...item.horario,
          detalles: item.detalles || [],
          id_horario: item.horario.id_horario,
          estatus: item.horario.es_activo ? 'Activo' : 'Inactivo',
          usuarios_asignados: item.usuarios_asignados || 0 
        }));
      }
      
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
      let response;
      
      if (horarioToEdit) {
        // MODO EDICIÓN
        const datosActualizacion = {
          clave: horarioData.clave,
          nombre: horarioData.nombre,
          descripcion: horarioData.descripcion
        };
        
        await horariosService.update(horarioToEdit.id_horario, datosActualizacion);
        toast.success(`Horario "${horarioData.nombre}" actualizado`);
      } else {
        // CREACION:
        const datosCreacion = {
          ...horarioData,
          sucursal_id: sucursalId
        };;
        
        const { data } = await horariosService.create(datosCreacion);
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

  const handleAbrirAsignacion = (horario) => {
    setHorarioParaAsignar(horario);
    setAsignacionOpen(true);
  };

  const handleAsignacionExitosa = () => {
    setAsignacionOpen(false);
    loadInitialData(sucursalId);
  }

  const cargarCodigos = async () => {
    try {
      const response = await horariosService.generarCodigos({
        expira_horas: 1, // Esto puede ser cualquier valor ya que solo queremos los códigos existentes
        fecha: fechaSeleccionada
      });
      
      // ✅ ORGANIZAR CÓDIGOS POR HORARIO_ID
      const todosLosCodigos = [
        ...(response.data.codigos_existentes || []),
        ...(response.data.codigos_generados || [])
      ];
      
      const codigosAgrupados = {};
      todosLosCodigos.forEach(codigo => {
        if (!codigosAgrupados[codigo.horario_id]) {
          codigosAgrupados[codigo.horario_id] = [];
        }
        codigosAgrupados[codigo.horario_id].push(codigo);
      });
      
      setCodigosPorHorario(codigosAgrupados);
    } catch (error) {
      console.error('Error cargando códigos:', error);
      toast.error('Error cargando códigos');
    }
  };

  console.log('Codigos Horaior', codigosPorHorario)
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
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Horarios
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra los horarios y turnos de la sucursal
            </Typography>
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

            {loading ? (
              <LoadingComponent message="Cargando horarios..." />
            ) : (
              <Grid container spacing={3}>
                {filteredHorarios.map((horario) => (  
                  <Grid size={{xs:12, md:6, lg:4}}  key={horario.id_horario}>
                    <CardHorario 
                      horario={horario}
                      onEdit={() => handleNewHorario(horario)}
                      onDesactivar={() => handleDesactivarHorario(horario.id_horario)}
                      onAsignarUsuario={handleAbrirAsignacion}
                      onGestionarDetalles={() => handleGestionarDetalles(horario)}
                      onAsignacionExitosa={handleAsignacionExitosa}
                      codigos={codigosPorHorario[horario.id_horario] || []}
                      fechaSeleccionada={fechaSeleccionada}
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
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Vacaciones sucursalId={sucursalId} />
        </Box>
        
      </Container>
    </>
  );
};

export default Horarios;