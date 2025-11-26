import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CloseIcon from '@mui/icons-material/Close';

import colors from '../../theme/colores';

const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "¿Estás seguro?", 
  message,
  showMotivoInput = false // Nueva prop para mostrar el campo de motivo
}) => {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    if (showMotivoInput && !motivo.trim()) {
      return; // No permitir confirmar si el motivo está vacío
    }
    onConfirm(motivo.trim());
    setMotivo(''); // Limpiar el motivo después de confirmar
  };

  const handleClose = () => {
    setMotivo(''); // Limpiar el motivo al cerrar
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        elevation: 6,
        style: {
          borderRadius: 16,
          padding: "8px 6px",
          background: colors.background.light,
        }
      }}
    >

      {/* ENCABEZADO */}
      <Box
        sx={{
          padding: "12px 20px 4px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberRoundedIcon
            sx={{
              color: colors.status.warning,
              fontSize: 32
            }}
          />
          <DialogTitle
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: colors.text.primary,
              padding: 0
            }}
          >
            {title}
          </DialogTitle>
        </Box>

        <IconButton onClick={handleClose}>
          <CloseIcon sx={{ color: colors.text.secondary }} />
        </IconButton>
      </Box>

      {/* CONTENIDO */}
      <DialogContent sx={{ padding: "0 24px 20px 24px" }}>
        <Typography
          sx={{
            fontSize: "1rem",
            color: colors.text.secondary,
            lineHeight: 1.5,
            mb: showMotivoInput ? 2 : 0
          }}
        >
          {message}
        </Typography>

        {/* Campo de motivo (solo se muestra cuando showMotivoInput es true) */}
        {showMotivoInput && (
          <TextField
            label="Motivo de cancelación *"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Ingresa el motivo por el cual cancelas esta reserva..."
            required
            error={!motivo.trim()}
            helperText={!motivo.trim() ? "El motivo es requerido" : ""}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: colors.primary.light,
                },
              }
            }}
          />
        )}
      </DialogContent>

      {/* ACCIONES */}
      <DialogActions
        sx={{
          padding: "12px 20px 20px 20px",
          display: "flex",
          justifyContent: "flex-end",
          gap: 2
        }}
      >

        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderColor: colors.border.main,
            color: colors.text.secondary,
            textTransform: "none",
            borderRadius: 10,
            "&:hover": {
              background: colors.secondary.light,
              borderColor: colors.secondary.dark
            }
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={showMotivoInput && !motivo.trim()} // Deshabilitar si no hay motivo
          sx={{
            background: colors.status.error,
            color: "#fff",
            textTransform: "none",
            borderRadius: 10,
            "&:hover": {
              background: "#d32f2f"
            },
            '&:disabled': {
              background: colors.text.disabled,
              color: colors.background.light
            }
          }}
        >
          Confirmar
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;