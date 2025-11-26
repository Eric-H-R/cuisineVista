// components/ModalDetalleReserva.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  TableRestaurant as TableIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import colors from '../../../theme/colores';

const ModalDetalleReserva = ({ open, onClose, reserva }) => {
  if (!reserva) return null;

  const getEstadoColor = (estatus) => {
    switch (estatus) {
      case 1: return colors.status.info;
      case 2: return colors.primary.main;
      case 3: return colors.status.success;
      case 4: return colors.status.warning;
      case 5: return colors.status.error;
      default: return colors.text.disabled;
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: colors.background.light
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
          <TableIcon />
          <Typography variant="h6" component="div" fontWeight="bold">
            Detalles de Reserva #{reserva.id_reserva}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
          sx={{ color: colors.primary.contrastText }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={2}>
          {/* Estado */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={reserva.estatus_display}
                sx={{
                  backgroundColor: getEstadoColor(reserva.estatus),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              {reserva.puede_iniciar && (
                <Chip 
                  label="Lista para iniciar"
                  variant="outlined"
                  sx={{
                    borderColor: colors.status.success,
                    color: colors.status.success
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid item size={12}>
            <Divider />
          </Grid>

          {/* Información del Cliente */}
          <Grid item size={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon sx={{ color: colors.text.secondary }} />
              <Typography variant="subtitle2" color={colors.text.primary}>
                Cliente ID: {reserva.cliente_id}
              </Typography>
            </Box>
          </Grid>

          {/* Horarios */}
          <Grid item size={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TimeIcon sx={{ color: colors.text.secondary }} />
              <Typography variant="subtitle2" color={colors.text.primary}>
                Inicio: {formatearFecha(reserva.inicio)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TimeIcon sx={{ color: colors.text.secondary }} />
              <Typography variant="subtitle2" color={colors.text.primary}>
                Fin estimado: {formatearFecha(reserva.fin_estimado)}
              </Typography>
            </Box>
            <Typography variant="caption" color={colors.text.secondary}>
              Tolerancia: {reserva.tolerancia_min} minutos
            </Typography>
          </Grid>

          {/* Notas */}
          {reserva.notas && (
            <Grid item size={12}>
              <Box sx={{ mt: 2, p: 2, bgcolor: colors.background.paper, borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <NotesIcon sx={{ color: colors.text.secondary }} />
                  <Typography variant="subtitle2" color={colors.text.primary}>
                    Notas:
                  </Typography>
                </Box>
                <Typography variant="body2" color={colors.text.secondary}>
                  {reserva.notas}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Información del Sistema */}
          <Grid item size={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color={colors.text.secondary} display="block">
              Creada: {formatearFecha(reserva.created_at)}
            </Typography>
            {reserva.updated_at && (
              <Typography variant="caption" color={colors.text.secondary} display="block">
                Actualizada: {formatearFecha(reserva.updated_at)}
              </Typography>
            )}
            {reserva.recepcionista_id && (
              <Typography variant="caption" color={colors.text.secondary} display="block">
                Recepcionista ID: {reserva.recepcionista_id}
              </Typography>
            )}
            {reserva.hold_id && (
              <Typography variant="caption" color={colors.text.secondary} display="block">
                Hold ID: {reserva.hold_id}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetalleReserva;