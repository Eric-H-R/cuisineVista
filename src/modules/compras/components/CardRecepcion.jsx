// CardRecepcion.js
import React, {useState} from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  MoreVert,
  Cancel,
  LocalShipping,
  CalendarToday,
  CheckCircle,
  Visibility,
  ShoppingCart
} from '@mui/icons-material';
import colors from '../../../theme/colores';
// Mapeo de estatus numéricos a texto para recepciones
const MAPEO_ESTATUS_RECEPCION = {
  1: 'Activa',
  2: 'Procesada', 
  3: 'Cancelada'
};

const CardRecepcion = ({ recepcion, onCancelar, onVerDetalle }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCancelar = () => {
    onCancelar(recepcion);
    handleMenuClose();
  };

  // Función para obtener el texto del estatus
  const getEstatusTexto = (estatusNumero) => {
    return MAPEO_ESTATUS_RECEPCION[estatusNumero] || 'desconocido';
  };

  // Obtener color según el estado
  const getEstadoColor = () => {
    const estado = getEstatusTexto(recepcion.estatus);
    switch (estado) {
      case 'Cancelada':
        return colors.status.error;
      case 'Procesada':
        return colors.status.success;
      case 'Activa':
        return colors.status.info;
      default:
        return colors.text.disabled;
    }
  };

  // Obtener icono según el estado
  const getEstadoIcono = () => {
    const estado = getEstatusTexto(recepcion.estatus);
    switch (estado) {
      case 'Cancelada':
        return <Cancel />;
      case 'Procesada':
        return <CheckCircle />;
      case 'Activa':
        return <LocalShipping />;
      default:
        return <ShoppingCart />;
    }
  };

  // Verificar si se puede cancelar
  const puedeCancelar = () => {
    return recepcion.estatus === 1; // Solo se puede cancelar si está activa (estatus 1)
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
                Recepción #{recepcion.id_recepcion}
              </Typography>
              <Chip
                label={getEstatusTexto(recepcion.estatus)}
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
          
          <Box sx={{ display: 'flex', gap: 1 }}>            
            {puedeCancelar() && (
              <IconButton 
                size="small" 
                onClick={handleMenuOpen}
                aria-label="opciones de recepción"
              >
                <MoreVert />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Información de la recepción */}
        <Box sx={{ mb: 2 }}>
          {/* Compra asociada */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ShoppingCart fontSize="small" sx={{ color: colors.text.secondary }} />
            <Typography variant="body2" color="text.primary">
              <strong>Compra:</strong> #{recepcion.compra_id}
            </Typography>
          </Box>

          {/* Fecha de recepción */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CalendarToday fontSize="small" sx={{ color: colors.text.secondary }} />
            <Typography variant="body2" color="text.primary">
              <strong>Fecha Recepción:</strong> {formatearFecha(recepcion.fecha_recepcion)}
            </Typography>
          </Box>

          {/* Recibido por */}
          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
            <strong>Recibido por:</strong> {recepcion.usuario_recibe}
          </Typography>

          {/* Notas */}
          {recepcion.notas && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              "{recepcion.notas}"
            </Typography>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* Información adicional */}
          <Typography variant="body2" color="text.secondary">
            <strong>ID Recepción:</strong> {recepcion.id_recepcion}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            <strong>Creado:</strong> {formatearFecha(recepcion.created_at)}
          </Typography>
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
            <MenuItem onClick={handleCancelar} sx={{ py: 1 }}>
              <Cancel fontSize="small" sx={{ mr: 1, color: colors.status.error }} />
              Cancelar Recepción
            </MenuItem>
          </Menu>
        )}
      </CardContent>
    </Card>
  );
};

export default CardRecepcion;