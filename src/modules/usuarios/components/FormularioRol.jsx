import React, { useState, useEffect, useMemo } from 'react';
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
  Chip,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Cancel,
  Save,
  Security,
  Apps,
  Search,
  Clear,
  Category
} from '@mui/icons-material';

const colors = {
  primary: '#588157',
  secondary: '#A3B18A',
  accent: '#57300D',
  background: '#F8F9FA',
  paper: '#EDE0D4',
  text: '#333333'
};

const RolFormModal = ({ 
  open, 
  onClose, 
  onSave, 
  rolToEdit, 
  modulos = [],
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    modulos: []
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const modulosFiltrados = useMemo(() => {
    return modulos.filter(modulo => 
      modulo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [modulos, searchTerm]);
  useEffect(() => {
    if (rolToEdit) {
      
      const modulosIds = Array.isArray(rolToEdit.modulos)
        ? rolToEdit.modulos
            .map(m => m?.id_modulo)
            .filter(id => id !== undefined && id !== null)
        : [];
      setFormData({
        nombre: rolToEdit.nombre || '',
        descripcion: rolToEdit.descripcion || '',
        modulos: modulosIds
      });
      setIsEditing(true);
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        modulos: []
      });
      setIsEditing(false);
    }
    setErrors({});
    setSearchTerm('');
  }, [rolToEdit, open]);

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

  const handleModuloToggle = (moduloId) => {
    setFormData(prev => {
      const modulos = prev.modulos.includes(moduloId)
        ? prev.modulos.filter(id => id !== moduloId)
        : [...prev.modulos, moduloId];
      
      return { ...prev, modulos };
    });
  };

  const handleSelectAllInView = () => {
    const idsEnVista = modulosFiltrados.map(mod => mod.id_modulo);
    const nuevosModulos = [...new Set([...formData.modulos, ...idsEnVista])];
    setFormData(prev => ({ ...prev, modulos: nuevosModulos }));
  };

  const handleDeselectAllInView = () => {
    const idsEnVista = modulosFiltrados.map(mod => mod.id_modulo);
    const nuevosModulos = formData.modulos.filter(id => !idsEnVista.includes(id));
    setFormData(prev => ({ ...prev, modulos: nuevosModulos }));
  };

  const handleSelectAll = () => {
    const allIds = modulos.map(mod => mod.id_modulo);
    setFormData(prev => ({ ...prev, modulos: allIds }));
  };

  const handleDeselectAll = () => {
    setFormData(prev => ({ ...prev, modulos: [] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del rol es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (formData.modulos.length === 0) {
      newErrors.modulos = 'Selecciona al menos un módulo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const rolData = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      modulos: formData.modulos
    };

    onSave(rolData);
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      modulos: []
    });
    setErrors({});
    setSearchTerm('');
    onClose();
  };

  const handleBlur = (field) => {
    if (field === 'nombre' && !formData.nombre.trim()) {
      setErrors(prev => ({ ...prev, nombre: 'El nombre del rol es requerido' }));
    } else if (field === 'descripcion' && !formData.descripcion.trim()) {
      setErrors(prev => ({ ...prev, descripcion: 'La descripción es requerida' }));
    }
  };

  const getModuloNombre = (id) => {
    const modulo = modulos.find(m => m.id_modulo === id);
    return modulo ? modulo.nombre : `Módulo ${id}`;
  };

  const handleRemoveModulo = (moduloId) => {
    setFormData(prev => ({
      ...prev,
      modulos: prev.modulos.filter(id => id !== moduloId)
    }));
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
          border: `1px solid ${colors.secondary}20`,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: colors.primary, 
        color: 'white',
        py: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '5%',
          width: '90%',
          height: '2px',
          backgroundColor: colors.secondary
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: colors.secondary, 
            color: colors.primary,
            width: 48,
            height: 48
          }}>
            <Security />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              {isEditing ? 'Editar Rol' : 'Nuevo Rol'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {isEditing ? 'Actualiza la información del rol' : 'Completa los datos para crear un nuevo rol'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: colors.background }}>
        <Box sx={{ p: 3 }}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'white',
            borderRadius: 2,
            border: `1px solid ${colors.secondary}30`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Security sx={{ color: colors.primary }} />
              <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 600 }}>
                Información Básica
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid size={{xs:12,sm:6}}>
                <TextField
                  fullWidth
                  label="Nombre del Rol"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  onBlur={() => handleBlur('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  placeholder="Ej: Administrador, Editor, Usuario"
                  disabled={loading}
                  size="small"
                />
              </Grid>

              <Grid size={{xs:12,sm:6}}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                  <Chip 
                    label={`${formData.modulos.length} módulos seleccionados`}
                    color={formData.modulos.length > 0 ? "primary" : "default"}
                    variant={formData.modulos.length > 0 ? "filled" : "outlined"}
                    sx={{ 
                      backgroundColor: formData.modulos.length > 0 ? colors.primary : 'transparent',
                      color: formData.modulos.length > 0 ? 'white' : colors.text
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  onBlur={() => handleBlur('descripcion')}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion || "Describe las funciones y responsabilidades de este rol"}
                  placeholder="Ej: Rol con acceso completo a todos los módulos del sistema..."
                  disabled={loading}
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: 'white',
            borderRadius: 2,
            border: `1px solid ${colors.secondary}30`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Apps sx={{ color: colors.primary }} />
              <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 600 }}>
                Selección de Módulos
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar módulo por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: colors.text }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Button
                color={colors.primary}
                size="small"
                variant="outlined"
                onClick={handleSelectAllInView}
                disabled={loading}
              >
                Seleccionar Todos ({modulosFiltrados.length})
              </Button>
              <Button
                color={colors.primary}
                size="small"
                variant="outlined"
                onClick={handleDeselectAllInView}
                disabled={loading}
              >
                Deseleccionar
              </Button>
              <Typography variant="body2" sx={{ color: colors.text, ml: 'auto', alignSelf: 'center' }}>
                {modulosFiltrados.length} de {modulos.length} módulos
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List dense sx={{ py: 0 }}>
                {modulosFiltrados.map((modulo) => (
                  <ListItem
                    key={modulo.id_modulo}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={formData.modulos.includes(modulo.id_modulo)}
                        onChange={() => handleModuloToggle(modulo.id_modulo)}
                        disabled={loading}
                        sx={{
                          color: colors.primary,
                          '&.Mui-checked': {
                            color: colors.primary,
                          },
                        }}
                      />
                    }
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                      '&:hover': { backgroundColor: colors.background }
                    }}
                  >
                    <ListItemIcon>
                      <Category sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={modulo.nombre}
                      secondary={modulo.descripcion}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {errors.modulos && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.modulos}
              </Typography>
            )}

            {formData.modulos.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ color: colors.primary, mb: 1, fontWeight: 600 }}>
                  Módulos seleccionados ({formData.modulos.length}):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 120, overflow: 'auto', p: 1, border: `1px solid ${colors.secondary}30`, borderRadius: 1 }}>
                  {formData.modulos.map(moduloId => (
                    <Chip
                      key={moduloId}
                      label={getModuloNombre(moduloId)}
                      size="small"
                      onDelete={() => handleRemoveModulo(moduloId)}
                      variant="outlined"
                      sx={{ 
                        borderColor: colors.primary,
                        color: colors.primary
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2, backgroundColor: colors.background }}>
        <Button
          startIcon={<Cancel />}
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{
            color: colors.accent,
            borderColor: colors.accent
          }}
        >
          Cancelar
        </Button>
        <Button
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          size="large"
          sx={{
            minWidth: 120,
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.secondary,
            }
          }}
        >
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RolFormModal;