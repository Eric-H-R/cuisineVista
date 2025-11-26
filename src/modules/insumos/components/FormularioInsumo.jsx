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
  CircularProgress,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Inventory,
  Straighten,
  Warning
} from '@mui/icons-material';
import { validateInsumoForm } from '../../../utils/Validations';
import unidadesService from '../../unidades/services/unidades.service';
import colors from '../../../theme/colores';

const FormularioInsumos = ({ open, onClose, onSave, insumoToEdit, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    minimo_stock: '',
    unidad_id: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [unidades, setUnidades] = useState([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [errorUnidades, setErrorUnidades] = useState(null);
  const [disabledUnidades, setDisabledUnidades] = useState(false);

  useEffect(() => {
    if (open) {
      loadUnidades();

      if (insumoToEdit) {
        setDisabledUnidades(true);
        setFormData({
          nombre: insumoToEdit.nombre || '',
          minimo_stock: insumoToEdit.minimo_stock || '',
          unidad_id: insumoToEdit.unidad_id || ''
        });
      } else {
        setFormData({
          nombre: '',
          minimo_stock: '',
          unidad_id: ''
        });
      }
      setFormErrors({});
      setTouched({});
    }
  }, [open, insumoToEdit]);

  const loadUnidades = async () => {
    try {
      setLoadingUnidades(true);
      setErrorUnidades(null);
      const response = await unidadesService.getAll();

      if (response.data && response.data.success) {
        setUnidades(response.data.data || []);
      } else {
        setErrorUnidades('No se pudieron cargar las unidades de medida');
      }
    } catch (error) {
      console.error('Error cargando unidades:', error);
      setErrorUnidades('Error al cargar las unidades de medida');
    } finally {
      setLoadingUnidades(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const validation = validateInsumoForm({ ...formData, [field]: value });
      setFormErrors(validation.errors);
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validation = validateInsumoForm(formData);
    setFormErrors(validation.errors);
  };

  const handleSubmit = () => {
    const allTouched = { nombre: true, minimo_stock: true, unidad_id: true };
    setTouched(allTouched);

    const validation = validateInsumoForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const datosParaEnviar = {
      ...formData,
      minimo_stock: parseFloat(formData.minimo_stock)
    };

    onSave(datosParaEnviar);
  };

  const isFormValid = () => {
    const validation = validateInsumoForm(formData);
    return validation.isValid;
  };

  const getSelectValue = () => {
    if (!formData.unidad_id) return '';
    if (!isNaN(formData.unidad_id)) return formData.unidad_id;

    const unidad = unidades.find(u => u.clave === formData.unidad_id);
    return unidad ? unidad.id_unidad : '';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6
        }
      }}
    >
      {/* Header Estilizado */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
          color: "white",
          py: 2.5,
          fontSize: "1.25rem",
          fontWeight: "bold",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Inventory sx={{ color: "white" }} />
          {insumoToEdit ? "Editar Insumo" : "Nuevo Insumo"}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 4, px: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {errorUnidades && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              {errorUnidades}
            </Alert>
          )}

          {/* Campo NOMBRE */}
          <TextField
            label="Nombre del Insumo *"
            value={formData.nombre}
            onChange={handleChange("nombre")}
            onBlur={handleBlur("nombre")}
            error={!!formErrors.nombre}
            helperText={formErrors.nombre || "Nombre descriptivo del insumo"}
            placeholder="Ej: Harina Integral"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Inventory sx={{ color: colors.primary.main }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Campo STOCK MÍNIMO */}
          <TextField
            label="Stock Mínimo *"
            type="number"
            value={formData.minimo_stock}
            onChange={handleChange("minimo_stock")}
            onBlur={handleBlur("minimo_stock")}
            error={!!formErrors.minimo_stock}
            helperText={formErrors.minimo_stock || "Cantidad mínima requerida"}
            placeholder="0.00"
            inputProps={{ step: "0.01", min: "0" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Warning sx={{ color: colors.status.warning }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Campo SELECT DE UNIDADES */}
          <TextField
            select
            label="Unidad de Medida *"
            value={getSelectValue()}
            onChange={(event) => {
              const id = event.target.value;
              setFormData(prev => ({ ...prev, unidad_id: id }));

              if (touched.unidad_id) {
                const validation = validateInsumoForm({ ...formData, unidad_id: id });
                setFormErrors(validation.errors);
              }
            }}
            onBlur={handleBlur("unidad_id")}
            error={!!formErrors.unidad_id}
            helperText={formErrors.unidad_id || "Selecciona la unidad de medida"}
            disabled={loadingUnidades || disabledUnidades}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Straighten sx={{ color: colors.primary.main }} />
                </InputAdornment>
              ),
              endAdornment: loadingUnidades && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="">
              {loadingUnidades ? "Cargando unidades..." : "Selecciona una unidad"}
            </MenuItem>

            {unidades.map((unidad) => (
              <MenuItem key={unidad.id_unidad} value={unidad.id_unidad}>
                {unidad.nombre} ({unidad.clave})
              </MenuItem>
            ))}
          </TextField>

          {/* INFO SI NO HAY UNIDADES */}
          {unidades.length === 0 && !loadingUnidades && !errorUnidades && (
            <Alert severity="info">
              No hay unidades disponibles. Registra algunas primero.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: colors.text.secondary,
            fontWeight: "bold"
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid() || loading || loadingUnidades || unidades.length === 0}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{
            backgroundColor: colors.primary.main,
            fontWeight: "bold",
            px: 3,
            "&:hover": {
              backgroundColor: colors.primary.dark
            }
          }}
        >
          {loading ? "Guardando..." : (insumoToEdit ? "Actualizar" : "Crear")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioInsumos;
