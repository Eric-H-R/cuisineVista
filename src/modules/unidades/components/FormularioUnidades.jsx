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
  Scale,
  Functions
} from '@mui/icons-material';
import { validateUnidadForm } from '../../../utils/Validations';
import colors from '../../../theme/colores';

const FormularioUnidades = ({ open, onClose, onSave, unidadToEdit, loading }) => {
  const [formData, setFormData] = useState({
    clave: '',
    nombre: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (open) {
      if (unidadToEdit) {
        setFormData({
          clave: unidadToEdit.clave || '',
          nombre: unidadToEdit.nombre || ''
        });
      } else {
        setFormData({
          clave: '',
          nombre: ''
        });
      }
      setFormErrors({});
      setTouched({});
    }
  }, [open, unidadToEdit]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validación en tiempo real
    if (touched[field]) {
      const validation = validateUnidadForm({ ...formData, [field]: value });
      setFormErrors(validation.errors);
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validation = validateUnidadForm(formData);
    setFormErrors(validation.errors);
  };

  const handleSubmit = () => {
    // Marcar todos los campos como tocados
    const allTouched = {
      clave: true,
      nombre: true
    };
    setTouched(allTouched);

    const validation = validateUnidadForm(formData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    onSave(formData);
  };

  const isFormValid = () => {
    const validation = validateUnidadForm(formData);
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
          <Scale sx={{ mr: 1 }} />
          {unidadToEdit ? 'Editar Unidad' : 'Nueva Unidad de Medida'}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3, mt:1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Clave *"
            value={formData.clave}
            onChange={handleChange('clave')}
            onBlur={handleBlur('clave')}
            error={!!formErrors.clave}
            helperText={formErrors.clave || "Ej: KG, LT, MTS (máximo 29 caracteres)"}
            disabled={!!unidadToEdit}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Functions color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="KG"
          />

          <TextField
            label="Nombre *"
            value={formData.nombre}
            onChange={handleChange('nombre')}
            onBlur={handleBlur('nombre')}
            error={!!formErrors.nombre}
            helperText={formErrors.nombre || "Nombre completo de la unidad (máximo 30 caracteres)"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Scale color="action" />
                </InputAdornment>
              ),
            }}
            placeholder="Kilogramo"
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
          {loading ? 'Guardando...' : (unidadToEdit ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioUnidades;