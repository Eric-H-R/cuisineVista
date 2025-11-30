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
  Divider,
  Collapse
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Schedule,
  People,
  AccessTime,
  List as ListIcon,
  Visibility,
  Key,
  ContentCopy
} from '@mui/icons-material';
import colors, { withAlpha } from '../../../theme/colores';
import AsignarHorarioUsuario from './AsignarHorarioUsuario';
import CardUsuariosAsignados from '../components/CardUsuariosAsignados';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';
import { toast } from 'react-toastify';

const CardHorario = ({ 
  horario, 
  onEdit, 
  onDesactivar,
  onAsignarUsuario,
  onGestionarDetalles,
  onAsignacionExitosa,
  codigos = []
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [asignacionOpen, setAsignacionOpen] = useState(false);
  const [modalUsuarioAsignadoOpen, setModalUsuarioAsignadoOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClose = () => { setAnchorEl(null); };
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
    const MIN_LOADING_TIME = 500;
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

  const handleCopiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    toast.success(`Código ${codigo} copiado`);
  };

  const formatearExpiracion = (fechaExpiracion) => {
    if (!fechaExpiracion) return 'No expira';
    const fecha = new Date(fechaExpiracion);
    return fecha.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
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

        {/* Header */}
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

        {/* Chips */}
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

        {/* Descripción */}
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

        {/* Estadísticas */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" sx={{ color: colors.accent.main }} />
            <Typography variant="caption" color={colors.accent.main}>
              Días configurados: {horario.detalles?.length || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People fontSize="small" sx={{ color: colors.accent.main }} />
            <Typography variant="caption" color={colors.accent.main}>
              Usuarios asignados: {horario.usuarios_asignados || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Key fontSize="small" sx={{ color: colors.status.warning }} />
            <Typography variant="caption" color={colors.status.warning}>
              Códigos: {codigos.length} activos
            </Typography>
          </Box>
        </Box>

        {/* Sección de Códigos */}
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            size="small"
            onClick={() => setExpanded(!expanded)}
            startIcon={<Key />}
            sx={{
              justifyContent: 'flex-start',
              color: colors.text.secondary,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              border: `1px solid ${colors.border.light}`,
              '&:hover': {
                backgroundColor: withAlpha(colors.primary.main, '8')
              }
            }}
          >
            {expanded ? 'Ocultar Códigos' : 'Ver Códigos'} ({codigos.length})
          </Button>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2, p: 2, backgroundColor: withAlpha(colors.background.light, '50'), borderRadius: 2 }}>
              {codigos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Key sx={{ fontSize: 32, color: colors.text.disabled, mb: 1 }} />
                  <Typography variant="body2" color={colors.text.secondary}>
                    No hay códigos para hoy
                  </Typography>
                  <Typography variant="caption" color={colors.text.disabled}>
                    Los códigos se generan automáticamente cada día
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {codigos.map((codigo, index) => (
                    <Box
                      key={codigo.id_turno_clave || index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: colors.background.paper,
                        border: `1px solid ${colors.border.light}`,
                        '&:hover': {
                          borderColor: colors.primary.light
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" color={colors.primary.main}>
                          {codigo.codigo}
                        </Typography>
                        <Typography variant="caption" color={colors.text.secondary}>
                          Expira: {formatearExpiracion(codigo.expira_en)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleCopiarCodigo(codigo.codigo)}
                        sx={{
                          color: colors.primary.main,
                          '&:hover': {
                            backgroundColor: withAlpha(colors.primary.main, '12')
                          }
                        }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>

      </CardContent>

      <Divider sx={{ borderColor: colors.border.light }} />

      {/* Acciones */}
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

      {/* Menú de opciones */}
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

      {/* Modales */}
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