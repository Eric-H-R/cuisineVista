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
  Divider
} from '@mui/material';
import {
  Edit,
  Cancel,
  Save,
  Business,
  LocationOn,
  Phone
} from '@mui/icons-material';
import colors, { withAlpha } from '../../../theme/colores';
import { validateSucursalForm } from '../../../utils/Validations';

const SucursalFormModal = ({ 
  open, 
  onClose, 
  onSave, 
  sucursalToEdit,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (sucursalToEdit) {
     
      setFormData({
        nombre: sucursalToEdit.nombre || '',
        direccion: sucursalToEdit.direccion || '',
        telefono: sucursalToEdit.telefono || ''
      });
      setIsEditing(true);
    } else {
      setFormData({
        nombre: '',
        direccion: '',
        telefono: ''
      });
      setIsEditing(false);
    }
    setErrors({});
  }, [sucursalToEdit, open]);

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
    const { errors: newErrors, isValid } = validateSucursalForm(formData);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const sucursalData = {
      nombre: formData.nombre.trim(),
      direccion: formData.direccion.trim(),
      telefono: formData.telefono.trim()
    };

    onSave(sucursalData);
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      direccion: '',
      telefono: ''
    });
    setErrors({});
    onClose();
  };

  const handleBlur = (field) => {
    const { errors: newErrors } = validateSucursalForm({ [field]: formData[field] });
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
          border: `1px solid ${withAlpha(colors.secondary.main, '20')}`,
        }
      }}
    >
      {/* Header con color primario */}
      <DialogTitle sx={{ 
        backgroundColor: colors.primary.dark, 
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
            bgcolor: 'white',
            color: colors.primary.dark,
            width: 48,
            height: 48
          }}>
            <Business />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold" fontSize="1.25rem">
              {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: colors.background.paper }}>
              {isEditing ? 'Actualiza la información de la sucursal' : 'Completa los datos para crear una nueva sucursal'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: colors.background.default }}>
        <Box sx={{ p: 3 }}>
          {/* Información de la Sucursal */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: colors.background.light,
            borderRadius: 2,
            border: `1px solid ${withAlpha(colors.secondary.main, '30')}`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Business sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                Información de la Sucursal
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {/* Nombre */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nombre de la Sucursal"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  onBlur={() => handleBlur('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre || "Ej: Sucursal Centro, Plaza Mayor, Zona Norte"}
                  placeholder="Ej: Sucursal Centro"
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

              {/* Dirección */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Dirección Completa"
                  name="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  onBlur={() => handleBlur('direccion')}
                  error={!!errors.direccion}
                  helperText={errors.direccion || "Incluye calle, número, colonia, ciudad y código postal"}
                  placeholder="Ej: Av. Principal #123, Col. Centro, Ciudad de México, CDMX, CP 12345"
                  disabled={loading}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <LocationOn fontSize="small" sx={{ color: colors.text.primary, mr: 1, mb: 5 }} />
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

              {/* Teléfono */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  onBlur={() => handleBlur('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono || "Formato: 5551234567 o 55-5123-4567"}
                  placeholder="Ej: 5551234567"
                  disabled={loading}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Phone fontSize="small" sx={{ color: colors.text.primary, mr: 1 }} />
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
            </Grid>
          </Paper>

          {/* Información Adicional */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: colors.paper,
            borderRadius: 2,
            border: `1px solid ${withAlpha(colors.secondary.main, '30')}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOn sx={{ color: colors.accent.main }} />
              <Typography variant="h6" sx={{ color: colors.accent.main, fontWeight: 600, fontSize: '1rem' }}>
                Información del Sistema
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              • El código de sucursal se generará automáticamente en el sistema<br/>
              • La sucursal se creará con estado activo por defecto<br/>
              • Puedes editar esta información posteriormente si es necesario
            </Typography>
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
          onClick={handleClose}
          disabled={loading}
          variant="text"
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
          disabled={loading}
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

export default SucursalFormModal;