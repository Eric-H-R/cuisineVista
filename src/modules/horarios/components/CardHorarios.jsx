import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Schedule,
  People,
  AccessTime,
  Code
} from '@mui/icons-material';
import colors, { withAlpha } from '../../../theme/colores';

const CardHorario = ({ 
  horario, 
  onEdit, 
  onDesactivar,
  onAsignarUsuario,
  onGestionarDetalles 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit();
    handleClose();
  };

  const handleDesactivar = () => {
    onDesactivar();
    handleClose();
  };

  const handleAsignarUsuario = () => {
    if (onAsignarUsuario) {
      onAsignarUsuario();
    }
    handleClose();
  };

  const handleGestionarDetalles = () => {
    if (onGestionarDetalles) {
      onGestionarDetalles();
    }
    handleClose();
  };

  return (
    <Card 
      elevation={2}
      sx={{
        borderRadius: 3,
        border: `1px solid ${withAlpha(colors.secondary.main, '20')}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(88, 129, 87, 0.15)',
          borderColor: colors.secondary.main
        }
      }}
    >
      <CardContent sx={{ p: 3, pb: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ color: colors.primary.main }} />
            <Typography variant="h6" component="h2" fontWeight="600" sx={{ color: colors.primary.main }}>
              {horario.nombre}
            </Typography>
          </Box>
          
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              color: colors.text.secondary,
              '&:hover': {
                backgroundColor: withAlpha(colors.primary.main, '10')
              }
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Clave y Estado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip
            label={horario.clave}
            size="small"
            variant="outlined"
            sx={{
              borderColor: colors.primary.main,
              color: colors.primary.main,
              fontWeight: '500'
            }}
          />
          <Chip
            label={horario.estatus || 'Activo'}
            size="small"
            color={horario.estatus === 'Inactivo' ? 'default' : 'success'}
            variant="filled"
          />
        </Box>

        {/* Descripción */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {horario.descripcion}
        </Typography>

        {/* Información de Detalles */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" sx={{ color: colors.text.secondary }} />
            <Typography variant="caption" color="text.secondary">
              Días configurados: {horario.detalles?.length || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People fontSize="small" sx={{ color: colors.text.secondary }} />
            <Typography variant="caption" color="text.secondary">
              Usuarios asignados: {horario.usuarios_asignados || 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider sx={{ borderColor: colors.border.light }} />

      <CardActions sx={{ p: 2, pt: 1.5 }}>
        <Button
          size="small"
          startIcon={<Code />}
          onClick={handleGestionarDetalles}
          sx={{
            color: colors.primary.main,
            fontWeight: '500'
          }}
        >
          Gestionar Detalles
        </Button>
        
        <Button
          size="small"
          startIcon={<People />}
          onClick={handleAsignarUsuario}
          sx={{
            color: colors.accent.main,
            fontWeight: '500'
          }}
        >
          Asignar
        </Button>
      </CardActions>

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.border.light}`
          }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1 }}>
          <Edit fontSize="small" sx={{ mr: 1, color: colors.primary.main }} />
          Editar Horario
        </MenuItem>
        
        <MenuItem onClick={handleGestionarDetalles} sx={{ py: 1 }}>
          <Schedule fontSize="small" sx={{ mr: 1, color: colors.primary.main }} />
          Gestionar Detalles
        </MenuItem>
        
        <MenuItem onClick={handleAsignarUsuario} sx={{ py: 1 }}>
          <People fontSize="small" sx={{ mr: 1, color: colors.accent.main }} />
          Asignar a Usuario
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleDesactivar} sx={{ py: 1, color: colors.status.error }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Desactivar
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default CardHorario;