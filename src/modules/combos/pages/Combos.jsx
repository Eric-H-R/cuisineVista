import React, { useEffect, useState } from 'react';
import { Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Grid, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ComboService from '../services/comboService';
import IndicadoresComponent from '../components/IndicadoresComponent';
import CardsCombos from '../components/CardsCombos';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import { toast } from 'react-toastify';



const Combos = () => {
  const [loading, setLoading] = useState(true);
  const [combos, setCombos] = useState([]);

  // create modal
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  // form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [products, setProducts] = useState([]); // available products
  const [selectedProducts, setSelectedProducts] = useState([]); // { producto_id, cantidad }
  const [productToAdd, setProductToAdd] = useState('');
  const [productQty, setProductQty] = useState(1);

  const loadCombos = async () => {
    setLoading(true);
    try {
      const res = await ComboService.getCombos();
      const data = res && res.data && (res.data.data || res.data) || [];
      setCombos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando combos', err);
      toast.error('Error cargando combos');
      setCombos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCombos();
  }, []);

  const openCreateDialog = async () => {
    setOpenCreate(true);
    try {
      const res = await ComboService.getActiveProducts();
      const data = res && res.data && (res.data.data || res.data) || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando productos', err);
      toast.error('Error cargando productos');
      setProducts([]);
    }
  };

  const closeCreate = () => {
    setOpenCreate(false);
    setName('');
    setDescription('');
    setPrice('');
    setImageBase64('');
    setSelectedProducts([]);
    setProductToAdd('');
    setProductQty(1);
    setCreating(false);
  };

  const handleAddProductToList = () => {
    if (!productToAdd) return toast.error('Selecciona un producto');
    const existing = selectedProducts.find(p => p.producto_id === Number(productToAdd));
    if (existing) {
      setSelectedProducts(prev => prev.map(p => p.producto_id === Number(productToAdd) ? { ...p, cantidad: p.cantidad + Number(productQty) } : p));
    } else {
      setSelectedProducts(prev => [...prev, { producto_id: Number(productToAdd), cantidad: Number(productQty) }]);
    }
    setProductToAdd('');
    setProductQty(1);
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(prev => prev.filter(p => p.producto_id !== id));
  };

  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result.split(',')[1] || '');
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!name.trim()) return toast.error('Nombre requerido');
    if (!selectedProducts.length) return toast.error('Agrega al menos un producto al combo');
    setCreating(true);
    try {
      const payload = {
        categoria_id: 1,
        descripcion: description,
        nombre: name.trim(),
        precio: Number(price) || 0,
        productos: selectedProducts.map(p => ({ cantidad: p.cantidad, producto_id: p.producto_id }))
      };
      // only include imagen_url if we actually have a base64 string
      if (imageBase64) payload.imagen_url = imageBase64;

      console.log('create combo payload:', payload);
      const res = await ComboService.create(payload);
      console.log('create combo res', res && res.data ? res.data : res);
      toast.success('Combo creado');
      closeCreate();
      loadCombos();
    } catch (err) {
      console.error('Error creando combo', err, err?.response?.data || {});
      const backendMsg = err?.response?.data?.message || err?.response?.data || null;
      if (backendMsg) {
        try {
          // if backend sends a structured validation object, stringify it to show
          const msg = typeof backendMsg === 'string' ? backendMsg : JSON.stringify(backendMsg);
          toast.error(msg);
        } catch (e) {
          toast.error('Error creando combo');
        }
      } else {
        toast.error('Error creando combo');
      }
    } finally {
      setCreating(false);
    }
  };

  // Edit handlers
  const [editingCombo, setEditingCombo] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleOpenEdit = async (combo) => {
    setEditingCombo(combo);
    setOpenEdit(true);
    // optionally fetch products or details if needed
    try {
      const res = await ComboService.getById(combo.id_combo || combo.id);
      const data = res && res.data && (res.data.data || res.data) || null;
      if (data) {
        setEditingCombo(data);
      }
    } catch (err) {
      console.warn('No se pudo obtener detalle, se usará el objeto existente', err);
    }
  };

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImageBase64, setEditImageBase64] = useState('');

  useEffect(() => {
    if (!editingCombo) return;
    setEditName(editingCombo.nombre || '');
    setEditDescription(editingCombo.descripcion || '');
    setEditPrice(editingCombo.precio || '');
    setEditImageBase64(editingCombo.imagen_url || '');
  }, [editingCombo]);

  const handleImageEdit = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditImageBase64(reader.result.split(',')[1] || '');
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async () => {
    if (!editingCombo) return;
    try {
      const payload = {
        descripcion: editDescription,
        nombre: editName,
        precio: Number(editPrice) || 0
      };
      if (editImageBase64) payload.imagen_url = editImageBase64;
      console.log('update combo payload', payload);
      await ComboService.update(editingCombo.id_combo || editingCombo.id, payload);
      toast.success('Combo actualizado');
      setOpenEdit(false);
      setEditingCombo(null);
      loadCombos();
    } catch (err) {
      console.error('Error actualizando combo', err, err?.response?.data || {});
      toast.error('Error actualizando combo');
    }
  };

  // Delete handlers
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = (combo) => {
    setDeleteTarget(combo);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await ComboService.delete(deleteTarget.id_combo || deleteTarget.id);
      toast.success('Combo eliminado');
      setOpenDelete(false);
      setDeleteTarget(null);
      loadCombos();
    } catch (err) {
      console.error('Error eliminando combo', err, err?.response?.data || {});
      toast.error('Error eliminando combo');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <h2>Combos</h2>
        </Box>
        <Box>
          <Button startIcon={<AddIcon />} variant="contained" onClick={openCreateDialog}>Agregar Combo</Button>
        </Box>
      </Box>

      <Grid size={{xs:12, md:6, lg:4}}>
        <Grid  >
          <IndicadoresComponent combos={combos} />
        </Grid>
      </Grid>

      {loading ? <LoadingComponent /> : <CardsCombos combos={combos} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />}

      <Dialog open={openCreate} onClose={closeCreate} fullWidth maxWidth="md">
        <DialogTitle>Crear nuevo combo</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />
            <TextField label="Precio" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />

            <Box>
              <input accept="image/*" type="file" onChange={(e) => handleImage(e.target.files[0])} />
            </Box>

            <Box>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={8} md={7}>
                  <TextField select label="Producto" value={productToAdd} onChange={(e) => setProductToAdd(e.target.value)} fullWidth>
                    <MenuItem value="">-- Selecciona --</MenuItem>
                    {products.map(p => (
                      <MenuItem key={p.id_producto || p.id || p.id_producto} value={p.id_producto || p.id || p.id_producto}>{p.nombre}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4} md={3}>
                  <TextField type="number" label="Cantidad" value={productQty} onChange={(e) => setProductQty(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button variant="outlined" onClick={handleAddProductToList}>Agregar</Button>
                </Grid>
              </Grid>

              <Box mt={4} sx={{ display: 'flex', gap: 2, justifyContent: 'space-around', width: '100%' }}>
                {selectedProducts.map(sp => {
                  const prod = products.find(p => (p.id_producto || p.id || p.id_producto) === sp.producto_id) || {};
                  return (
                    <Box key={sp.producto_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 1 }}>
                      <div>{prod.nombre || sp.producto_id} x {sp.cantidad}</div>
                      <Button size="small" variant="text" color="error" onClick={() => handleRemoveProduct(sp.producto_id)}>Quitar</Button>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreate}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>{creating ? <CircularProgress size={18} /> : 'Crear'}</Button>
        </DialogActions>
      </Dialog>
      {/* Edit dialog */}
      <Dialog open={openEdit} onClose={() => { setOpenEdit(false); setEditingCombo(null); }} fullWidth maxWidth="md">
        <DialogTitle>Editar combo</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nombre" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth />
            <TextField label="Descripción" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} fullWidth multiline rows={3} />
            <TextField label="Precio" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} fullWidth />
            <Box>
              <input accept="image/*" type="file" onChange={(e) => handleImageEdit(e.target.files[0])} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenEdit(false); setEditingCombo(null); }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Eliminar combo</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar el combo "{deleteTarget?.nombre}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Combos;
