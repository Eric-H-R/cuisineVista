import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Inventory,
  AttachMoney
} from '@mui/icons-material';
import colors from '../../../theme/colores';

const CardInsumo = ({ insumo, onEdit, showExistencias = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit();
    handleMenuClose();
  };

  // 🎨 Colores usando tu paleta
  const getStockColor = (minimoStock, cantidadActual) => {
    if (!cantidadActual && cantidadActual !== 0) return colors.secondary.dark;

    if (cantidadActual < minimoStock) return colors.accent.dark;     // Crítico
    if (cantidadActual === minimoStock) return colors.accent.main;   // Mínimo
    return colors.primary.main;                                      // OK
  };

  const getStockText = (minimoStock, cantidadActual) => {
    if (!cantidadActual && cantidadActual !== 0) return 'Sin registro';

    if (cantidadActual < minimoStock) return 'Stock Bajo';
    if (cantidadActual === minimoStock) return 'Stock Mínimo';
    return 'Stock OK';
  };

  const claveSelect = () =>
    insumo.unidad_medida === undefined
      ? insumo.unidad_clave
      : insumo.unidad_medida.clave;

  return (
    <Card
      sx={{
        height: '100%',
        transition: '0.3s ease',
        border: `1px solid ${colors.border.light}`,
        backgroundColor: colors.background.light,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderColor: colors.primary.main
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: `${colors.primary.main}${colors.alpha[20]}`,
                color: colors.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Inventory />
            </Box>
          </Box>

          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Información del insumo */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color={colors.text.primary}>
            {insumo.nombre}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {/* Unidad */}
            <Chip
              label={claveSelect() || 'Sin unidad'}
              size="small"
              sx={{
                backgroundColor: `${colors.secondary.main}${colors.alpha[20]}`,
                color: colors.secondary.dark,
                fontWeight: 'bold'
              }}
            />

            {/* Stock mínimo */}
            {insumo.minimo_stock !== undefined && (
              <Chip
                label={`Mín: ${insumo.minimo_stock}`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: colors.accent.main,
                  color: colors.accent.main
                }}
              />
            )}
          </Box>

          {/* Existencias */}
          {showExistencias && insumo.cantidad !== undefined && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: `${colors.primary.light}${colors.alpha[10]}`,
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Existencias Actuales:
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{ color: getStockColor(insumo.minimo_stock, insumo.cantidad) }}
                >
                  {insumo.cantidad} {insumo.unidad_clave}
                </Typography>

                <Chip
                  label={getStockText(insumo.minimo_stock, insumo.cantidad)}
                  size="small"
                  sx={{
                    backgroundColor: getStockColor(insumo.minimo_stock, insumo.cantidad),
                    color: colors.primary.contrastText,
                    fontWeight: 'bold'
                  }}
                />
              </Box>

              {insumo.costo_promedio > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <AttachMoney fontSize="small" sx={{ color: colors.primary.dark }} />
                  <Typography variant="body2" color={colors.text.secondary}>
                    Costo promedio: ${insumo.costo_promedio.toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Estado general */}
          {!showExistencias && insumo.es_activo !== undefined && (
            <Chip
              label={insumo.es_activo ? 'Activo' : 'Inactivo'}
              size="small"
              sx={{
                borderColor: insumo.es_activo ? colors.primary.main : colors.border.dark,
                color: insumo.es_activo ? colors.primary.main : colors.text.secondary
              }}
              variant="outlined"
            />
          )}
        </Box>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit} sx={{ py: 1 }}>
            <Edit fontSize="small" sx={{ mr: 1, color: colors.primary.main }} />
            Editar
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default CardInsumo;
