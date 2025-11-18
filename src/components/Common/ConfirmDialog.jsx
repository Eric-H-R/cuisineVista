import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CloseIcon from '@mui/icons-material/Close';

import colors from '../../theme/colores';

const ConfirmDialog = ({ open, onClose, onConfirm, title = "¿Estás seguro?", message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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

        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: colors.text.secondary }} />
        </IconButton>
      </Box>

      {/* CONTENIDO */}
      <DialogContent sx={{ padding: "0 24px 20px 24px" }}>
        <Typography
          sx={{
            fontSize: "1rem",
            color: colors.text.secondary,
            lineHeight: 1.5
          }}
        >
          {message}
        </Typography>
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
          onClick={onClose}
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
          onClick={onConfirm}
          sx={{
            background: colors.status.error,
            color: "#fff",
            textTransform: "none",
            borderRadius: 10,
            "&:hover": {
              background: "#d32f2f"
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
