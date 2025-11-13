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
  MenuItem,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, Edit, Cancel, Save } from '@mui/icons-material';
import { validateUserForm } from '../../../utils/Validations';

const UserFormModal = ({ 
  open, 
  onClose, 
  onSave, 
  userToEdit, 
  roles = [], 
  sucursales = [],
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol_id: '',
    sucursal_id: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nombre: userToEdit.nombre || '',
        apellido: userToEdit.apellido || '',
        email: userToEdit.email || '',
        telefono: userToEdit.telefono || '',
        password: '',
        rol_id: userToEdit.rol_id || '',
        sucursal_id: userToEdit.sucursal_id || ''
      });
      setIsEditing(true);
    } else {
      // Modo creación
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: '',
        rol_id: '',
        sucursal_id: ''
      });
      setIsEditing(false);
    }
    setErrors({});
    setShowPassword(false);
  }, [userToEdit, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      const validation = validateUserForm({ [field]: value }, isEditing);
      if (!validation.errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const { errors: newErrors, isValid } = validateUserForm(formData, isEditing);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        rol_id: parseInt(formData.rol_id),
        sucursal_id: parseInt(formData.sucursal_id)
      };

      if (!isEditing || formData.password) {
        userData.password = formData.password;
      }

      onSave(userData);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      password: '',
      rol_id: '',
      sucursal_id: ''
    });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validación en tiempo real para mostrar/ocultar errores
  const handleBlur = (field) => {
    const { errors: newErrors } = validateUserForm({ [field]: formData[field] }, isEditing);
    if (newErrors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: newErrors[field]
      }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditing ? <Edit /> : <PersonAdd />}
          <Typography variant="h6" component="span">
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                onBlur={() => handleBlur('nombre')}
                error={!!errors.nombre}
                helperText={errors.nombre}
                placeholder="Ej: Juan"
                disabled={loading}
              />
            </Grid>

            {/* Apellido */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
                onBlur={() => handleBlur('apellido')}
                error={!!errors.apellido}
                helperText={errors.apellido}
                placeholder="Ej: Pérez"
                disabled={loading}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="Ej: usuario@empresa.com"
                disabled={isEditing || loading}
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                onBlur={() => handleBlur('telefono')}
                error={!!errors.telefono}
                helperText={errors.telefono}
                placeholder="Ej: +1234567890"
                disabled={loading}
              />
            </Grid>

            {/* Contraseña */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isEditing ? 'Nueva Contraseña' : 'Contraseña'}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={!!errors.password}
                helperText={errors.password || (isEditing ? 'Dejar vacío para mantener la contraseña actual' : 'Mínimo 6 caracteres')}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Rol */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Rol"
                name="rol_id"
                value={formData.rol_id}
                onChange={(e) => handleChange('rol_id', e.target.value)}
                onBlur={() => handleBlur('rol_id')}
                error={!!errors.rol_id}
                helperText={errors.rol_id}
                disabled={loading || !Array.isArray(roles) || roles.length === 0}
                >
                <MenuItem value="">Seleccionar rol</MenuItem>
                {Array.isArray(roles) && roles.map((rol) => (
                    <MenuItem key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                    </MenuItem>
                ))}
                </TextField>
              {roles.length === 0 && !loading && (
                <Typography variant="caption" color="text.secondary">
                  No hay roles disponibles
                </Typography>
              )}
            </Grid>

            {/* Sucursal */}
            <Grid item xs={12}>
                <TextField
                select
                fullWidth
                label="Sucursal"
                name="sucursal_id"
                value={formData.sucursal_id}
                onChange={(e) => handleChange('sucursal_id', e.target.value)}
                onBlur={() => handleBlur('sucursal_id')}
                error={!!errors.sucursal_id}
                helperText={errors.sucursal_id}
                disabled={loading || !Array.isArray(sucursales) || sucursales.length === 0}
                >
                <MenuItem value="">Seleccionar sucursal</MenuItem>
                {Array.isArray(sucursales) && sucursales.map((sucursal) => (
                    <MenuItem key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                    {sucursal.nombre}
                    </MenuItem>
                ))}
                </TextField>
              {sucursales.length === 0 && !loading && (
                <Typography variant="caption" color="text.secondary">
                  No hay sucursales disponibles
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          startIcon={<Cancel />}
          onClick={handleClose}
          color="inherit"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Usuario
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;