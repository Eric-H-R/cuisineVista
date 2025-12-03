import React from 'react';
import { Box, Avatar, Typography, Button, Dialog, DialogTitle, TextField, CircularProgress, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AvatarIcon from '@mui/material/Avatar';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AreasServices from '../../areas/services/AreasServices';
import { useAuth } from '../../../context/AuthContext';
import MesasService from '../services/MesasService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import colors from '../../../theme/colores';



const FormsMesas = ({ selectedMesa = null, onMesaAdded, onMesaUpdated, onMesaDeleted }) => {
  const { sucursal } = useAuth();

  // Add modal
  const [openAdd, setOpenAdd] = React.useState(false);
  const [loadingAdd, setLoadingAdd] = React.useState(false);
  const [nuevaMesa, setNuevaMesa] = React.useState({ area_id: '', capacidad: '' });
  const [areas, setAreas] = React.useState([]);

  // Edit modal
  const [openEdit, setOpenEdit] = React.useState(false);
  const [loadingEdit, setLoadingEdit] = React.useState(false);
  const [editMesa, setEditMesa] = React.useState({ nombre: '', capacidad: '', descripcion: '' });

  // Delete dialog
  const [openDelete, setOpenDelete] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);

  React.useEffect(() => {
    if (selectedMesa) {
      setEditMesa({
        nombre: selectedMesa.nombre || '',
        capacidad: selectedMesa.capacidad || '',
        descripcion: selectedMesa.descripcion || ''
      });
    }
    // load areas for add form
    const loadAreas = async () => {
      if (!sucursal) return;
      try {
        const res = await AreasServices.getBySucursal(sucursal);
        const data = res && res.data && (res.data.data || res.data) || [];
        setAreas(data);
      } catch (err) {
        console.error('Error cargando áreas', err);
        setAreas([]);
      }
    };
    loadAreas();
  }, [selectedMesa]);

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!sucursal) return toast.error('Selecciona una sucursal');
    if (!nuevaMesa.area_id) return toast.error('Selecciona un área');
    if (nuevaMesa.capacidad === '' || nuevaMesa.capacidad === null) return toast.error('Ingresa la capacidad');

    try {
      setLoadingAdd(true);
      const payload = {
        area_id: parseInt(nuevaMesa.area_id),
        capacidad: parseInt(nuevaMesa.capacidad)
      };
      const res = await MesasService.create(payload);
      toast.success('Mesa creada');
      if (onMesaAdded) onMesaAdded(res.data);
      setTimeout(() => {
        setOpenAdd(false);
        setNuevaMesa({ area_id: '', capacidad: '' });
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error('Error creando mesa');
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMesa) return toast.error('Selecciona una mesa para editar');

    try {
      setLoadingEdit(true);
      const payload = {
        nombre: editMesa.nombre.trim(),
        capacidad: editMesa.capacidad ? parseInt(editMesa.capacidad) : null,
        descripcion: editMesa.descripcion.trim()
      };
      const selectedId = selectedMesa?.id_mesa ?? selectedMesa?.id;
      const res = await MesasService.update(selectedId, payload);
      toast.success('Mesa actualizada');
      if (onMesaUpdated) onMesaUpdated(res.data);
      setTimeout(() => {
        setOpenEdit(false);
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error('Error actualizando mesa');
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMesa) return toast.error('Selecciona una mesa para eliminar');
    try {
      setLoadingDelete(true);
      const selectedId = selectedMesa?.id_mesa ?? selectedMesa?.id;
      await MesasService.delete(selectedId);
      toast.success('Mesa eliminada');
      if (onMesaDeleted) onMesaDeleted(selectedMesa.id);
      setTimeout(() => {
        setOpenDelete(false);
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error('Error eliminando mesa');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button
          onClick={() => setOpenAdd(true)}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: colors.primary.dark }}
        >
          Agregar Mesa
        </Button>
      </Box>

      {/* Add Modal */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: colors.primary.dark, color: 'white' }}>Agregar Nueva Mesa</DialogTitle>
        <Box component="form" onSubmit={handleAddSubmit} sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel id="area-select-label">Área</InputLabel>
            <Select
              labelId="area-select-label"
              value={nuevaMesa.area_id}
              label="Área"
              name="area_id"
              onChange={handleInputChange(setNuevaMesa)}
            >
              <MenuItem value="">Selecciona un área</MenuItem>
              {areas.map(a => (
                <MenuItem key={a.id_area || a.id} value={a.id_area || a.id}>{a.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField name="capacidad" label="Capacidad" fullWidth type="number" value={nuevaMesa.capacidad} onChange={handleInputChange(setNuevaMesa)} sx={{ mb: 2 }} />
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)} sx={{color: colors.accent.dark, '&:hover': { backgroundColor: colors.background.paper }}}>Cancelar</Button>
            <Button sx={{backgroundColor: colors.primary.dark}} type="submit" variant="contained" disabled={loadingAdd} startIcon={loadingAdd ? <CircularProgress size={18} /> : null}>
              {loadingAdd ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: colors.primary, color: 'white' }}>Editar Mesa</DialogTitle>
        <Box component="form" onSubmit={handleEditSubmit} sx={{ p: 3 }}>
          <TextField name="nombre" label="Nombre / Número" fullWidth required value={editMesa.nombre} onChange={handleInputChange(setEditMesa)} sx={{ mb: 2 }} />
          <TextField name="capacidad" label="Capacidad" fullWidth type="number" value={editMesa.capacidad} onChange={handleInputChange(setEditMesa)} sx={{ mb: 2 }} />
          <TextField name="descripcion" label="Descripción" fullWidth multiline rows={3} value={editMesa.descripcion} onChange={handleInputChange(setEditMesa)} sx={{ mb: 2 }} />
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loadingEdit} startIcon={loadingEdit ? <CircularProgress size={18} /> : null}>
              {loadingEdit ? 'Guardando...' : 'Actualizar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <Box sx={{ p: 3 }}>
          <Typography>¿Estás seguro de eliminar la mesa {selectedMesa?.nombre ? `"${selectedMesa.nombre}"` : ''}?</Typography>
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={loadingDelete} startIcon={loadingDelete ? <CircularProgress size={18} /> : null}>
              {loadingDelete ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default FormsMesas;