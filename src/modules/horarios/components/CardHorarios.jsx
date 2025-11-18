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
  List as ListIcon,
  Visibility
} from '@mui/icons-material';
import colors, { withAlpha } from '../../../theme/colores';
import AsignarHorarioUsuario from './AsignarHorarioUsuario';
import CardUsuariosAsignados from '../components/CardUsuariosAsignados';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';

const CardHorario = ({ 
  horario, 
  onEdit, 
  onDesactivar,
  onAsignarUsuario,
  onGestionarDetalles,
  onAsignacionExitosa
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [asignacionOpen, setAsignacionOpen] = useState(false);
  const [modalUsuarioAsignadoOpen, setModalUsuarioAsignadoOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClose = () => { setAnchorEl(null);};
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleEdit = () => { onEdit(); handleClose(); };
  const handleDesactivar = () => { onDesactivar(); handleClose(); };
  const handleAbrirAsignacion = () => { setAsignacionOpen(true); handleClose(); };
  const handleCerrarAsignacion = () => setAsignacionOpen(false);
  const handleAsignacionExitosa = () => {
    setAsignacionOpen(false);
    if (onAsignarUsuario) onAsignarUsuario();
    if (onAsignacionExitosa) onAsignacionExitosa();
  };
  const handleGestionarDetalles = () => { if (onGestionarDetalles) onGestionarDetalles(); handleClose(); };
  const handleVerUsuarios = () => setModalUsuarioAsignadoOpen(true);
  const handleCloseModal = () => setModalUsuarioAsignadoOpen(false);

  

const handleConfirmDesactivar = async () => {
  setOpenConfirm(false);
  setLoading(true);
  const MIN_LOADING_TIME = 500; // ⏱️ medio segundo recomendado
  const startTime = Date.now();

  try {
    await onDesactivar(); 
  } catch (err) {
    console.error(err);
  } finally {
    const elapsed = Date.now() - startTime;
    const remaining = MIN_LOADING_TIME - elapsed;

    if (remaining > 0) {
      setTimeout(() => setLoading(false), remaining);
    } else {
      setLoading(false);
    }
  }
};

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        border: `1px solid ${withAlpha(colors.secondary.main, '18')}`,
        backgroundColor: colors.background.default,
        transition: '0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
          borderColor: colors.secondary.main
        }
      }}
    >
      <CardContent sx={{ p: 3, pb: 2 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ color: colors.primary.main }} />
            <Typography variant="h6" fontWeight="700" sx={{ color: colors.primary.main }}>
              {horario.nombre}
            </Typography>
          </Box>

        <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              color: colors.text.secondary,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: withAlpha(colors.primary.main, '12')
              }
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Chip
            label={horario.clave}
            size="small"
            variant="outlined"
            sx={{
              borderColor: colors.primary.main,
              color: colors.primary.main,
              fontWeight: 600,
              borderRadius: 2
            }}
          />
          <Chip
            label={horario.estatus || 'Activo'}
            size="small"
            variant="filled"
            color={horario.estatus === 'Inactivo' ? 'default' : 'success'}
            sx={{
              fontWeight: 600,
              borderRadius: 2
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color={colors.text.secondary}
          sx={{
            mb: 2,
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {horario.descripcion}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" sx={{ color: colors.accent.main }} />
            <Typography variant="caption" color={colors.accent.main}>
              Días configurados: {horario.detalles?.length || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People fontSize="small" sx={{ color: colors.accent.main}} />
            <Typography variant="caption" color={colors.accent.main}>
              Usuarios asignados: {horario.usuarios_asignados || 0}
            </Typography>
          </Box>
        </Box>

      </CardContent>

      <Divider sx={{ borderColor: colors.border.light }} />

      <CardActions sx={{ p: 2, pt: 1.5, justifyContent: 'space-between' }}>
        <Button
          size="small"
          startIcon={<ListIcon />}
          onClick={handleGestionarDetalles}
          sx={{
            color: colors.primary.main,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { opacity: 0.85 }
          }}
        >
          Gestionar Detalles
        </Button>

        <Button
          size="small"
          startIcon={<People />}
          onClick={handleAbrirAsignacion}
          sx={{
            color: colors.accent.main,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { opacity: 0.85 }
          }}
        >
          Asignar Usuarios
        </Button>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 6px 22px rgba(0,0,0,0.12)',
            border: `1px solid ${colors.border.light}`
          }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.2 }}>
          <Edit fontSize="small" sx={{ mr: 1, color: colors.primary.main }} />
          Editar Horario
        </MenuItem>

        <MenuItem onClick={handleGestionarDetalles} sx={{ py: 1.2 }}>
          <Visibility fontSize="small" sx={{ mr: 1, color: colors.primary.main }} />
          Ver Detalles
        </MenuItem>

        <MenuItem onClick={handleVerUsuarios} sx={{ py: 1.2 }}>
          <People fontSize="small" sx={{ mr: 1, color: colors.accent.main }} />
          Usuarios Asignados
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => {
                    handleMenuClose();
                    setOpenConfirm(true);
                  }}
          sx={{ py: 1.2, color: colors.status.error }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Desactivar
        </MenuItem>
      </Menu>

      <AsignarHorarioUsuario
        horario={horario}
        open={asignacionOpen}
        onClose={handleCerrarAsignacion}
        onAsignacionExitosa={handleAsignacionExitosa}
      />

      <CardUsuariosAsignados
        open={modalUsuarioAsignadoOpen}
        onClose={handleCloseModal}
        idHorario={horario.id_horario}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDesactivar}
        title="Desactivar horario"
        message="¿Estás seguro que deseas desactivar este horario?"
      />

     
    </Card>
  );
};

export default CardHorario;
