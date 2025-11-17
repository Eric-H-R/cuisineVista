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
  CircularProgress,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Edit,
  Cancel,
  Save,
  Person,
  Phone,
  Email,
  Business,
  Badge
} from '@mui/icons-material';
import { validateUserForm } from '../../../utils/Validations';


const colors = {
  primary: '#588157',     
  secondary: '#A3B18A',    
  accent: '#57300D',       
  background: '#F8F9FA',   
  paper: '#EDE0D4',        
  text: '#333333'          
};

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

      const nameParts = (userToEdit.name || '').trim().split(' ');
      const nombre = nameParts[0] || '';
      const apellido = nameParts.slice(1).join(' ') || '';

      const rolEncontrado = roles.find(rol => 
        rol.nombre === (userToEdit.roles?.[0] || '')
      );
      const sucursalEncontrada = sucursales.find(suc => 
        suc.nombre === (userToEdit.branches?.[0] || '')
      );
      setFormData({
        nombre:nombre || '',
        apellido: apellido || '',
        email: userToEdit.email || '',
        telefono: userToEdit.phone || '',
        password: '',
        rol_id: rolEncontrado?.id_rol || userToEdit.rawData?.rol_id || '',
        sucursal_id: sucursalEncontrada?.id_sucursal || userToEdit.rawData?.sucursal_id || ''
      });
      setIsEditing(true);
    } else {
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
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const { errors: newErrors, isValid } = validateUserForm(formData, isEditing);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const userData = isEditing 
      ? getEditUserData() 
      : getCreateUserData();

    onSave(userData);
  };

  const getEditUserData = () => {
    const editData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim()
    };

   
    if (formData.password?.trim()) {
      editData.password = formData.password;
    }

    return editData;
  };

  const getCreateUserData = () => ({
    nombre: formData.nombre.trim(),
    apellido: formData.apellido.trim(),
    email: formData.email.trim(),
    telefono: formData.telefono.trim(),
    rol_id: parseInt(formData.rol_id),
    sucursal_id: parseInt(formData.sucursal_id),
    password: formData.password
  });

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
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(88, 129, 87, 0.2)',
          border: `1px solid ${colors.secondary}20`
        }
      }}
    >
      {/* Encabezado con color primario */}
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
            {isEditing ? <Edit /> : <PersonAdd />}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold" fontSize="1.25rem">
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: colors.paper }}>
              {isEditing ? 'Actualiza la información del usuario' : 'Completa los datos para crear un nuevo usuario'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: colors.background }}>
        <Box sx={{ p: 3 }}>
          {/* Información Personal */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'white',
            borderRadius: 2,
            border: `1px solid ${colors.secondary}30`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Person sx={{ color: colors.primary }} />
              <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 600 }}>
                Información Personal
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid size={{xs:12,sm:6}}>
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
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: colors.secondary,
                      },
                    }
                  }}
                />
              </Grid>

              <Grid size={{xs:12,sm:6}}>
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
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: colors.secondary,
                      },
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Información de Contacto */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'white',
            borderRadius: 2,
            border: `1px solid ${colors.secondary}30`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Email sx={{ color: colors.primary }} />
              <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 600 }}>
                Información de Contacto
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid size={{xs:12,sm:6}}>
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
                  placeholder="usuario@empresa.com"
                  disabled={loading}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" sx={{ color: colors.text }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: colors.secondary,
                      },
                    }
                  }}
                />
              </Grid>

              <Grid size={{xs:12,sm:6}}>
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
                  disabled={isEditing || loading}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" sx={{ color: colors.text }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: colors.secondary,
                      },
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Seguridad */}
           {!isEditing && <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'white',
            borderRadius: 2,
            border: `1px solid ${colors.secondary}30`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Badge sx={{ color: colors.primary }} />
              <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 600 }}>
                Seguridad
              </Typography>
            </Box>
            
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
              disabled={isEditing || loading}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge fontSize="small" sx={{ color: colors.text }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                      size="small"
                      sx={{ color: colors.text }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: colors.secondary,
                  },
                }
              }}
            />
          </Paper>}

          {/* Asignaciones */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: 'white',
            borderRadius: 2,
            border: `1px solid ${colors.secondary}30`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Business sx={{ color: colors.primary }} />
              <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 600 }}>
                Asignaciones
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid size={{xs:12,sm:6}}>
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
                  disabled={isEditing ||loading || !Array.isArray(roles) || roles.length === 0}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: colors.secondary,
                      },
                    }
                  }}
                >
                  <MenuItem value="">Seleccionar rol</MenuItem>
                  {Array.isArray(roles) && roles.map((rol) => (
                    <MenuItem key={rol.id_rol} value={rol.id_rol}>
                      {rol.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                {(!Array.isArray(roles) || roles.length === 0) && !loading && (
                  <Typography variant="caption" sx={{ color: colors.accent, mt: 1, display: 'block' }}>
                    No hay roles disponibles
                  </Typography>
                )}
              </Grid>

              <Grid size={{xs:12,sm:6}}>
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
                  disabled={isEditing || loading || !Array.isArray(sucursales) || sucursales.length === 0}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: colors.secondary,
                      },
                    }
                  }}
                >
                  <MenuItem value="">Seleccionar sucursal</MenuItem>
                  {Array.isArray(sucursales) && sucursales.map((sucursal) => (
                    <MenuItem key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                      {sucursal.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                {(!Array.isArray(sucursales) || sucursales.length === 0) && !loading && (
                  <Typography variant="caption" sx={{ color: colors.accent, mt: 1, display: 'block' }}>
                    No hay sucursales disponibles
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: colors.secondary }} />

      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        backgroundColor: colors.background
      }}>
        <Button
          startIcon={<Cancel />}
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{
            color: colors.accent,
            borderColor: colors.accent,
            '&:hover': {
              borderColor: colors.accent,
              backgroundColor: `${colors.accent}10`,
            }
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

export default UserFormModal;