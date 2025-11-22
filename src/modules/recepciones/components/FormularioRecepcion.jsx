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
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import insumosService from '../../insumos/services/insumos.service';

const emptyDetalle = () => ({
  insumo_id: '',
  cant_presentacion: '',
  unidades_por_present: '',
  costo_unitario: '',
  fecha_caducidad: '',
  lote_numero: '',
  lote_proveedor: ''
});

const FormularioRecepcion = ({ open, onClose, onSave, sucursalId, loading }) => {
  const [insumos, setInsumos] = useState([]);
  const [compraId, setCompraId] = useState('');
  const [notas, setNotas] = useState('');
  const [recibidoPor, setRecibidoPor] = useState(() => {
    const u = localStorage.getItem('usuarioId');
    return u ? parseInt(u, 10) : '';
  });
  const [detalles, setDetalles] = useState([emptyDetalle()]);

  useEffect(() => {
    if (!open) return;
    // cargar insumos
    const loadInsumos = async () => {
      try {
        const { data } = await insumosService.getAll();
        if (data && data.success && Array.isArray(data.data)) {
          setInsumos(data.data);
        } else if (Array.isArray(data)) {
          // algunos endpoints devuelven directamente el array
          setInsumos(data);
        } else {
          setInsumos([]);
        }
      } catch (err) {
        console.error('Error cargando insumos:', err);
        setInsumos([]);
      }
    };

    loadInsumos();
  }, [open]);

  const handleAddDetalle = () => setDetalles((d) => [...d, emptyDetalle()]);
  const handleRemoveDetalle = (index) => setDetalles((d) => d.filter((_, i) => i !== index));

  const handleDetalleChange = (index, field, value) => {
    setDetalles((d) => d.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!compraId) return alert('Debes seleccionar una compra (compra_id)');
    if (!detalles || detalles.length === 0) return alert('Agrega al menos un detalle');

    const detallesPayload = detalles.map((det) => ({
      insumo_id: parseInt(det.insumo_id, 10),
      cant_presentacion: det.cant_presentacion === '' ? null : Number(det.cant_presentacion),
      unidades_por_present: det.unidades_por_present === '' ? null : Number(det.unidades_por_present),
      costo_unitario: det.costo_unitario === '' ? null : Number(det.costo_unitario),
      fecha_caducidad: det.fecha_caducidad || null,
      lote_numero: det.lote_numero || null,
      lote_proveedor: det.lote_proveedor || null
    }));

    const payload = {
      compra_id: parseInt(compraId, 10),
      detalles: detallesPayload,
      notas: notas || null,
      recibido_por: recibidoPor ? parseInt(recibidoPor, 10) : null,
      sucursal_id: sucursalId
    };

    await onSave(payload);
  };

  const resetForm = () => {
    setCompraId('');
    setNotas('');
    setDetalles([emptyDetalle()]);
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Nueva Recepción</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Compra ID"
                value={compraId}
                onChange={(e) => setCompraId(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Recibido por (ID)"
                value={recibidoPor}
                onChange={(e) => setRecibidoPor(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Detalles</Typography>
                <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddDetalle}>
                  Agregar detalle
                </Button>
              </Box>

              {detalles.map((det, idx) => (
                <Box key={idx} sx={{ border: '1px solid #e0e0e0', p: 2, mb: 1, borderRadius: 1 }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        label="Insumo"
                        value={det.insumo_id}
                        onChange={(e) => handleDetalleChange(idx, 'insumo_id', e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="">-- Seleccionar --</MenuItem>
                        {insumos.map((ins) => (
                          <MenuItem key={ins.id || ins.insumo_id} value={ins.id || ins.insumo_id}>
                            {ins.nombre || ins.descripcion || `#${ins.id || ins.insumo_id}`}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <TextField
                        label="Cant. presentación"
                        value={det.cant_presentacion}
                        onChange={(e) => handleDetalleChange(idx, 'cant_presentacion', e.target.value)}
                        fullWidth
                        type="number"
                      />
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <TextField
                        label="Unidades/Present."
                        value={det.unidades_por_present}
                        onChange={(e) => handleDetalleChange(idx, 'unidades_por_present', e.target.value)}
                        fullWidth
                        type="number"
                      />
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <TextField
                        label="Costo unit."
                        value={det.costo_unitario}
                        onChange={(e) => handleDetalleChange(idx, 'costo_unitario', e.target.value)}
                        fullWidth
                        type="number"
                        inputProps={{ step: '0.01' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <TextField
                        label="Fecha caducidad"
                        type="date"
                        value={det.fecha_caducidad}
                        onChange={(e) => handleDetalleChange(idx, 'fecha_caducidad', e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Lote proveedor"
                        value={det.lote_proveedor}
                        onChange={(e) => handleDetalleChange(idx, 'lote_proveedor', e.target.value)}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Lote número"
                        value={det.lote_numero}
                        onChange={(e) => handleDetalleChange(idx, 'lote_numero', e.target.value)}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton color="error" onClick={() => handleRemoveDetalle(idx)} disabled={detalles.length === 1}>
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioRecepcion;
