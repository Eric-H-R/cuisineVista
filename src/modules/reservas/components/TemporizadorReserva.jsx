import React from 'react';
import {
  Alert,
  Button,
  Box,
  Typography
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import colors from '../../../theme/colores';

const TemporizadorReserva = ({ 
  temporizadorActivo, 
  tiempoRestante, 
  reservaData, 
  onCancelar 
}) => {
  if (!temporizadorActivo && !reservaData) return null;

  // Formatear tiempo para mostrar
  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  const getSeverity = () => {
    if (tiempoRestante > 120) return "info"; // Más de 2 minutos
    if (tiempoRestante > 60) return "warning"; // Entre 1-2 minutos
    return "error"; // Menos de 1 minuto
  };

  const getBackgroundColor = () => {
    if (tiempoRestante > 120) return `${colors.status.info}20`;
    if (tiempoRestante > 60) return `${colors.status.warning}20`;
    return `${colors.status.error}20`;
  };

  const getBorderColor = () => {
    if (tiempoRestante > 120) return colors.status.info;
    if (tiempoRestante > 60) return colors.status.warning;
    return colors.status.error;
  };

  return (
    <Alert 
      severity={getSeverity()}
      sx={{ 
        mb: 2,
        backgroundColor: getBackgroundColor(),
        border: `1px solid ${getBorderColor()}`
      }}
      action={
        <Button 
          color="inherit" 
          size="small" 
          startIcon={<CancelIcon />}
          onClick={onCancelar}
        >
          Cancelar
        </Button>
      }
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon />
        <Box>
          <Typography variant="body2" fontWeight="bold">
            Reserva en progreso
          </Typography>
          <Typography variant="body2">
            Tiempo restante para completar: <strong>{formatearTiempo(tiempoRestante)}</strong>
          </Typography>
          {reservaData && (
            <>
              <Typography variant="body2">
                Duración de reserva: <strong>{reservaData.duracion} hora{reservaData.duracion !== 1 ? 's' : ''}</strong>
              </Typography>
              {reservaData.notas && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  <strong>Notas:</strong> {reservaData.notas}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>
    </Alert>
  );
};

export default TemporizadorReserva;