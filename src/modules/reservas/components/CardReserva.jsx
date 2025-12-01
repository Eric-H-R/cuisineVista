import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as TimeIcon,
  TableRestaurant as TableIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import colors from '../../../theme/colores';
import ModalDetalleReserva from './ModalDetalleReserva';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';

const CardReserva = ({ reserva, onCancelar, onEditar }) => {
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); 

  const getEstadoColor = (estatus) => {
    switch (estatus) {
      case 1: // Programada
        return colors.status.info;
      case 2: // Confirmada
        return colors.primary.main;
      case 3: // En curso
        return colors.status.success;
      case 4: // Completada
        return colors.status.warning;
      case 5: // Cancelada
        return colors.status.error;
      default:
        return colors.text.disabled;
    }
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const puedeCancelar = reserva.estatus === 1 || reserva.estatus === 2; // Programada o Confirmada

  const handleVerDetalles = () => {
    setModalDetalleOpen(true);
  };

  const handleCloseModal = () => {
    setModalDetalleOpen(false);
  };

  const handleAbrirConfirmacion = () => {
    setConfirmDialogOpen(true);
  };

  const handleCerrarConfirmacion = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmarCancelacion = (motivo) => {
    onCancelar(reserva, motivo);
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          bgcolor: colors.background.light,
          border: `1px solid ${colors.border.light}`,
          '&:hover': {
            boxShadow: 2,
            borderColor: colors.primary.light
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* Header con ID y estado */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableIcon sx={{ color: colors.primary.main }} />
              <Typography variant="h6" component="h3" fontWeight="bold" color={colors.text.primary}>
                Reserva #{reserva.id_reserva}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Chip 
                label={reserva.estatus_display}
                size="small"
                sx={{
                  backgroundColor: getEstadoColor(reserva.estatus),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem'
                }}
              />
              {reserva.puede_iniciar && (
                <Chip 
                  label="Lista para iniciar"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: colors.status.success,
                    color: colors.status.success,
                    fontSize: '0.6rem'
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Información del cliente */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
            <Typography variant="body2" color={colors.text.primary}>
              Cliente ID: {reserva.cliente_id}
            </Typography>
          </Box>

          {/* Horarios */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TimeIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
              <Typography variant="body2" color={colors.text.primary}>
                <strong>Inicio:</strong> {formatearFecha(reserva.inicio)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TimeIcon sx={{ fontSize: 16, color: colors.text.secondary }} />
              <Typography variant="body2" color={colors.text.primary}>
                <strong>Fin estimado:</strong> {formatearFecha(reserva.fin_estimado)}
              </Typography>
            </Box>
            <Typography variant="caption" color={colors.text.secondary}>
              Tolerancia: {reserva.tolerancia_min} min
            </Typography>
          </Box>

          {/* Información adicional */}
          {reserva.notas && (
            <Box sx={{ mt: 2, p: 1, bgcolor: colors.background.paper, borderRadius: 1 }}>
              <Typography variant="caption" color={colors.text.secondary}>
                <strong>Notas:</strong> {reserva.notas}
              </Typography>
            </Box>
          )}

          {/* Fechas del sistema */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color={colors.text.secondary} display="block">
              Creada: {formatearFecha(reserva.created_at)}
            </Typography>
            {reserva.updated_at && (
              <Typography variant="caption" color={colors.text.secondary} display="block">
                Actualizada: {formatearFecha(reserva.updated_at)}
            </Typography>
            )}
          </Box>
        </CardContent>

        {/* Acciones */}
        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<CancelIcon />}
            onClick={handleAbrirConfirmacion}
            disabled={!puedeCancelar}
            sx={{
              color: colors.status.error,
              borderColor: colors.status.error,
              '&:hover': {
                backgroundColor: `${colors.status.error}10`,
                borderColor: colors.status.error
              },
              '&:disabled': {
                color: colors.text.disabled,
                borderColor: colors.border.light
              }
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          
          <Box sx={{ flex: 1 }} />
          
          <IconButton 
            size="small"
            onClick={handleVerDetalles}
            sx={{
              color: colors.primary.main,
              '&:hover': {
                backgroundColor: `${colors.primary.main}10`
              }
            }}
          >
            <ViewIcon />
          </IconButton>
        </Box>
      </Card>

      {/* Modal de detalles de reserva */}
      <ModalDetalleReserva
        open={modalDetalleOpen}
        onClose={handleCloseModal}
        reserva={reserva}
      />

      {/* Diálogo de confirmación para cancelar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCerrarConfirmacion}
        onConfirm={handleConfirmarCancelacion}
        title="Cancelar Reserva"
        message={`¿Estás seguro de que deseas cancelar la reserva #${reserva.id_reserva}? Esta acción no se puede deshacer.`}
        showMotivoInput={true} 
      />
    </>
  );
};

export default CardReserva;