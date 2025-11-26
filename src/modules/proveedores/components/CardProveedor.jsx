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
  LocalShipping,
  Email,
  Phone
} from '@mui/icons-material';
import { useState } from 'react';
import colors from '../../../theme/colores';

const CardProveedor = ({ proveedor, onEdit, onEliminar }) => {
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

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        border: `1px solid ${colors.border.light}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          borderColor: colors.primary.light
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
                backgroundColor: `${colors.primary.main}15`,
                color: colors.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LocalShipping />
            </Box>
          </Box>
          
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            aria-label="opciones de proveedor"
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Información del proveedor */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
            {proveedor.nombre}
          </Typography>
          
          {/* Información de contacto */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" sx={{ color: colors.text.secondary }} />
              <Typography variant="body2" color="text.primary">
                {proveedor.email}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" sx={{ color: colors.text.secondary }} />
              <Typography variant="body2" color="text.primary">
                {proveedor.telefono}
              </Typography>
            </Box>
          </Box>

          {/* Estado del proveedor */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label={proveedor.es_activo ? "Activo" : "Inactivo"}
              size="small"
              color={proveedor.es_activo ? "success" : "default"}
              variant="outlined"
            />
            
            {proveedor.created_at && (
              <Chip
                label={`Registrado: ${new Date(proveedor.created_at).toLocaleDateString()}`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: colors.secondary.main,
                  color: colors.secondary.dark
                }}
              />
            )}
          </Box>
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
          <MenuItem onClick={handleDelete} sx={{ py: 1 }}>
            <Delete fontSize="small" sx={{ mr: 1, color: colors.status.error }} />
            Eliminar
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default CardProveedor;