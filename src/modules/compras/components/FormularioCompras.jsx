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
  IconButton,
  Typography,
  Divider,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  Add,
  Delete,
  AttachMoney
} from '@mui/icons-material';
import { validateCompraForm } from '../../../utils/Validations';
import proveedoresService from '../../proveedores/services/proveedores.service';
import insumosService from '../../insumos/services/insumos.service';
import colors from '../../../theme/colores';

const FormularioCompras = ({ open, onClose, onSave, loading, sucursalId }) => {
  const [formData, setFormData] = useState({
    proveedor_id: '',
    detalles: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [proveedores, setProveedores] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [loadingInsumos, setLoadingInsumos] = useState(false);

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (open) {
      setFormData({
        proveedor_id: '',
        detalles: []
      });
      setFormErrors({});
      setTouched({});
      loadProveedores();
      loadInsumos();
    }
  }, [open]);

  const loadProveedores = async () => {
    try {
      setLoadingProveedores(true);
      const response = await proveedoresService.getAll();
      
      if (response.data && response.data.success) {
        setProveedores(response.data.data || []);
      }
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      setLoadingProveedores(false);
    }
  };

  const loadInsumos = async () => {
    try {
      setLoadingInsumos(true);
      const response = await insumosService.getAll();
      
      if (response.data && response.data.success) {
        setInsumos(response.data.data || []);
      }
    } catch (error) {
      console.error('Error cargando insumos:', error);
    } finally {
      setLoadingInsumos(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Manejar detalles de compra
  const agregarDetalle = () => {
    setFormData(prev => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        {
          insumo_id: '',
          cant_presentacion: '',
          costo_unit_present: '',
          presentacion: ''
        }
      ]
    }));
  };

  const eliminarDetalle = (index) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const actualizarDetalle = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.map((detalle, i) => 
        i === index ? { ...detalle, [field]: value } : detalle
      )
    }));
  };

  const handleSubmit = (event) => {
    // Prevenir el comportamiento por defecto del formulario
    if (event) {
      event.preventDefault();
    }

    console.log('Intentando enviar formulario...', formData);

    // Validar formulario
    const validation = validateCompraForm(formData);
    console.log('Resultado validación:', validation);
    
    if (!validation.isValid) {
      console.log('Errores de validación:', validation.errors);
      setFormErrors(validation.errors);
      return;
    }

    // Convertir números y limpiar datos
    const datosParaEnviar = {
      proveedor_id: parseInt(formData.proveedor_id),
      detalles: formData.detalles.map(detalle => ({
        insumo_id: parseInt(detalle.insumo_id),
        cant_presentacion: parseFloat(detalle.cant_presentacion),
        costo_unit_present: parseFloat(detalle.costo_unit_present),
        presentacion: detalle.presentacion.trim()
      }))
    };

    console.log('Datos a enviar:', datosParaEnviar);
    onSave(datosParaEnviar);
  };

  // Verificar si el formulario es válido (más simple)
  const isFormValid = () => {
    console.log('Validando formulario...', formData);

    // Validación básica
    if (!formData.proveedor_id || formData.proveedor_id === '') {
      console.log('Falta proveedor');
      return false;
    }

    if (!formData.detalles || formData.detalles.length === 0) {
      console.log('No hay detalles');
      return false;
    }

    // Validar cada detalle
    const detallesValidos = formData.detalles.every((detalle, index) => {
      const valido = 
        detalle.insumo_id && 
        detalle.insumo_id !== '' &&
        detalle.cant_presentacion && 
        !isNaN(parseFloat(detalle.cant_presentacion)) &&
        parseFloat(detalle.cant_presentacion) > 0 &&
        detalle.costo_unit_present && 
        !isNaN(parseFloat(detalle.costo_unit_present)) &&
        parseFloat(detalle.costo_unit_present) > 0 &&
        detalle.presentacion && 
        detalle.presentacion.trim().length > 0;

      if (!valido) {
        console.log(`Detalle ${index} inválido:`, detalle);
      }

      return valido;
    });

    console.log('Detalles válidos:', detallesValidos);
    console.log('Formulario válido:', detallesValidos);
    return detallesValidos;
  };

  // Calcular subtotal de un detalle
  const calcularSubtotal = (detalle) => {
    const cantidad = parseFloat(detalle.cant_presentacion) || 0;
    const costo = parseFloat(detalle.costo_unit_present) || 0;
    return cantidad * costo;
  };

  // Calcular total de la compra
  const calcularTotal = () => {
    return formData.detalles.reduce((total, detalle) => {
      return total + calcularSubtotal(detalle);
    }, 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {/* Form wrapper para manejar el submit con Enter */}
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          backgroundColor: colors.primary.main,
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCart sx={{ mr: 1 }} />
            Nueva Compra
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Selección de proveedor */}
            <TextField
              select
              label="Proveedor *"
              value={formData.proveedor_id}
              onChange={handleChange('proveedor_id')}
              error={!!formErrors.proveedor_id}
              helperText={formErrors.proveedor_id || "Selecciona el proveedor"}
              disabled={loadingProveedores}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalShipping color="action" />
                  </InputAdornment>
                ),
                endAdornment: loadingProveedores && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                )
              }}
            >
              <MenuItem value="">
                {loadingProveedores ? 'Cargando proveedores...' : 'Selecciona un proveedor'}
              </MenuItem>
              {proveedores.map((proveedor) => (
                <MenuItem key={proveedor.id_proveedor || proveedor.id} value={proveedor.id_proveedor || proveedor.id}>
                  {proveedor.nombre}
                </MenuItem>
              ))}
            </TextField>

            <Divider />

            {/* Detalles de la compra */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Detalles de la Compra
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={agregarDetalle}
                  disabled={loadingInsumos || insumos.length === 0}
                  type="button" // Importante: evitar que sea submit
                >
                  Agregar Insumo
                </Button>
              </Box>

              {formErrors.detalles && typeof formErrors.detalles === 'string' && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formErrors.detalles}
                </Alert>
              )}

              {formData.detalles.length === 0 ? (
                <Alert severity="info">
                  Agrega al menos un insumo a la compra
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {formData.detalles.map((detalle, index) => (
                    <Card key={index} variant="outlined" sx={{ p: 2 }}>
                      <CardContent sx={{ p: '0 !important' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          {/* Insumo */}
                          <TextField
                            select
                            label="Insumo *"
                            value={detalle.insumo_id}
                            onChange={(e) => actualizarDetalle(index, 'insumo_id', e.target.value)}
                            error={!!(formErrors.detalles && formErrors.detalles[index]?.insumo_id)}
                            helperText={formErrors.detalles && formErrors.detalles[index]?.insumo_id}
                            sx={{ flex: 2 }}
                            size="small"
                          >
                            <MenuItem value="">Selecciona un insumo</MenuItem>
                            {insumos.map((insumo) => (
                              <MenuItem key={insumo.id_insumo || insumo.id} value={insumo.id_insumo || insumo.id}>
                                {insumo.nombre} ({insumo.unidad_clave})
                              </MenuItem>
                            ))}
                          </TextField>

                          {/* Cantidad */}
                          <TextField
                            label="Cantidad *"
                            type="number"
                            value={detalle.cant_presentacion}
                            onChange={(e) => actualizarDetalle(index, 'cant_presentacion', e.target.value)}
                            error={!!(formErrors.detalles && formErrors.detalles[index]?.cant_presentacion)}
                            helperText={formErrors.detalles && formErrors.detalles[index]?.cant_presentacion}
                            sx={{ flex: 1 }}
                            size="small"
                            inputProps={{ step: "0.01", min: "0.01" }}
                          />

                          {/* Costo Unitario */}
                          <TextField
                            label="Costo Unitario *"
                            type="number"
                            value={detalle.costo_unit_present}
                            onChange={(e) => actualizarDetalle(index, 'costo_unit_present', e.target.value)}
                            error={!!(formErrors.detalles && formErrors.detalles[index]?.costo_unit_present)}
                            helperText={formErrors.detalles && formErrors.detalles[index]?.costo_unit_present}
                            sx={{ flex: 1 }}
                            size="small"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoney fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            inputProps={{ step: "0.01", min: "0.01" }}
                          />

                          {/* Presentación */}
                          <TextField
                            label="Presentación *"
                            value={detalle.presentacion}
                            onChange={(e) => actualizarDetalle(index, 'presentacion', e.target.value)}
                            error={!!(formErrors.detalles && formErrors.detalles[index]?.presentacion)}
                            helperText={formErrors.detalles && formErrors.detalles[index]?.presentacion}
                            sx={{ flex: 1 }}
                            size="small"
                            placeholder="kg, lt, pza"
                          />

                          {/* Botón eliminar */}
                          <IconButton
                            onClick={() => eliminarDetalle(index)}
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                            type="button" // Importante: evitar que sea submit
                          >
                            <Delete />
                          </IconButton>
                        </Box>

                        {/* Subtotal */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Subtotal: <strong>${calcularSubtotal(detalle).toFixed(2)}</strong>
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Total */}
              {formData.detalles.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pt: 2, borderTop: `1px solid ${colors.border.light}` }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total: ${calcularTotal().toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Box>

            {insumos.length === 0 && !loadingInsumos && (
              <Alert severity="warning">
                No hay insumos disponibles. Debes crear insumos primero.
              </Alert>
            )}

            {proveedores.length === 0 && !loadingProveedores && (
              <Alert severity="warning">
                No hay proveedores disponibles. Debes crear proveedores primero.
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={onClose}
            disabled={loading}
            sx={{
              color: colors.text.secondary
            }}
            type="button" // Importante: evitar que sea submit
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit} // ✅ Ahora sí llama a handleSubmit
            disabled={!isFormValid() || loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': {
                backgroundColor: colors.primary.dark
              }
            }}
            type="button" // Usamos type="button" y manejamos el click manualmente
          >
            {loading ? 'Registrando...' : 'Registrar Compra'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormularioCompras;