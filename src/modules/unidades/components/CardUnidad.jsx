import React from 'react';
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
  Delete,
  Straighten,
  Functions,
  Calculate
} from '@mui/icons-material';
import { useState } from 'react';
import colors from '../../../theme/colores';

const CardUnidad = ({ unidad, onEdit, onEliminar }) => {
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

  const handleDelete = () => {
    onEliminar();
    handleMenuClose();
  };

  // Determinar icono y color según el tipo de unidad
  const getUnidadInfo = (clave) => {
    const claveLower = clave?.toLowerCase();
    
    if (claveLower?.includes('kg') || claveLower?.includes('g') || claveLower?.includes('lb')) {
      return {
        icon: <Straighten />,
        color: colors.primary.main,
        tipo: 'Peso'
      };
    }
    
    if (claveLower?.includes('lt') || claveLower?.includes('ml') || claveLower?.includes('l')) {
      return {
        icon: <Functions />,
        color: colors.status.info,
        tipo: 'Volumen'
      };
    }
    
    if (claveLower?.includes('m') || claveLower?.includes('cm') || claveLower?.includes('mm')) {
      return {
        icon: <Straighten />,
        color: colors.accent.main,
        tipo: 'Longitud'
      };
    }
    
    return {
      icon: <Calculate />,
      color: colors.secondary.main,
      tipo: 'General'
    };
  };

  const unidadInfo = getUnidadInfo(unidad.clave);

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        border: `1px solid ${colors.border.light}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          borderColor: unidadInfo.color
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
                backgroundColor: `${unidadInfo.color}15`,
                color: unidadInfo.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {unidadInfo.icon}
            </Box>
            <Box>
              <Chip
                label={unidad.clave}
                size="small"
                sx={{
                  backgroundColor: unidadInfo.color,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
          
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            aria-label="opciones de unidad"
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Información de la unidad */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
            {unidad.nombre}
          </Typography>
          
          {unidad.simbolo && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Símbolo:</strong> {unidad.simbolo}
            </Typography>
          )}
          
          <Chip
            label={unidadInfo.tipo}
            size="small"
            variant="outlined"
            sx={{
              borderColor: unidadInfo.color,
              color: unidadInfo.color,
              fontSize: '0.7rem'
            }}
          />
        </Box>

        {/* Menu de opciones */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 140 }
          }}
        >
          <MenuItem onClick={handleEdit} sx={{ py: 1 }}>
            <Edit fontSize="small" sx={{ mr: 1, color: colors.primary.main }} />
            Editar
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default CardUnidad;