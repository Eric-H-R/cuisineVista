import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';
import ConfigService from '../services/ConfigService';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const FilterConfig = () => {
  const { sucursal } = useAuth();
  const [configs, setConfigs] = useState([]);
  const [selectedClave, setSelectedClave] = useState('');

  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [clave, setClave] = useState('');
  const [valor, setValor] = useState('');

  const [openDelete, setOpenDelete] = useState(false);

  const loadConfigs = async () => {
    if (!sucursal) return setConfigs([]);
    try {
      const res = await ConfigService.listBySucursal(sucursal);
      const data = res && res.data && (res.data.data || res.data) || [];
      setConfigs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando configuraciones', err);
      toast.error('Error cargando configuraciones');
      setConfigs([]);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, [sucursal]);

  const handleOpenCreate = () => {
    setClave('');
    setValor('');
    setOpenCreate(true);
  };

  const handleCreate = async () => {
    if (!clave.trim()) return toast.error('La clave es requerida');
    if (!valor.trim()) return toast.error('El valor es requerido');
    if (!sucursal) return toast.error('Selecciona una sucursal');
    setCreating(true);
    try {
      const payload = { clave: clave.trim(), sucursal_id: Number(sucursal), valor_string: valor };
      console.log('create config payload', payload);
      await ConfigService.create(payload);
      toast.success('Configuración creada');
      setOpenCreate(false);
      loadConfigs();
    } catch (err) {
      console.error('Error creando configuración', err, err?.response?.data || {});
      const backendMsg = err?.response?.data?.message || err?.response?.data || null;
      if (backendMsg) {
        try { toast.error(typeof backendMsg === 'string' ? backendMsg : JSON.stringify(backendMsg)); } catch { toast.error('Error creando configuración'); }
      } else toast.error('Error creando configuración');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClave) return toast.error('Selecciona una configuración');
    if (!sucursal) return toast.error('Selecciona una sucursal');
    try {
      const params = { sucursal_id: Number(sucursal), clave: selectedClave };
      console.log('Deleting config with params:', params);
      const res = await ConfigService.deleteBySucursalAndClave(Number(sucursal), selectedClave);
      console.log('delete response:', res && res.data ? res.data : res);
      toast.success('Configuración eliminada');
      setOpenDelete(false);
      setSelectedClave('');
      loadConfigs();
    } catch (err) {
      console.error('Error eliminando configuración', err, err?.response?.data || {});
      toast.error('Error eliminando configuración');
    }
  };

  const selectedConfigObj = configs.find(c => (c.clave || c.key || '').toString() === selectedClave.toString()) || null;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="config-select-label">Configuración</InputLabel>
          <Select labelId="config-select-label" label="Configuración" value={selectedClave} onChange={(e) => setSelectedClave(e.target.value)}>
            <MenuItem value="">-- Selecciona --</MenuItem>
            {configs.map(c => (
              <MenuItem key={c.id_config || c.clave} value={c.clave}>{c.clave} — {c.valor_string}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={handleOpenCreate}>Agregar</Button>
        <Button variant="contained" color="error" onClick={() => setOpenDelete(true)} disabled={!selectedClave}>Eliminar</Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        {selectedConfigObj ? (
          <Box>
            <Typography variant="subtitle2">Clave: {selectedConfigObj.clave}</Typography>
            <Typography variant="body2">Valor: {selectedConfigObj.valor_string}</Typography>
            <Typography variant="caption" color="text.secondary">Última actualización: {selectedConfigObj.updated_at}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">Selecciona una configuración para ver detalles</Typography>
        )}
      </Box>

      {/* Create Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar configuración</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Clave" value={clave} onChange={(e) => setClave(e.target.value)} fullWidth />
            <TextField label="Valor" value={valor} onChange={(e) => setValor(e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>{creating ? 'Guardando...' : 'Guardar'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Eliminar configuración</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar la configuración "{selectedClave}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FilterConfig;
