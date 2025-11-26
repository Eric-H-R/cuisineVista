import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Warning
} from '@mui/icons-material';

import colors, { withAlpha } from '../../../theme/colores';

const CardInsumoStockBajo = ({ insumo, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    onEdit();
    handleMenuClose();
  };

  const getStockPercentage = () => {
    if (!insumo.minimo_stock || insumo.minimo_stock === 0) return 0;
    return (insumo.cantidad_actual / insumo.minimo_stock) * 100;
  };

  const getStockColor = () => {
  const percentage = getStockPercentage();
  if (percentage === 0) return colors.accent.dark;       // Crítico
  if (percentage < 50) return colors.accent.main;        // Bajo
  return colors.primary.main;                            // Bien
};


  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        border: `1.5px solid ${withAlpha(colors.status.warning, colors.alpha[20])}`,
        backgroundColor: withAlpha(colors.background.paper, colors.alpha[20]),
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0px 8px 20px rgba(0,0,0,0.12)',
          borderColor: colors.status.error
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
            
            {/* ICONO WARNING */}
            <Box
              sx={{
                p: 1,
                borderRadius: 3,
                backgroundColor: withAlpha(colors.status.warning, colors.alpha[10]),
                color: colors.status.warning,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Warning fontSize="small" />
            </Box>

            {/* CHIP */}
            <Chip
              label="STOCK BAJO"
              size="small"
              sx={{
                backgroundColor: colors.status.error,
                color: colors.primary.contrastText,
                letterSpacing: 0.5,
                fontWeight: 700,
                borderRadius: 1
              }}
            />
          </Box>

          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* NOMBRE DEL INSUMO */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.2, color: colors.text.primary }}>
          {insumo.nombre}
        </Typography>

        {/* UNIDAD */}
        <Chip
          label={insumo.unidad_clave || 'Sin unidad'}
          size="small"
          sx={{
            backgroundColor: colors.secondary.main,
            color: colors.secondary.contrastText,
            fontWeight: 600,
            borderRadius: 1,
            px: 1,
            mb: 2
          }}
        />

        {/* STOCK */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Stock Actual
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: getStockColor() }}>
              {insumo.cantidad_actual} / {insumo.minimo_stock}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={Math.min(getStockPercentage(), 100)}
            sx={{
              height: 10,
              borderRadius: 5,
              transition: '0.3s ease',
              backgroundColor: colors.border.light,
              '& .MuiLinearProgress-bar': {
                backgroundColor: getStockColor()
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Faltan: {insumo.diferencia || (insumo.minimo_stock - insumo.cantidad_actual)} {insumo.unidad_clave}
            </Typography>
            <Typography variant="caption" fontWeight={700} sx={{ color: getStockColor() }}>
              {getStockPercentage().toFixed(0)}%
            </Typography>
          </Box>
        </Box>

        {/* COSTO PROMEDIO */}
        {insumo.costo_promedio > 0 && (
          <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
            Costo promedio: ${insumo.costo_promedio?.toFixed(2)}
          </Typography>
        )}

        {/* MENU */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 150,
              py: 0.5
            }
          }}
        >
          <MenuItem onClick={handleEdit} sx={{ py: 1.2 }}>
            <Edit fontSize="small" sx={{ mr: 1, color: colors.primary.main }} />
            Editar
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default CardInsumoStockBajo;
