import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Cancel,
  Save,
  Schedule,
  Add,
  Delete,
  AccessTime
} from '@mui/icons-material';
import colors, { withAlpha } from '../../../theme/colores';

const DIAS_SEMANA = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 0, nombre: 'Domingo' }
];

const FormularioDetallesHorario = ({ 
  open, 
  onClose, 
  onSave, 
  horario,
  loading = false 
}) => {
  const [detalles, setDetalles] = useState([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    tolerancia_min: 10
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (horario && open) {
      // Cargar detalles existentes del horario
      setDetalles(horario.detalles || []);
    } else {
      setDetalles([]);
      setNuevoDetalle({
        dia_semana: '',
        hora_inicio: '',
        hora_fin: '',
        tolerancia_min: 10
      });
    }
    setErrors({});
  }, [horario, open]);

  const handleNuevoDetalleChange = (field, value) => {
    setNuevoDetalle(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validarDetalle = (detalle) => {
    const newErrors = {};

    if (!detalle.dia_semana && detalle.dia_semana !== 0) {
      newErrors.dia_semana = 'El día es requerido';
    }

    if (!detalle.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es requerida';
    }

    if (!detalle.hora_fin) {
      newErrors.hora_fin = 'La hora de fin es requerida';
    }

    if (detalle.hora_inicio && detalle.hora_fin && detalle.hora_inicio >= detalle.hora_fin) {
      newErrors.hora_fin = 'La hora de fin debe ser mayor a la hora de inicio';
    }

    if (!detalle.tolerancia_min && detalle.tolerancia_min !== 0) {
      newErrors.tolerancia_min = 'La tolerancia es requerida';
    }

    return newErrors;
  };

  const agregarDetalle = () => {
    const newErrors = validarDetalle(nuevoDetalle);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Verificar que no exista ya un detalle para este día
    const existeDia = detalles.some(detalle => detalle.dia_semana === nuevoDetalle.dia_semana);
    if (existeDia) {
      setErrors({ dia_semana: 'Ya existe un horario para este día' });
      return;
    }

    setDetalles(prev => [...prev, { ...nuevoDetalle, id: Date.now() }]);
    setNuevoDetalle({
      dia_semana: '',
      hora_inicio: '',
      hora_fin: '',
      tolerancia_min: 10
    });
    setErrors({});
  };

  const eliminarDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (detalles.length === 0) {
      toast.error('Debe agregar al menos un detalle de horario');
      return;
    }

    const detallesData = {
      horario_id: horario.id_horario,
      detalles: detalles.map(detalle => ({
        dia_semana: parseInt(detalle.dia_semana),
        hora_inicio: detalle.hora_inicio,
        hora_fin: detalle.hora_fin,
        tolerancia_min: parseInt(detalle.tolerancia_min)
      }))
    };

    onSave(detallesData);
  };

  const getNombreDia = (diaId) => {
    const dia = DIAS_SEMANA.find(d => d.id === diaId);
    return dia ? dia.nombre : `Día ${diaId}`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(88, 129, 87, 0.2)',
          border: `1px solid ${withAlpha(colors.secondary.main, '20')}`,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: colors.primary.main, 
        color: colors.primary.contrastText,
        py: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '5%',
          width: '90%',
          height: '2px',
          backgroundColor: colors.secondary.main
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: colors.secondary.main, 
            color: colors.primary.main,
            width: 48,
            height: 48
          }}>
            <Schedule />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold" fontSize="1.25rem">
              Gestionar Detalles del Horario
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: colors.background.paper }}>
              {horario?.nombre} - {horario?.clave}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: colors.background.default }}>
        <Box sx={{ p: 3 }}>
          {/* Formulario para nuevo detalle */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: colors.background.light,
            borderRadius: 2,
            border: `1px solid ${withAlpha(colors.secondary.main, '30')}`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Add sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                Agregar Nuevo Detalle
              </Typography>
            </Box>
            
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" error={!!errors.dia_semana}>
                  <InputLabel>Día de la semana</InputLabel>
                  <Select
                    value={nuevoDetalle.dia_semana}
                    onChange={(e) => handleNuevoDetalleChange('dia_semana', e.target.value)}
                    label="Día de la semana"
                  >
                    {DIAS_SEMANA.map(dia => (
                      <MenuItem key={dia.id} value={dia.id}>
                        {dia.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.dia_semana && (
                    <Typography variant="caption" color="error">
                      {errors.dia_semana}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Hora inicio"
                  type="time"
                  value={nuevoDetalle.hora_inicio}
                  onChange={(e) => handleNuevoDetalleChange('hora_inicio', e.target.value)}
                  error={!!errors.hora_inicio}
                  helperText={errors.hora_inicio}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Hora fin"
                  type="time"
                  value={nuevoDetalle.hora_fin}
                  onChange={(e) => handleNuevoDetalleChange('hora_fin', e.target.value)}
                  error={!!errors.hora_fin}
                  helperText={errors.hora_fin}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Tolerancia (min)"
                  type="number"
                  value={nuevoDetalle.tolerancia_min}
                  onChange={(e) => handleNuevoDetalleChange('tolerancia_min', e.target.value)}
                  error={!!errors.tolerancia_min}
                  helperText={errors.tolerancia_min}
                  size="small"
                  inputProps={{ min: 0, max: 60 }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={agregarDetalle}
                  sx={{
                    backgroundColor: colors.primary.main,
                    '&:hover': {
                      backgroundColor: colors.primary.dark,
                    }
                  }}
                >
                  Agregar Detalle
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Lista de detalles existentes */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: colors.background.light,
            borderRadius: 2,
            border: `1px solid ${withAlpha(colors.secondary.main, '30')}`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AccessTime sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                Detalles Configurados ({detalles.length})
              </Typography>
            </Box>

            {detalles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No hay detalles configurados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Agrega los días y horarios para este turno
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Día</TableCell>
                      <TableCell>Hora Inicio</TableCell>
                      <TableCell>Hora Fin</TableCell>
                      <TableCell>Tolerancia</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detalles.map((detalle, index) => (
                      <TableRow key={detalle.id || index}>
                        <TableCell>
                          <Chip 
                            label={getNombreDia(detalle.dia_semana)}
                            size="small"
                            sx={{
                              backgroundColor: withAlpha(colors.primary.main, '10'),
                              color: colors.primary.main
                            }}
                          />
                        </TableCell>
                        <TableCell>{detalle.hora_inicio}</TableCell>
                        <TableCell>{detalle.hora_fin}</TableCell>
                        <TableCell>{detalle.tolerancia_min} min</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => eliminarDetalle(index)}
                            sx={{
                              color: colors.status.error,
                              '&:hover': {
                                backgroundColor: withAlpha(colors.status.error, '10')
                              }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: colors.secondary.main }} />

      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        backgroundColor: colors.background.default
      }}>
        <Button
          startIcon={<Cancel />}
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{
            color: colors.accent.main,
            borderColor: colors.accent.main,
            '&:hover': {
              borderColor: colors.accent.dark,
              backgroundColor: withAlpha(colors.accent.main, '10'),
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || detalles.length === 0}
          size="large"
          sx={{
            minWidth: 120,
            backgroundColor: colors.primary.main,
            '&:hover': {
              backgroundColor: colors.primary.dark,
            }
          }}
        >
          {loading ? 'Guardando...' : 'Guardar Detalles'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioDetallesHorario;