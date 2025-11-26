import React, {useState} from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button
} from '@mui/material';
import {
  TableRestaurant as TableIcon,
  Group as GroupIcon,
  EventAvailable as AvailableIcon,
  EventBusy as BusyIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import colors from '../../../theme/colores';
import ModalFormularioReserva from '../components/ModalFormularioReserva'

const CardMesa = ({ 
  mesa, 
  onReservar, 
  disabled = false, 
  temporizadorActivo = false, 
  seleccionada = false,
  holdActual,
  reservaData,
  onCrearReserva
}) => {

  const [modalFormularioOpen, setModalFormularioOpen] = useState(false);

  const getEstadoColor = (estatus) => {
    switch (estatus) {
      case 1: // Disponible
        return colors.status.success;
      case 2: // Ocupada
        return colors.status.error;
      case 3: // Reservada
        return colors.status.warning;
      default:
        return colors.text.disabled;
    }
  };

  const getEstadoIcon = (estatus) => {
    switch (estatus) {
      case 1:
        return <AvailableIcon />;
      case 2:
        return <BusyIcon />;
      case 3:
        return <BusyIcon />;
      default:
        return <BusyIcon />;
    }
  };

  // BOTÓN ACTIVO SOLO CUANDO:
  // - La mesa está activa Y
  // - La mesa está disponible Y
  // - El temporizador está activo
  const puedeReservar = mesa.es_activa && 
                       mesa.estatus_actual === 1 && 
                       temporizadorActivo && 
                       !disabled;


  const temporizadorInactivo = !temporizadorActivo && mesa.es_activa && mesa.estatus_actual === 1;


  const handleSeleccionarMesa = async () => {
    if (!puedeReservar) return;
    try {
      // Llamar a la función del padre para crear el HOLD
      await onReservar(mesa);
      // Si el HOLD se creó exitosamente, abrir el formulario
      setModalFormularioOpen(true);
    } catch (error) {
    }
  };
  const handleCrearReserva = async (datosReserva) => {
    try {
      await onCrearReserva(datosReserva);
      setModalFormularioOpen(false);
    } catch (error) {
      // El error se maneja en el padre
      throw error;
    }
  };

  const handleCloseModal = () => {
    setModalFormularioOpen(false);
  };
  return (
    <>
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        bgcolor: seleccionada ? `${colors.primary.light}20` : colors.background.light,
        border: `2px solid ${seleccionada ? colors.primary.main :
                             puedeReservar ? colors.primary.main : 
                             temporizadorInactivo ? colors.secondary.light : 
                             colors.border.light}`,
        opacity: mesa.es_activa ? 1 : 0.6,
        cursor: puedeReservar ? 'pointer' : 'default',
        '&:hover': {
          boxShadow: puedeReservar ? 6 : 0,
          transform: puedeReservar ? 'translateY(-2px)' : 'none',
          borderColor: puedeReservar ? colors.primary.dark : 
                       temporizadorInactivo ? colors.secondary.main : 
                       colors.border.light
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header con código y estado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableIcon sx={{ 
              color: puedeReservar ? colors.primary.main : 
                     temporizadorInactivo ? colors.secondary.main : 
                     colors.text.secondary 
            }} />
            <Typography variant="h6" component="h3" fontWeight="bold" color={colors.text.primary}>
              {mesa.codigo_mesa}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
            <Chip 
              label={mesa.estatus_display}
              size="small"
              sx={{
                backgroundColor: getEstadoColor(mesa.estatus_actual),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
            {!mesa.es_activa && (
              <Chip 
                label="Inactiva"
                size="small"
                variant="outlined"
                sx={{
                  borderColor: colors.status.error,
                  color: colors.status.error,
                  fontSize: '0.6rem'
                }}
              />
            )}
            {temporizadorInactivo && (
              <Chip 
                label="Esperando reserva"
                size="small"
                variant="outlined"
                icon={<TimeIcon />}
                sx={{
                  borderColor: colors.secondary.main,
                  color: colors.secondary.main,
                  fontSize: '0.6rem'
                }}
              />
            )}
          </Box>
        </Box>

        {/* Información de capacidad */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <GroupIcon sx={{ 
            fontSize: 18, 
            color: puedeReservar ? colors.primary.main : 
                   temporizadorInactivo ? colors.secondary.main : 
                   colors.text.secondary 
          }} />
          <Typography variant="body1" color={colors.text.primary} fontWeight="medium">
            Capacidad: {mesa.capacidad} personas
          </Typography>
        </Box>

        {/* Información adicional */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color={colors.text.secondary} display="block">
            Área ID: {mesa.area_id}
          </Typography>
          {mesa.created_at && (
            <Typography variant="caption" color={colors.text.secondary} display="block">
              Creada: {new Date(mesa.created_at).toLocaleDateString('es-MX')}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Acciones */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant={puedeReservar ? "contained" : "outlined"}
          startIcon={puedeReservar ? <AvailableIcon /> : getEstadoIcon(mesa.estatus_actual)}
          onClick={handleSeleccionarMesa}
          disabled={!puedeReservar}
          sx={{
            bgcolor: puedeReservar ? colors.primary.main : 'transparent',
            color: puedeReservar ? colors.primary.contrastText : 
                   temporizadorInactivo ? colors.secondary.main : 
                   colors.text.disabled,
            borderColor: puedeReservar ? colors.primary.main : 
                         temporizadorInactivo ? colors.secondary.main : 
                         colors.border.light,
            '&:hover': {
              bgcolor: puedeReservar ? colors.primary.dark : 'transparent',
              borderColor: puedeReservar ? colors.primary.dark : 
                           temporizadorInactivo ? colors.secondary.dark : 
                           colors.border.light
            },
            '&:disabled': {
              bgcolor: 'transparent',
              color: temporizadorInactivo ? colors.secondary.light : colors.text.disabled,
              borderColor: temporizadorInactivo ? colors.secondary.light : colors.border.light
            }
          }}
        >
          {puedeReservar ? 'Seleccionar Mesa' : 
           temporizadorInactivo ? 'Inicia Reserva Primero' : 
           mesa.estatus_display}
        </Button>
      </Box>
    </Card>
    <ModalFormularioReserva
        open={modalFormularioOpen}
        onClose={handleCloseModal}
        onCrearReserva={handleCrearReserva}
        mesaSeleccionada={mesa}
        holdActual={holdActual}
        reservaData={reservaData}
        temporizadorActivo={temporizadorActivo}
      />
    </>
  );
};

export default CardMesa;