import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  AccessTime as TimeIcon,
  Cancel 
} from '@mui/icons-material';
import colors from '../../../theme/colores';

const ModalComenzarReserva = ({ open, onClose, onGuardarReserva }) => {
  const [duracion, setDuracion] = useState('');
  const [notas, setNotas] = useState('');

  const handleGuardar = () => {
    if (!duracion || duracion <= 0) {
      return;
    }

    const datosReserva = {
      duracion: parseInt(duracion, 10), // Duración en horas (número entero)
      notas: notas.trim(),
      fechaCreacion: new Date().toISOString(),
      temporizador: 300 // 5 minutos para completar la reserva
    };

    onGuardarReserva(datosReserva);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setDuracion('');
    setNotas('');
  };

  const handleClose = () => {
    limpiarFormulario();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
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
        bgcolor: colors.primary.dark,
        color: colors.primary.contrastText,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
          <TimeIcon />
          <Typography variant="h6" component="div" fontWeight="bold">
            Comenzar Reserva
          </Typography>
        </Box>
        <IconButton 
          onClick={handleClose}
          sx={{ color: colors.primary.contrastText }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, mt:3 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              label="Duración de la reserva (horas)"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              fullWidth
              type="number"
              inputProps={{ 
                min: 1, 
                max: 12,
                step: 1
              }}
              required
              error={!duracion || duracion <= 0}
              helperText={!duracion || duracion <= 0 ? 
                "La duración es requerida y debe ser mayor a 0" : 
                ""
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: colors.primary.light,
                  },
                }
              }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Notas de la reserva (opcional)"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Ej: Mesa para cumpleaños, cliente especial, requerimientos específicos..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: colors.primary.light,
                  },
                }
              }}
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ 
              p: 2, 
              bgcolor: colors.background.paper,
              borderRadius: 1,
              border: `1px solid ${colors.border.light}`
            }}>
              <Typography variant="body2" color={colors.text.secondary}>
                <strong>Nota:</strong> Al guardar, comenzará un temporizador de 3 minutos 
                para completar la selección de mesa y detalles de la reserva.
              </Typography>
              <Typography variant="caption" color={colors.text.secondary} display="block" sx={{ mt: 1 }}>
                <strong>Duración:</strong> Número entero de horas (1, 2, 3, etc.)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: `1px solid ${colors.border.light}`
      }}>
        <Button
          startIcon={<Cancel />}
          onClick={handleClose}
          sx={{
            color: colors.accent.main,
            borderColor: colors.border.main,
            '&:hover': {
              borderColor: colors.accent.main,
              color: colors.accent.dark,
              bgcolor: colors.background.paper
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          disabled={!duracion || duracion <= 0}
          sx={{
            bgcolor: colors.primary.main,
            color: 'white',
            px: 2,
            '&:hover': {
              bgcolor: colors.primary.dark
            },
            '&:disabled': {
              bgcolor: colors.primary.light
            }
          }}
        >
          Guardar y Comenzar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalComenzarReserva;