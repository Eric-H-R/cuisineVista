import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Box,
  Avatar,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { 
  Person, 
  Schedule, 
  Group, 
  Close,
  CalendarToday,
  Email 
} from '@mui/icons-material';
import horariosService from '../services/horarios.service';
import colors from '../../../theme/colores';

const UsuariosAsignadosModal = ({ open, onClose, idHorario }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuariosAsignados = async () => {
      if (!open || !idHorario) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await horariosService.getUsuariosAsignados(idHorario);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al obtener los datos');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchUsuariosAsignados();
    }
  }, [open, idHorario]);

  const handleClose = () => {
    setData(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6,
          bgcolor: colors.background.default,
        },
      }}
    >
      {/* TÍTULO*/}
      <DialogTitle
        sx={{
          bgcolor: colors.primary.main,
          color: colors.primary.contrastText,
          py: 2.5,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Group sx={{ color: colors.primary.contrastText }} />
            <Typography variant="h6" fontWeight="bold">
              Usuarios Asignados
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose}
            size="small"
            sx={{ color: colors.primary.contrastText }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 3 }}>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: colors.primary.main }} />
          </Box>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{
              mb: 3,
              bgcolor: colors.status.error + colors.alpha[10],
              color: colors.text.primary,
              border: `1px solid ${colors.status.error}`,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        )}

        {data && (
          <>

            {/* CARD DEL HORARIO MODERNIZADO */}
            <Card 
              elevation={2}
              sx={{
                mb: 3,
                borderRadius: 3,
                border: `1px solid ${colors.border.light}`,
                bgcolor: colors.background.paper
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Schedule sx={{ mr: 1, color: colors.primary.main }} />
                  <Typography variant="h6" fontWeight="medium">
                    {data.horario.nombre}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  <strong>Clave:</strong> {data.horario.clave}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  <Chip
                    label={data.horario.es_activo ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{
                      bgcolor: data.horario.es_activo ? colors.status.success : colors.text.disabled,
                      color: colors.primary.contrastText,
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip 
                    label={`Sucursal: ${data.horario.sucursal_id}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: colors.secondary.main,
                      color: colors.secondary.dark
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            

            {/* LISTA DE USUARIOS */}
            {data.usuarios_asignados?.length > 0 ? (
              <>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ mb: 2, color: colors.text.primary }}
                >
                  Usuarios {` (${data.usuarios_asignados.length})`}:
                </Typography>

                <List sx={{ maxHeight: 420, overflowY: 'auto', pr: 1 }}>
                  {data.usuarios_asignados.map((usuario, index) => (
                    <React.Fragment key={usuario.id_usuario}>
                      <ListItem
                        sx={{
                          bgcolor: colors.background.paper,
                          mb: 2,
                          borderRadius: 3,
                          px: 2,
                          py: 2,
                          boxShadow: 1,
                          transition: "0.2s",
                          border: `1px solid ${colors.border.light}`,
                          '&:hover': {
                            boxShadow: 4,
                            transform: "scale(1.01)"
                          }
                        }}
                        alignItems="flex-start"
                      >
                        <Avatar
                          sx={{
                            bgcolor: colors.primary.main,
                            color: colors.primary.contrastText,
                            width: 52,
                            height: 52,
                            mr: 2
                          }}
                        >
                          <Person />
                        </Avatar>

                        <Box sx={{ width: '100%' }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                            {usuario.nombre}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                            <Email sx={{ fontSize: 18, mr: 1, color: colors.text.secondary }} />
                            <Typography variant="body2" color={colors.text.secondary}>
                              {usuario.email}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <CalendarToday sx={{ fontSize: 18, mr: 1, color: colors.text.secondary }} />
                            <Typography variant="body2" color={colors.text.secondary}>
                              {usuario.fecha_inicio} — {usuario.fecha_fin}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={usuario.es_activo ? "Usuario Activo" : "Usuario Inactivo"}
                              size="small"
                              sx={{
                                bgcolor: usuario.es_activo ? colors.status.success : colors.text.disabled,
                                color: colors.primary.contrastText,
                                fontWeight: 'bold'
                              }}
                            />
                            <Chip
                              label={`ID: ${usuario.id_usuario}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: colors.secondary.main,
                                color: colors.secondary.dark
                              }}
                            />
                          </Box>
                        </Box>
                      </ListItem>

                      {index < data.usuarios_asignados.length - 1 && (
                        <Divider sx={{ borderColor: colors.border.light }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </>
            ) : (
              <Box sx={{
                textAlign: 'center',
                py: 6,
                bgcolor: colors.background.paper,
                borderRadius: 3,
                border: `1px solid ${colors.border.light}`,
                boxShadow: 2
              }}>
                <Group sx={{ fontSize: 60, color: colors.text.disabled, mb: 2 }} />
                <Typography variant="h6" color={colors.text.secondary} gutterBottom>
                  No hay usuarios asignados
                </Typography>
                <Typography variant="body2" color={colors.text.disabled}>
                  Este horario no tiene usuarios asignados.
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {/* BOTÓN CERRAR */}
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            bgcolor: colors.accent.main,
            color: colors.accent.contrastText,
            fontWeight: 'bold',
            px: 4,
            py: 1.2,
            borderRadius: 2,
            '&:hover': { bgcolor: colors.accent.dark }
          }}
        >
          Cerrar
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default UsuariosAsignadosModal;
