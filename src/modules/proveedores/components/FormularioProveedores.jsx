import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping,
  Email,
  Phone,
  Person
} from '@mui/icons-material';
import { validateProveedorForm } from '../../../utils/Validations';
import colors from '../../../theme/colores';

const FormularioProveedores = ({ open, onClose, onSave, proveedorToEdit, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (open) {
      if (proveedorToEdit) {
        setFormData({
          nombre: proveedorToEdit.nombre || '',
          email: proveedorToEdit.email || '',
          telefono: proveedorToEdit.telefono || ''
        });
      } else {
        setFormData({
          nombre: '',
          email: '',
          telefono: ''
        });
      }
      setFormErrors({});
      setTouched({});
    }
  }, [open, proveedorToEdit]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validación en tiempo real
    if (touched[field]) {
      const validation = validateProveedorForm({ ...formData, [field]: value });
      setFormErrors(validation.errors);
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validation = validateProveedorForm(formData);
    setFormErrors(validation.errors);
  };

  const handleSubmit = () => {
    // Marcar todos los campos como tocados
    const allTouched = {
      nombre: true,
      email: true,
      telefono: true
    };
    setTouched(allTouched);

    const validation = validateProveedorForm(formData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    onSave(formData);
  };

  const isFormValid = () => {
    const validation = validateProveedorForm(formData);
    return validation.isValid;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: colors.primary.main,
        color: 'white',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalShipping sx={{ mr: 1 }} />
          {proveedorToEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nombre del Proveedor *"
            value={formData.nombre}
            onChange={handleChange('nombre')}
            onBlur={handleBlur('nombre')}
            error={!!formErrors.nombre}
            helperText={formErrors.nombre || "Nombre completo del proveedor"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="Ej: Distribuidora Alimentos S.A."
          />

          <TextField
            label="Email *"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={!!formErrors.email}
            helperText={formErrors.email || "Email de contacto del proveedor"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="ejemplo@proveedor.com"
          />

          <TextField
            label="Teléfono *"
            value={formData.telefono}
            onChange={handleChange('telefono')}
            onBlur={handleBlur('telefono')}
            error={!!formErrors.telefono}
            helperText={formErrors.telefono || "Teléfono de contacto (10-15 dígitos)"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="+52 555 123 4567"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{
            color: colors.text.secondary
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid() || loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{
            backgroundColor: colors.primary.main,
            '&:hover': {
              backgroundColor: colors.primary.dark
            }
          }}
        >
          {loading ? 'Guardando...' : (proveedorToEdit ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioProveedores;