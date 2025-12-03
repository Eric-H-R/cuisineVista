//import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  Avatar,
  CircularProgress,
  CardMedia,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
//import AddIcon from '@mui/icons-material/Add';
import StatsCards from '../components/CardEstadisticas'
import BarraBusqueda from '../components/BarraBusqueda';
import CategoryCard from '../components/CardCategorias';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { useEffect, useState } from 'react';
import MenuService from '../services/MenuService';
import { useAuth } from '../../../context/AuthContext';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import { toast } from 'react-toastify';

const Menus = () => {
  const { sucursal } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  // Stats will be computed from fetched data (basic placeholders until more APIs exist)
  const statsData = [
    { title: 'Categorías', value: categories.length },
  ];

  //Agregar Categoría Modal state
  const [openAdd, setOpenAdd] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [newCategory, setNewCategory] = useState({ nombre: '', descripcion: '' });

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setLoadingAdd(false);
    setNewCategory({ nombre: '', descripcion: '' });
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.nombre.trim()) return toast.error('El nombre es requerido');
    try {
      setLoadingAdd(true);
      const payload = {
        nombre: newCategory.nombre.trim(),
        descripcion: newCategory.descripcion.trim()
      };
      const res = await MenuService.create(payload);
      const created = res && res.data && (res.data.data || res.data) || null;
      // map created to category shape
      const mapped = {
       // id: created?.id_categoria || created?.id || created?.id_menu || Math.random(),
        name: created?.nombre || created?.name || newCategory.nombre,
        description: created?.descripcion || created?.description || newCategory.descripcion,
        productCount: 0,
        salesToday: 0,
        incomeToday: 0,
        status: created?.es_activa !== undefined ? created.es_activa : true
      };
      setCategories(prev => [mapped, ...prev]);
      toast.success('Categoría creada');
      handleCloseAdd();
    } catch (err) {
      console.error('Error creando categoría', err);
      toast.error('Error creando categoría');
    } finally {
      setLoadingAdd(false);
    }
  };

  // Edit/Delete modals state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editValues, setEditValues] = useState({ name: '', description: '', status: true });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setEditValues({ name: category.name || '', description: category.description || '', status: category.status });
  };

  const handleCloseEdit = () => {
    setEditingCategory(null);
    setEditValues({ name: '', description: '', status: true });
    setEditLoading(false);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editValues.name.trim()) return toast.error('El nombre es requerido');
    try {
      setEditLoading(true);
      const payload = {
        nombre: editValues.name.trim(),
        descripcion: editValues.description.trim(), 
      };
        console.log('[Menus] update request', { editingId: editingCategory.id, payload });
        const res = await MenuService.update(editingCategory.id, payload);
        console.log('[Menus] update response', res && (res.data || res));
      // update local state
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: payload.nombre, description: payload.descripcion, status: payload.es_activa } : c));
      toast.success('Categoría actualizada');
      handleCloseEdit();
    } catch (err) {
      console.error('Error actualizando categoría', err);
      toast.error('Error actualizando categoría');
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await MenuService.delete(categoryToDelete.id);
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      toast.success('Categoría eliminada');
    } catch (err) {
      console.error('Error eliminando categoría', err);
      toast.error('Error eliminando categoría');
    } finally {
      handleCloseDelete();
    }
  };

  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      try {
        const params = {};
        if (sucursal) params.sucursal_id = sucursal;
        const res = await MenuService.getAll(params);
        const data = res && res.data && (res.data.data || res.data) || [];

        // Map API response to category objects expected by TabsMenus
        const mapped = data.map(item => ({
          id: item.id_categoria || item.id || item.id_menu,
          name: item.nombre || item.name || '',
          description: item.descripcion || item.description || '',
          productCount: item.productCount || 0,
          salesToday: item.salesToday || 0,
          incomeToday: item.incomeToday || 0,
          status: item.es_activa !== undefined ? item.es_activa : (item.status !== undefined ? item.status : true)
        }));

        setCategories(mapped);
        console.log('Categorías cargadas:', mapped);
      } catch (error) {
        console.error('Error cargando menús:', error);
        toast.error('Error cargando menús');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, [sucursal]);

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Gestión de Menús
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra categorías del menú
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              color: '#57300D',
              borderColor: '#57300D',
              fontWeight: 'bold'
            }}
          >
            Agregar Categoría
          </Button>
        </Box>
      </Box>

      {/* Cards de estadísticas */}
      <StatsCards cardsData={statsData} />

      {/*Barra de búsqueda y filtros */}
      <BarraBusqueda />

      {/* Categorías: listado con edición y eliminación */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <LoadingComponent />
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2} >

            {categories.map((category, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={category.id ?? index}>
                <CategoryCard
                  category={category}
                  imageNumber={index + 1}
                  onEdit={handleOpenEdit}
                  onToggle={(cat) => handleOpenEdit({ ...cat, status: !cat.status })}
                  onDelete={handleOpenDelete}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Edit Category Modal */}
      <Dialog open={!!editingCategory} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#588157', color: 'white' }}>Editar Categoría</DialogTitle>
        <Box component="form" onSubmit={handleSubmitEdit} sx={{ p: 3 }}>
          <TextField name="name" label="Nombre" fullWidth value={editValues.name} onChange={handleEditChange} sx={{ mb: 2 }} />
          <TextField name="description" label="Descripción" fullWidth multiline rows={3} value={editValues.description} onChange={handleEditChange} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseEdit}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={editLoading} sx={{ backgroundColor: '#57300D' }}>{editLoading ? 'Guardando...' : 'Guardar'}</Button>
          </Box>
        </Box>
      </Dialog>

      {/* Agregar Categoría Modal */}
      <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ backgroundColor: '#588157', color: 'white', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#A3B18A', color: '#588157', width: 48, height: 48 }}>
              <AddIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>Agregar Nueva Categoría</Typography>
            </Box>
          </Box>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmitNewCategory} sx={{ p: 4 }}>
          <TextField name="nombre" label="Nombre de la Categoría *" value={newCategory.nombre} onChange={handleNewCategoryChange} fullWidth required sx={{ mb: 2 }} />
          <TextField name="descripcion" label="Descripción" value={newCategory.descripcion} onChange={handleNewCategoryChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseAdd}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loadingAdd} startIcon={loadingAdd ? <CircularProgress size={18} /> : null} sx={{ backgroundColor: '#57300D' }}>{loadingAdd ? 'Guardando...' : 'Guardar Categoría'}</Button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Eliminar Categoría</DialogTitle>
        <Box sx={{ p: 3 }}>
          <Typography>¿Estás seguro de eliminar la categoría "{categoryToDelete?.name}"?</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseDelete}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>Eliminar</Button>
          </Box>
        </Box>
      </Dialog>
      
    </Container>
  );
};

export default Menus;