import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import FilterListIcon from '@mui/icons-material/FilterList';

import CardMesa from '../components/CardMesas';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import BarraBusqueda from '../components/BarraBusqueda';
import CardEstadisticas from '../components/CardEstadisticas';
import ModalComenzarReserva from '../components/ModalComenzarReserva';
import TemporizadorReserva from '../components/TemporizadorReserva';
import CardReserva from '../components/CardReserva'
//TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Services
import mesasService from '../../mesas/services/MesasService';
import reservaService from '../services/reserva.service';
import colors from '../../../theme/colores';

const Reservas = () => {
  const [loading, setLoading] = useState(true);
  const [mesas, setMesas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroCapacidad, setFiltroCapacidad] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  //DATOS PARA HOLD
  const [openReservaModal, setOpenReservaModal] = useState(false);
  const [reservaData, setReservaData] = useState(null);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(300);
  //ESTADOS PARA HOLD
  const [holdActual, setHoldActual] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [loadingHold, setLoadingHold] = useState(false);
  // AGREGAR RESERVAS
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  // Obtener sucursal del localStorage
  const sucursalId = parseInt(localStorage.getItem('sucursalId') || '1', 10);



  // Cargar datos montar el componente
  useEffect(() => {
    loadMesas();
    cargarReservas();
  }, []);

  const loadMesas = async () => {
    try {
      setLoading(true);
      console.log('sucursal: ', sucursalId)
      const { data } = await mesasService.getBySucursal(sucursalId, {
        solo_activas: false // Traer todas para mostrar las inactivas también
      });
      

      
      if (data && data.success && Array.isArray(data.data)) {
        setMesas(data.data);
      } else {
        setMesas([]);
      }
    } catch (error) {
      console.error('Error al cargar mesas:', error);
      setMesas([]);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para el temporizador
  useEffect(() => {
  let intervalo;

  if (temporizadorActivo && tiempoRestante > 0) {
    intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          setTemporizadorActivo(false);
          
          // Cancelar hold automáticamente si se acaba el tiempo
          if (holdActual) {
            cancelarHoldActual('Tiempo de reserva agotado');
          }
          
          // Limpiar selección
          setMesaSeleccionada(null);
          setHoldActual(null);
          
          toast.warning('⏰ Tiempo de reserva agotado - Hold liberado');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => {
    if (intervalo) clearInterval(intervalo);
  };
}, [temporizadorActivo, tiempoRestante, holdActual]);

  // Filtrar mesas
  const filteredMesas = useMemo(() => {
    return mesas.filter(mesa => {
      const coincideBusqueda = searchTerm === '' || 
        mesa.codigo_mesa?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const coincideArea = filtroArea === '' || mesa.area_id?.toString() === filtroArea;
      
      const coincideCapacidad = filtroCapacidad === '' || 
        (filtroCapacidad === 'small' && mesa.capacidad <= 2) ||
        (filtroCapacidad === 'medium' && mesa.capacidad > 2 && mesa.capacidad <= 4) ||
        (filtroCapacidad === 'large' && mesa.capacidad > 4);
      
      const coincideEstado = filtroEstado === '' || 
        (filtroEstado === 'disponible' && mesa.estatus_actual === 1 && mesa.es_activa) ||
        (filtroEstado === 'ocupada' && mesa.estatus_actual === 2) ||
        (filtroEstado === 'reservada' && mesa.estatus_actual === 3) ||
        (filtroEstado === 'inactiva' && !mesa.es_activa);

      return coincideBusqueda && coincideArea && coincideCapacidad && coincideEstado;
    });
  }, [mesas, searchTerm, filtroArea, filtroCapacidad, filtroEstado]);

  // Obtener áreas únicas para el filtro
  const areasUnicas = useMemo(() => {
    const areas = [...new Set(mesas.map(mesa => mesa.area_id))].filter(Boolean);
    return areas.sort((a, b) => a - b);
  }, [mesas]);

  // Calcular estadísticas
  const statsData = useMemo(() => [
    { 
      title: 'Total de Mesas', 
      value: mesas.length,
      icon: 'table_restaurant',
      color: colors.primary.main
    },
    { 
      title: 'Disponibles', 
      value: mesas.filter(m => m.es_activa && m.estatus_actual === 1).length,
      icon: 'event_available',
      color: colors.status.success
    },
    { 
      title: 'Ocupadas/Reservadas', 
      value: mesas.filter(m => m.estatus_actual === 2 || m.estatus_actual === 3).length,
      icon: 'event_busy',
      color: colors.status.warning
    },
    { 
      title: 'Inactivas', 
      value: mesas.filter(m => !m.es_activa).length,
      icon: 'block',
      color: colors.status.error
    }
  ], [mesas]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltroArea('');
    setFiltroCapacidad('');
    setFiltroEstado('');
  };

   // Función para manejar guardado de reserva
  const handleGuardarReserva = (datosReserva) => {
    setReservaData(datosReserva);
    setOpenReservaModal(false);
    iniciarTemporizador();
  };

  // Función para iniciar temporizador
  const iniciarTemporizador = () => {
    setTemporizadorActivo(true);
    setTiempoRestante(180);
  };

  // Función para cancelar temporizador
  const detenerTemporizador = () => {
    setTemporizadorActivo(false);
    setTiempoRestante(180);
    setReservaData(null);
    if (holdActual) {
      cancelarHoldActual('Reserva cancelada por el usuario');
    }
  
    // ✅ Limpiar selección de mesa
    setMesaSeleccionada(null);
    setHoldActual(null);
    
    toast.info('🛑 Reserva cancelada - Hold liberado');
  };

    // Función para crear HOLD
  const crearHold = async (mesa) => {
    try {
      setLoadingHold(true);
      const inicio = new Date().toLocaleString("en-CA", {
        timeZone: "America/Mexico_City",
        hour12: false
      }).replace(",", "");
      const holdData = {
        actor_tipo: 2,
        horas: reservaData.duracion,
        inicio: inicio,
        mesa_id: mesa.id_mesa,
        notas: reservaData.notas || 'Reserva en proceso',
        ttl_minutes: 3
      };

      console.log('📤 Creando HOLD:', holdData);

      const { data } = await reservaService.create(holdData);
      
      if (data && data.hold) {
        setHoldActual(data.hold);
        setMesaSeleccionada(mesa);
        toast.success(`✅ Hold creado para mesa ${mesa.codigo_mesa}`);
        console.log('✅ HOLD creado:', data.hold);
        return data.hold;
      }
    } catch (error) {
      console.error('❌ Error creando HOLD:', error);
      const errorMessage = error.response?.data?.message || 'Error creando el hold';
      toast.error(`❌ ${errorMessage}`);
      throw error;
    } finally {
      setLoadingHold(false);
    }
  };

  //Funcion para cancelar HOLD
  const cancelarHoldActual = async (motivo = 'Usuario cambió de mesa') => {
    if (!holdActual) return;

    try {
      setLoadingHold(true);
      console.log('📤 Cancelando HOLD:', holdActual.id_hold_mesa);

      await reservaService.cancel(holdActual.id_hold_mesa, motivo);
      
      console.log('✅ HOLD cancelado');
      setHoldActual(null);
      setMesaSeleccionada(null);
      toast.info('🔄 Hold cancelado');
    } catch (error) {
      console.error('❌ Error cancelando HOLD:', error);
      const errorMessage = error.response?.data?.message || 'Error cancelando el hold';
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoadingHold(false);
    }
  };

    // Función para manejar selección de mesa
  const handleSeleccionarMesa = async (mesa) => {
    if (!temporizadorActivo || !reservaData) {
      toast.warning('⚠️ Primero debes comenzar una reserva');
      return;
    }

    if (loadingHold) {
      toast.info('⏳ Procesando selección anterior...');
      return;
    }

    // Si ya hay una mesa seleccionada, cancelar el hold anterior
    if (holdActual && mesaSeleccionada) {
      if (mesaSeleccionada.id_mesa === mesa.id_mesa) {
        toast.info('ℹ️ Esta mesa ya está seleccionada');
        return;
      }
      
      await cancelarHoldActual(`Cambio a mesa ${mesa.codigo_mesa}`);
    }

    // Crear nuevo HOLD para la mesa seleccionada
    try {
      await crearHold(mesa);
      return !!nuevoHold;
    } catch (error) {
      return false
    }
  };

  // Función para cargar reservas
const cargarReservas = async () => {
  try {
    setLoadingReservas(true);
    const { data } = await reservaService.getAllReservas({
      sucursal_id: sucursalId
    });
    
    if (data && data.reservas) {
      setReservas(data.reservas);
    } else {
      setReservas([]);
    }
  } catch (error) {
    console.error('Error cargando reservas:', error);
    setReservas([]);
  } finally {
    setLoadingReservas(false);
  }
};

const handleCancelarReserva = async (reserva, motivo) => {
  try {
    console.log('Cancelando reserva:', reserva.id_reserva, 'Motivo:', motivo);
    
    await reservaService.cancelReserva(reserva.id_reserva, motivo);
    toast.success('✅ Reserva cancelada exitosamente');
    await cargarReservas(); // Recargar lista
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    const errorMessage = error.response?.data?.message || 'Error cancelando la reserva';
    toast.error(`❌ ${errorMessage}`);
  }
};

// Función para editar reserva (placeholder)
const handleEditarReserva = (reserva) => {
  toast.info('✏️ Editar reserva - Funcionalidad en desarrollo');
};

const handleVerDetalles = (reserva) => {
  setReservaSeleccionada(reserva);
  setModalDetalleOpen(true);
};

const handleCrearReserva = async (datosReserva) => {
  try {
    const { data } = await reservaService.createReserva(datosReserva);
    
    if (data && data.reserva) {
      toast.success('✅ Reserva creada exitosamente');
      
      // Limpiar todo el estado
      setTemporizadorActivo(false);
      setTiempoRestante(180);
      setReservaData(null);
      setHoldActual(null);
      setMesaSeleccionada(null);
      
      // Recargar la lista de reservas
      await cargarReservas();
      
      return true;
    }
  } catch (error) {
    console.error('Error creando reserva:', error);
    // El error se propaga para que ModalFormularioReserva lo maneje
    throw error;
  }
};
  return (
    <Container maxWidth="xl" sx={{ mt: 0, bgcolor: colors.background.default }}>
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
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: 4,
        p: 3,
        bgcolor: colors.background.paper,
        borderRadius: 2,
        border: `1px solid ${colors.border.light}`
      }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color={colors.text.primary}>
            Gestión de Reservas
          </Typography>
          <Typography variant="subtitle1" color={colors.text.secondary}>
            Administra las reservas de mesas del restaurante
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setOpenReservaModal(true)}
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
          COMENZAR RESERVA
        </Button>
      </Box>

      {/* Estadísticas */}
      <CardEstadisticas cardsData={statsData} />

      {/* Filtros */}
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        bgcolor: colors.background.paper,
        borderRadius: 2,
        border: `1px solid ${colors.border.light}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon sx={{ color: colors.primary.main }} />
          <Typography variant="h6" color={colors.text.primary}>
            Filtros
          </Typography>
          {(filtroArea || filtroCapacidad || filtroEstado) && (
            <Button 
              size="small" 
              onClick={limpiarFiltros}
              sx={{ ml: 'auto', color: colors.primary.main }}
            >
              Limpiar filtros
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:6, md:3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Área</InputLabel>
              <Select
                value={filtroArea}
                label="Área"
                onChange={(e) => setFiltroArea(e.target.value)}
              >
                <MenuItem value="">Todas las áreas</MenuItem>
                {areasUnicas.map(areaId => (
                  <MenuItem key={areaId} value={areaId.toString()}>
                    Área {areaId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{xs:12, sm:6, md:3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Capacidad</InputLabel>
              <Select
                value={filtroCapacidad}
                label="Capacidad"
                onChange={(e) => setFiltroCapacidad(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="small">Pequeña (1-2 personas)</MenuItem>
                <MenuItem value="medium">Mediana (3-4 personas)</MenuItem>
                <MenuItem value="large">Grande (5+ personas)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{xs:12, sm:6, md:3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstado}
                label="Estado"
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <MenuItem value="">Todos los estados</MenuItem>
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="ocupada">Ocupada</MenuItem>
                <MenuItem value="reservada">Reservada</MenuItem>
                <MenuItem value="inactiva">Inactiva</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Barra de búsqueda */}
      <BarraBusqueda 
        placeholder="Buscar mesas por código..."
        onSearch={handleSearch}
        value={searchTerm}
      />
      <TemporizadorReserva
        temporizadorActivo={temporizadorActivo}
        tiempoRestante={tiempoRestante}
        reservaData={reservaData}
        onCancelar={detenerTemporizador}
      />
      {/* Lista de mesas */}
      {loading ? (
        <LoadingComponent message="Cargando mesas..." />
      ) : (
        <Grid container spacing={3}>
          {filteredMesas.map((mesa) => (  
            <Grid size={{xs:12, sm:6, md:4, kg:3}} key={mesa.id_mesa}>
              <CardMesa 
                mesa={mesa}
                onReservar={handleSeleccionarMesa}
                disabled={!mesa.es_activa || loadingHold}
                temporizadorActivo={temporizadorActivo}
                seleccionada={mesaSeleccionada?.id_mesa === mesa.id_mesa}
                holdActual={holdActual}
                reservaData={reservaData}
                onCrearReserva={handleCrearReserva}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" color={colors.text.primary} sx={{ mb: 3 }}>
          Reservas Existentes
        </Typography>

        {loadingReservas ? (
          <LoadingComponent message="Cargando reservas..." />
        ) : (
          <Grid container spacing={3}>
            {reservas.map((reserva) => (  
              <Grid size={{xs:12, sm:6, md:4}} key={reserva.id_reserva}>
                <CardReserva 
                  reserva={reserva}
                  onCancelar={handleCancelarReserva}
                  onEditar={handleEditarReserva}
                  onVerDetalles={handleVerDetalles} 
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!loadingReservas && reservas.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            bgcolor: colors.background.paper,
            borderRadius: 2,
            border: `1px solid ${colors.border.light}`
          }}>
            <TableRestaurantIcon sx={{ 
              fontSize: 64, 
              color: colors.text.secondary, 
              mb: 2 
            }} />
            <Typography variant="h6" color={colors.text.secondary}>
              No hay reservas registradas
            </Typography>
            <Typography variant="body2" color={colors.text.secondary} sx={{ mt: 1 }}>
              Las reservas creadas aparecerán aquí
            </Typography>
          </Box>
        )}
      </Box>

      <ModalComenzarReserva
        open={openReservaModal}
        onClose={() => setOpenReservaModal(false)}
        onGuardarReserva={handleGuardarReserva}
      />

      {/* Estado vacío */}
      {!loading && filteredMesas.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: colors.background.paper,
          borderRadius: 2,
          border: `1px solid ${colors.border.light}`
        }}>
          <TableRestaurantIcon sx={{ 
            fontSize: 64, 
            color: colors.text.secondary, 
            mb: 2 
          }} />
          <Typography variant="h6" color={colors.text.secondary}>
            {searchTerm || filtroArea || filtroCapacidad || filtroEstado 
              ? 'No se encontraron mesas con los filtros aplicados' 
              : 'No hay mesas registradas en esta sucursal'
            }
          </Typography>
          <Typography variant="body2" color={colors.text.secondary} sx={{ mt: 1 }}>
            {searchTerm || filtroArea || filtroCapacidad || filtroEstado 
              ? 'Intenta con otros términos de búsqueda o limpia los filtros' 
              : 'Contacta al administrador para agregar mesas al sistema'
            }
          </Typography>
          {(searchTerm || filtroArea || filtroCapacidad || filtroEstado) && (
            <Button
              variant="contained"
              onClick={limpiarFiltros}
              sx={{
                bgcolor: colors.primary.main,
                px: 4,
                py: 1.5,
                mt: 2
              }}
            >
              Limpiar Filtros
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Reservas;