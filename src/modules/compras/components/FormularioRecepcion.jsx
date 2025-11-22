import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Alert,
  Chip,
  Paper,
  Snackbar
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import comprasService from '../services/compras.service';
import colors from '../../../theme/colores';
import { validateRecepcionForm } from '../../../utils/Validations';

const emptyDetalle = () => ({
  insumo_id: '',
  cant_presentacion: '',
  unidades_por_present: '1',
  costo_unitario: '',
  fecha_caducidad: '',
  lote_numero: '',
  lote_proveedor: ''
});

const FormularioRecepcion = ({ open, onClose, onSave, loading, initialCompraId = null }) => {
  const [compraData, setCompraData] = useState(null);
  const [insumosCompra, setInsumosCompra] = useState([]);
  const [notas, setNotas] = useState('');
  const [detalles, setDetalles] = useState([emptyDetalle()]);
  const [errors, setErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' // 'error', 'warning', 'info', 'success'
  });

  // Obtener datos del localStorage
  const sucursalId = parseInt(localStorage.getItem('sucursalId') || '1', 10);
  
  // Obtener usuarioId del objeto user
  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          usuarioId: user?.id || 1,
          usuarioNombre: user?.nombre || 'Usuario'
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return { usuarioId: 1, usuarioNombre: 'Usuario' };
  };

  const { usuarioId, usuarioNombre } = getUserInfo();

  // Función para mostrar snackbar
  const showSnackbar = (message, severity = 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Función para cerrar snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (!open) return;

    const loadCompraData = async () => {
      if (!initialCompraId) return;
      
      try {
        const { data } = await comprasService.getById(initialCompraId);
        const compra = data?.data ?? data;
        
        console.log('📦 Datos de la compra:', compra);
        
        if (compra) {
          setCompraData(compra);
          
          if (compra.detalles && Array.isArray(compra.detalles)) {
            const insumosDisponibles = compra.detalles.map(detalle => ({
              id: detalle.insumo.id_insumo,
              nombre: detalle.insumo.nombre,
              presentacion: detalle.presentacion,
              cant_presentacion: detalle.cant_presentacion,
              costo_unit_present: detalle.costo_unit_present,
              unidad_medida: detalle.insumo.unidad_medida?.clave || 'und'
            }));

            console.log('✅ Insumos disponibles:', insumosDisponibles);
            setInsumosCompra(insumosDisponibles);
            
            if (insumosDisponibles.length > 0) {
              setDetalles([{
                insumo_id: insumosDisponibles[0].id.toString(),
                cant_presentacion: insumosDisponibles[0].cant_presentacion || '',
                unidades_por_present: '1',
                costo_unitario: insumosDisponibles[0].costo_unit_present || '',
                fecha_caducidad: '',
                lote_numero: '',
                lote_proveedor: ''
              }]);
            }
          }
        }
      } catch (err) {
        console.error('Error cargando datos de la compra:', err);
        showSnackbar('Error al cargar los datos de la compra', 'error');
      }
    };

    loadCompraData();
  }, [open, initialCompraId]);

  const handleAddDetalle = () => {
    setDetalles((d) => [...d, emptyDetalle()]);
    setFieldErrors({});
  };

  const handleRemoveDetalle = (index) => {
    setDetalles((d) => d.filter((_, i) => i !== index));
    const newFieldErrors = { ...fieldErrors };
    delete newFieldErrors[index];
    const reindexedErrors = {};
    Object.keys(newFieldErrors).forEach(key => {
      const keyNum = parseInt(key);
      if (keyNum > index) {
        reindexedErrors[keyNum - 1] = newFieldErrors[key];
      } else if (keyNum < index) {
        reindexedErrors[keyNum] = newFieldErrors[key];
      }
    });
    setFieldErrors(reindexedErrors);
  };

  const handleDetalleChange = (index, field, value) => {
    if (fieldErrors[index] && fieldErrors[index][field]) {
      const newFieldErrors = { ...fieldErrors };
      delete newFieldErrors[index][field];
      setFieldErrors(newFieldErrors);
    }
    
    setDetalles((d) => d.map((item, i) => (i === index ? { 
      ...item, 
      [field]: value
    } : item)));
  };

  const getFieldError = (index, field) => {
    return fieldErrors[index]?.[field] || '';
  };

  const handleSubmit = async () => {
    // Preparar datos para validación
    const formData = {
      compra_id: initialCompraId,
      recibido_por: usuarioId,
      sucursal_id: sucursalId,
      detalles: detalles.map(det => ({
        ...det,
        cant_presentacion: Number(det.cant_presentacion) || 0,
        unidades_por_present: Number(det.unidades_por_present) || 1,
        costo_unitario: det.costo_unitario ? Number(det.costo_unitario) : null
      }))
    };

    // Validar formulario
    const validation = validateRecepcionForm(formData);
    setErrors(validation.errors);
    setFieldErrors(validation.errors.detalles || {});

    console.log('🔍 Resultado validación:', validation);
    
    if (!validation.isValid) {
      console.log('❌ Errores de validación:', validation.errors);
      
      // Mostrar snackbar con el primer error encontrado
      let errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      
      if (validation.errors.detalles && Array.isArray(validation.errors.detalles)) {
        const primerDetalleConError = validation.errors.detalles.find(det => det && Object.keys(det).length > 0);
        if (primerDetalleConError) {
          const primerMensajeError = Object.values(primerDetalleConError)[0];
          errorMessage = primerMensajeError;
        } else if (validation.errors.detalles && typeof validation.errors.detalles === 'string') {
          errorMessage = validation.errors.detalles;
        }
      } else if (validation.errors.compra_id) {
        errorMessage = validation.errors.compra_id;
      }
      
      showSnackbar(errorMessage, 'error');
      return;
    }

    // Si pasa validación, preparar y enviar el payload
    const detallesPayload = detalles.map((det) => ({
      insumo_id: parseInt(det.insumo_id, 10),
      cant_presentacion: Number(det.cant_presentacion),
      unidades_por_present: det.unidades_por_present ? Number(det.unidades_por_present) : 1,
      costo_unitario: det.costo_unitario ? Number(det.costo_unitario) : null,
      fecha_caducidad: det.fecha_caducidad || null,
      lote_numero: det.lote_numero || null,
      lote_proveedor: det.lote_proveedor || null
    }));

    const payload = {
      compra_id: parseInt(initialCompraId, 10),
      detalles: detallesPayload,
      notas: notas || `Recepción completa de compra ${compraData?.folio || `#${initialCompraId}`}`,
      recibido_por: usuarioId,
      sucursal_id: sucursalId
    };

    console.log('🚀 Enviando recepción:', payload);
    await onSave(payload);
  };

  const resetForm = () => {
    setCompraData(null);
    setInsumosCompra([]);
    setNotas('');
    setDetalles([emptyDetalle()]);
    setErrors({});
    setFieldErrors({});
    setSnackbar({ open: false, message: '', severity: 'error' });
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  const getInsumoInfo = (insumoId) => {
    return insumosCompra.find(insumo => insumo.id.toString() === insumoId?.toString());
  };

  const getTotalRecibidoPorInsumo = (insumoId) => {
    return detalles
      .filter(det => det.insumo_id && det.insumo_id.toString() === insumoId?.toString())
      .reduce((total, det) => total + (Number(det.cant_presentacion) || 0), 0);
  };

  console.log('Compras data:', compraData);
  return (
    <>
      <Dialog 
        open={!!open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: colors.background.light
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText,
            borderBottom: `1px solid ${colors.border.light}`
          }}
        >
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              Nueva Recepción
            </Typography>
            {compraData && (
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Compra: {compraData.folio} - {compraData.proveedor?.nombre}
              </Typography>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: colors.background.default }}>
          <Box sx={{ mt: 1 }}>
            {compraData && (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 2,
                  backgroundColor: `${colors.primary.light}20`,
                  border: `1px solid ${colors.primary.light}`
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Información de la recepción:
                </Typography>
                <Typography variant="body2">
                  <strong>Compra:</strong> {compraData.folio} | 
                  <strong> Proveedor:</strong> {compraData.proveedor?.nombre} |
                  <strong> Sucursal:</strong> {compraData.sucursal?.nombre}
                </Typography>
                <Typography variant="body2">
                  <strong>Recibido por:</strong> {usuarioNombre} | 
                  <strong> Total compra:</strong> {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(compraData.total_compra || 0)}
                </Typography>
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{xs: 12}}>
                <TextField
                  label="Notas de la recepción"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder={`Recepción completa de compra ${compraData?.folio || `#${initialCompraId}`}`}
                />
              </Grid>

              <Grid size={{xs: 12}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Detalles de la recepción
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Puedes agregar múltiples lotes del mismo insumo con diferentes fechas de caducidad
                    </Typography>
                  </Box>
                  <Button 
                    startIcon={<AddCircleOutlineIcon />} 
                    onClick={handleAddDetalle}
                    disabled={insumosCompra.length === 0}
                    sx={{
                      backgroundColor: colors.secondary.main,
                      color: colors.secondary.contrastText,
                      '&:hover': {
                        backgroundColor: colors.secondary.dark,
                      },
                      '&:disabled': {
                        backgroundColor: colors.text.disabled,
                        color: colors.background.light
                      }
                    }}
                  >
                    Agregar lote
                  </Button>
                </Box>

                {insumosCompra.length === 0 && (
                  <Alert severity="warning">
                    No se encontraron insumos en esta compra.
                  </Alert>
                )}

                {detalles.map((det, idx) => {
                  const insumoInfo = getInsumoInfo(det.insumo_id);
                  const totalRecibidoDeEsteInsumo = getTotalRecibidoPorInsumo(det.insumo_id);
                  const comprado = insumoInfo?.cant_presentacion || 0;
                  
                  return (
                    <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{xs: 12, sm: 4}}>
                          <TextField
                            select
                            label="Insumo"
                            value={det.insumo_id || ''}
                            onChange={(e) => handleDetalleChange(idx, 'insumo_id', e.target.value)}
                            fullWidth
                            required
                            error={!!getFieldError(idx, 'insumo_id')}
                            helperText={getFieldError(idx, 'insumo_id')}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: colors.background.light,
                              }
                            }}
                          >
                            <MenuItem value="">-- Seleccionar insumo --</MenuItem>
                            {insumosCompra.map((insumo) => (
                              <MenuItem key={insumo.id} value={insumo.id.toString()}>
                                {insumo.nombre} 
                                {insumo.presentacion && ` - ${insumo.presentacion}`}
                                {` (Comprado: ${insumo.cant_presentacion} ${insumo.unidad_medida})`}
                              </MenuItem>
                            ))}
                          </TextField>
                          
                          {insumoInfo && (
                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                label={`Comprado: ${insumoInfo.cant_presentacion} ${insumoInfo.unidad_medida}`} 
                                size="small" 
                                color="primary"
                              />
                              {insumoInfo.costo_unit_present && (
                                <Chip 
                                  label={`Costo ref: $${insumoInfo.costo_unit_present}`} 
                                  size="small" 
                                  color="secondary"
                                />
                              )}
                            </Box>
                          )}
                        </Grid>

                        <Grid size={{xs: 6, sm: 2}}>
                          <TextField
                            label="Cant. recibida"
                            value={det.cant_presentacion}
                            onChange={(e) => handleDetalleChange(idx, 'cant_presentacion', e.target.value)}
                            fullWidth
                            type="number"
                            required
                            inputProps={{ min: 0, step: 0.01 }}
                            error={!!getFieldError(idx, 'cant_presentacion')}
                            helperText={getFieldError(idx, 'cant_presentacion') || (insumoInfo ? `Comprado: ${comprado}` : '')}
                          />
                        </Grid>

                        <Grid size={{xs: 6, sm: 2}}>
                          <TextField
                            label="Unidades/Present."
                            value={det.unidades_por_present}
                            onChange={(e) => handleDetalleChange(idx, 'unidades_por_present', e.target.value)}
                            fullWidth
                            type="number"
                            inputProps={{ min: 1 }}
                            error={!!getFieldError(idx, 'unidades_por_present')}
                            helperText={getFieldError(idx, 'unidades_por_present') || "Ej: 10 unidades por caja"}
                          />
                        </Grid>

                        <Grid size={{xs: 6, sm: 2}}>
                          <TextField
                            label="Costo unitario"
                            value={det.costo_unitario}
                            onChange={(e) => handleDetalleChange(idx, 'costo_unitario', e.target.value)}
                            fullWidth
                            type="number"
                            inputProps={{ step: '0.01', min: 0 }}
                            error={!!getFieldError(idx, 'costo_unitario')}
                            helperText={getFieldError(idx, 'costo_unitario') || (insumoInfo && `Referencia: $${insumoInfo.costo_unit_present}`)}
                          />
                        </Grid>

                        <Grid size={{xs: 6, sm: 2}}>
                          <TextField
                            label="Fecha caducidad"
                            type="date"
                            value={det.fecha_caducidad}
                            onChange={(e) => handleDetalleChange(idx, 'fecha_caducidad', e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!getFieldError(idx, 'fecha_caducidad')}
                            helperText={getFieldError(idx, 'fecha_caducidad')}
                          />
                        </Grid>

                        <Grid size={{xs: 12, sm: 4}}>
                          <TextField
                            label="Lote proveedor"
                            value={det.lote_proveedor}
                            onChange={(e) => handleDetalleChange(idx, 'lote_proveedor', e.target.value)}
                            fullWidth
                            placeholder="Ej: PROV-001"
                            error={!!getFieldError(idx, 'lote_proveedor')}
                            helperText={getFieldError(idx, 'lote_proveedor')}
                          />
                        </Grid>

                        <Grid size={{xs: 12, sm: 4}}>
                          <TextField
                            label="Número de lote"
                            value={det.lote_numero}
                            onChange={(e) => handleDetalleChange(idx, 'lote_numero', e.target.value)}
                            fullWidth
                            placeholder="Ej: LOTE-2024-001"
                            error={!!getFieldError(idx, 'lote_numero')}
                            helperText={getFieldError(idx, 'lote_numero')}
                          />
                        </Grid>

                        <Grid size={{xs: 12, sm: 4}}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton 
                              onClick={() => handleRemoveDetalle(idx)} 
                              disabled={detalles.length === 1}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !initialCompraId || detalles.length === 0}
            sx={{
              backgroundColor: colors.primary.main,
              color: colors.primary.contrastText,
              '&:hover': {
                backgroundColor: colors.primary.dark,
              },
              '&:disabled': {
                backgroundColor: colors.text.disabled,
              }
            }}
          >
            {loading ? 'Guardando...' : 'Guardar Recepción'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar errores */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormularioRecepcion;