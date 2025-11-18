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
  Chip,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import {
  Edit,
  Cancel,
  Save,
  Schedule,
  Add,
  Delete,
  AccessTime,
  Description,
  Info
} from '@mui/icons-material';
import colors, { withAlpha } from '../../../theme/colores';
import { validateHorarioForm } from '../../../utils/Validations';

const DIAS_SEMANA = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles'},
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' }
];

const FormularioHorarios = ({ 
  open, 
  onClose, 
  onSave, 
  horarioToEdit,
  loading = false 
}) => {
  const [sucursalId, setSucursalId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState({
    clave: '',
    nombre: '',
    descripcion: '',
    sucursal_id: '',
    detalles: []
  });

  const [nuevoDetalle, setNuevoDetalle] = useState({
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    tolerancia_min: 10,
    turno_idx: 1
  });

  const [errors, setErrors] = useState({});
  const [detalleErrors, setDetalleErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Obtener sucursal_id del localStorage al cargar
  useEffect(() => {
    const sucursal = localStorage.getItem('sucursalId');
    if (sucursal) {
      const sucursalIdNum = parseInt(sucursal, 10);
      setSucursalId(sucursalIdNum);
      setFormData(prev => ({ ...prev, sucursal_id: sucursalIdNum }));
    }
  }, []);

  useEffect(() => {
    if (horarioToEdit) {
      setFormData({
        clave: horarioToEdit.clave || '',
        nombre: horarioToEdit.nombre || '',
        descripcion: horarioToEdit.descripcion || '',
        sucursal_id: horarioToEdit.sucursal_id || sucursalId,
        detalles: horarioToEdit.detalles || []
      });
      setIsEditing(true);
      setActiveTab(0); 
    } else {
      setFormData({
        clave: '',
        nombre: '',
        descripcion: '',
        sucursal_id: sucursalId,
        detalles: []
      });
      setIsEditing(false);
      setActiveTab(0);
    }
    setNuevoDetalle({
      dia_semana: '',
      hora_inicio: '',
      hora_fin: '',
      tolerancia_min: 10,
      turno_idx: 1
    });
    setErrors({});
    setDetalleErrors({});
  }, [horarioToEdit, open, sucursalId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
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

  const handleNuevoDetalleChange = (field, value) => {
    setNuevoDetalle(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (detalleErrors[field]) {
      setDetalleErrors(prev => ({
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
      setDetalleErrors(newErrors);
      return;
    }

    // Verificar que no exista ya un detalle para este día
    const existeDia = formData.detalles.some(detalle => 
      detalle.dia_semana === parseInt(nuevoDetalle.dia_semana)
    );
    
    if (existeDia) {
      setDetalleErrors({ dia_semana: 'Ya existe un horario para este día' });
      return;
    }

    const detalleParaAgregar = {
      dia_semana: parseInt(nuevoDetalle.dia_semana),
      hora_inicio: nuevoDetalle.hora_inicio,
      hora_fin: nuevoDetalle.hora_fin,
      tolerancia_min: parseInt(nuevoDetalle.tolerancia_min),
      turno_idx: parseInt(nuevoDetalle.turno_idx)
    };

    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, detalleParaAgregar]
    }));

    setNuevoDetalle({
      dia_semana: '',
      hora_inicio: '',
      hora_fin: '',
      tolerancia_min: 10,
      turno_idx: 1
    });
    setDetalleErrors({});
  };

  const eliminarDetalle = (index) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const { errors: newErrors, isValid } = validateHorarioForm(formData);
    setErrors(newErrors);

    // En creación, validar que haya al menos un detalle
    if (!isEditing && formData.detalles.length === 0) {
      setActiveTab(1); // Cambiar a pestaña de detalles
      return false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    let horarioData;

    if (isEditing) {
      // MODO EDICIÓN: Solo enviar datos básicos
      horarioData = {
        clave: formData.clave.trim().toUpperCase(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim()
      };
    } else {
      // MODO CREACIÓN: Enviar datos básicos + detalles
      horarioData = {
        clave: formData.clave.trim().toUpperCase(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        sucursal_id: formData.sucursal_id,
        detalles: formData.detalles
      };
    }
    onSave(horarioData);
  };

  const handleClose = () => {
    setFormData({
      clave: '',
      nombre: '',
      descripcion: '',
      sucursal_id: sucursalId,
      detalles: []
    });
    setErrors({});
    setDetalleErrors({});
    setActiveTab(0);
    onClose();
  };

  const handleBlur = (field) => {
    const { errors: newErrors } = validateHorarioForm({ [field]: formData[field] });
    if (newErrors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: newErrors[field]
      }));
    }
  };

  const getNombreDia = (diaId) => {
    const dia = DIAS_SEMANA.find(d => d.id === diaId);
    return dia ? dia.nombre : `Día ${diaId}`;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
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
              {isEditing ? 'Editar Horario' : 'Nuevo Horario'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: colors.background.paper }}>
              {isEditing ? 'Actualiza la información del horario' : 'Completa los datos para crear un nuevo horario'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: colors.background.default }}>
        {/* Tabs - Solo mostrar en creación */}
        {!isEditing && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Información Básica" />
              <Tab label={`Detalles del Horario (${formData.detalles.length})`} />
            </Tabs>
          </Box>
        )}

        <Box sx={{ p: 3 }}>
          {/* Pestaña 1: Información Básica (siempre visible) */}
          {(activeTab === 0 || isEditing) && (
            <Paper elevation={0} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: colors.background.light,
              borderRadius: 2,
              border: `1px solid ${withAlpha(colors.secondary.main, '30')}`,
              boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Schedule sx={{ color: colors.primary.main }} />
                <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                  Información del Horario
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {/* Clave */}
                <Grid size={{xs: 12, sm: 6}}>
                  <TextField
                    fullWidth
                    label="Clave del Horario"
                    name="clave"
                    value={formData.clave}
                    onChange={(e) => handleChange('clave', e.target.value)}
                    onBlur={() => handleBlur('clave')}
                    error={!!errors.clave}
                    helperText={errors.clave || "Ej: TURNO_MATUTINO, TURNO_VESPERTINO"}
                    placeholder="Ej: TURNO_MATUTINO"
                    disabled={loading}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: colors.secondary.main,
                        },
                      }
                    }}
                  />
                </Grid>

                {/* Nombre */}
                <Grid size={{xs: 12, sm: 6}}>
                  <TextField
                    fullWidth
                    label="Nombre del Horario"
                    name="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    onBlur={() => handleBlur('nombre')}
                    error={!!errors.nombre}
                    helperText={errors.nombre || "Ej: Turno Matutino, Turno Vespertino"}
                    placeholder="Ej: Turno Matutino"
                    disabled={loading}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: colors.secondary.main,
                        },
                      }
                    }}
                  />
                </Grid>

                {/* Descripción */}
                <Grid size={{xs: 12}}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    onBlur={() => handleBlur('descripcion')}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion || "Describe el horario, días y turnos que incluye"}
                    placeholder="Ej: Horario de lunes a viernes de 8:00 AM a 5:00 PM con 1 hora de comida..."
                    disabled={loading}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <Description fontSize="small" sx={{ color: colors.text.primary, mr: 1 }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: colors.secondary.main,
                        },
                      }
                    }}
                  />
                </Grid>

                {/* Sucursal (solo lectura en creación) */}
                {!isEditing && (
                  <Grid size={{xs: 12}}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Sucursal</InputLabel>
                      <Select
                        value={formData.sucursal_id}
                        label="Sucursal"
                        disabled={true}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: colors.secondary.main,
                            },
                          }
                        }}
                      >
                        <MenuItem value={sucursalId}>
                          Sucursal Actual (ID: {sucursalId})
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
                      La sucursal se obtiene automáticamente del sistema
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {/* Información sobre detalles (solo en creación) */}
              {!isEditing && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: colors.paper, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    💡 <strong>Importante:</strong> En el siguiente paso deberás agregar los detalles 
                    de días y horarios para este turno. Es necesario configurar al menos un día.
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          {/* Pestaña 2: Detalles del Horario (solo en creación) */}
          {activeTab === 1 && !isEditing && (
            <>
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
                  <Grid size={{xs: 12, sm: 3}}>
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
    
                  <Grid size={{xs: 12, sm: 2}}>
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
    
                  <Grid size={{xs: 12, sm: 2}}>
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
    
                  <Grid size={{xs: 12, sm: 2}}>
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
    
                  <Grid size={{xs: 12, sm: 3}}>
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
                    Detalles Configurados ({formData.detalles.length})
                  </Typography>
                </Box>

                {formData.detalles.length === 0 ? (
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
                          <TableCell>Turno</TableCell>
                          <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.detalles.map((detalle, index) => (
                          <TableRow key={index}>
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
                            <TableCell>{detalle.turno_idx}</TableCell>
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
            </>
          )}
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
          onClick={handleClose}
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

        {/* Botones de navegación (solo en creación) */}
        {!isEditing && (
          <>
            {activeTab === 0 && (
              <Button
                onClick={() => setActiveTab(1)}
                variant="outlined"
                size="large"
                sx={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  '&:hover': {
                    borderColor: colors.primary.dark,
                    backgroundColor: withAlpha(colors.primary.main, '10'),
                  }
                }}
              >
                Siguiente: Detalles
              </Button>
            )}

            {activeTab === 1 && (
              <Button
                onClick={() => setActiveTab(0)}
                variant="outlined"
                size="large"
                sx={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  '&:hover': {
                    borderColor: colors.primary.dark,
                    backgroundColor: withAlpha(colors.primary.main, '10'),
                  }
                }}
              >
                Anterior: Información
              </Button>
            )}
          </>
        )}

        <Button
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || (!isEditing && formData.detalles.length === 0)}
          size="large"
          sx={{
            minWidth: 120,
            backgroundColor: colors.primary.main,
            '&:hover': {
              backgroundColor: colors.primary.dark,
            }
          }}
        >
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioHorarios;