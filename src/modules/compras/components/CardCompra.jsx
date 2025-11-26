import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  MoreVert,
  Cancel,
  ShoppingCart,
  LocalShipping,
  CalendarToday,
  Inventory,
  CheckCircle,
  Visibility
} from '@mui/icons-material';
import CompraDetalle from './CompraDetalle';
import { useState } from 'react';
import colors from '../../../theme/colores';

// Mapeo de estatus numéricos a texto (actualizado)
const MAPEO_ESTATUS = {
  1: 'Registrada',
  2: 'Inventariada', 
  3: 'Cancelada'
};

const CardCompra = ({ compra, onCancelar, onCrearRecepcion }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCancelar = () => {
    onCancelar();
    handleMenuClose();
  };

  const handleCrearRecepcion = () => {
    // Llamar al callback pasado desde la página para abrir el formulario de recepción
    if (typeof onCrearRecepcion === 'function') {
      onCrearRecepcion(compra.id_compra || compra.id);
    }
    handleMenuClose();
  };

  // Función para obtener el texto del estatus
  const getEstatusTexto = (estatusNumero) => {
    return MAPEO_ESTATUS[estatusNumero] || 'desconocido';
  };

  // Función para verificar si está cancelada
  const esCancelada = (compra) => {
    return compra.estatus === 3; // 3 = Cancelada
  };

  // Función para verificar si está inventariada
  const esInventariada = (compra) => {
    return compra.estatus === 2; // 2 = Inventariada
  };

  // Obtener estado seguro
  const getEstado = () => {
    return getEstatusTexto(compra.estatus);
  };

  // Obtener color según el estado
  const getEstadoColor = () => {
    const estado = getEstado();
    switch (estado) {
      case 'Cancelada':
        return colors.status.error; // Rojo para canceladas
      case 'Inventariada':
        return colors.status.success; // Verde para inventariadas
      case 'Registrada':
        return colors.status.info; // Azul para registradas
      default:
        return colors.text.disabled; // Gris para desconocido
    }
  };

  // Obtener icono según el estado
  const getEstadoIcono = () => {
    const estado = getEstado();
    switch (estado) {
      case 'Cancelada':
        return <Cancel />;
      case 'Inventariada':
        return <Inventory />;
      case 'Registrada':
        return <CheckCircle />;
      default:
        return <ShoppingCart />;
    }
  };

  // Verificar si se puede cancelar
  const puedeCancelar = () => {
    return !esCancelada(compra) && !esInventariada(compra); // Solo se puede cancelar si no está cancelada ni inventariada
  };

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'No disponible';
    try {
      return new Date(fechaString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        border: `1px solid ${colors.border.light}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          borderColor: getEstadoColor()
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        {/* Header con acciones */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: `${getEstadoColor()}15`,
                color: getEstadoColor(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getEstadoIcono()}
            </Box>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold">
                {compra.folio || `Compra #${compra.id_compra || compra.id}`}
              </Typography>
              <Chip
                label={getEstado()}
                size="small"
                sx={{
                  backgroundColor: getEstadoColor(),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem'
                }}
              />
            </Box>
          </Box>
          
          {puedeCancelar() && (
            <IconButton 
              size="small" 
              onClick={handleMenuOpen}
              aria-label="opciones de compra"
            >
              <MoreVert />
            </IconButton>
          )}
          {/* Botón para ver detalle */}
          <IconButton size="small" onClick={() => setOpenDetalle(true)} aria-label="ver detalle">
            <Visibility />
          </IconButton>
        </Box>

        {/* Información de la compra */}
        <Box sx={{ mb: 2 }}>
          {/* Proveedor */}
          {compra.proveedor_nombre && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocalShipping fontSize="small" sx={{ color: colors.text.secondary }} />
              <Typography variant="body2" color="text.primary">
                <strong>Proveedor:</strong> {compra.proveedor_nombre}
              </Typography>
            </Box>
          )}

          {/* Fecha */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CalendarToday fontSize="small" sx={{ color: colors.text.secondary }} />
            <Typography variant="body2" color="text.primary">
              <strong>Fecha:</strong> {formatearFecha(compra.fecha_compra || compra.created_at)}
            </Typography>
          </Box>

          {/* Sucursal */}
          {compra.sucursal_nombre && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.primary">
                <strong>Sucursal:</strong> {compra.sucursal_nombre}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* Información adicional */}
          <Typography variant="body2" color="text.secondary">
            <strong>ID:</strong> {compra.id_compra || compra.id}
          </Typography>
          
          {compra.usuario_nombre && (
            <Typography variant="body2" color="text.secondary">
              <strong>Registrado por:</strong> {compra.usuario_nombre}
            </Typography>
          )}
        </Box>

        {/* Menu de opciones */}
        {puedeCancelar() && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 160 }
            }}
          >
            <MenuItem onClick={handleCrearRecepcion} sx={{ py: 1 }}>
              <LocalShipping fontSize="small" sx={{ mr: 1, color: colors.primary.main }} />
              Crear Recepción
            </MenuItem>
            <MenuItem onClick={handleCancelar} sx={{ py: 1 }}>
              <Cancel fontSize="small" sx={{ mr: 1, color: colors.status.error }} />
              Cancelar Compra
            </MenuItem>
          </Menu>
        )}

      {/* Dialog con detalle de compra */}
      <Dialog open={openDetalle} onClose={() => setOpenDetalle(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalle de compra</DialogTitle>
        <DialogContent dividers>
          <CompraDetalle compraId={compra.id_compra || compra.id} />
        </DialogContent>
      </Dialog>
      </CardContent>
    </Card>
  );
};

export default CardCompra;