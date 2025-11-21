import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  Avatar,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import AreasServices from '../../areas/services/AreasServices';
import MesasService from "../services/MesasService";
import LoadingComponent from "../../../components/Loadings/LoadingComponent";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";

const CardMesas = () => {
  const { sucursal } = useAuth();
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState({});

  // Estados para edición
  const [editingMesa, setEditingMesa] = useState(null);
  const [mesaEditada, setMesaEditada] = useState({
    nombre: '',
    capacidad: '',
    descripcion: '',
    es_activa: true
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Estados para eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mesaToDelete, setMesaToDelete] = useState(null);

  const colors = {
    primary: '#588157',
    secondary: '#A3B18A',
    accent: '#57300D',
    background: '#F8F9FA',
    paper: '#EDE0D4',
    text: '#333333'
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (!sucursal) {
          setMesas([]);
          return;
        }

        // Cargar áreas para el filtro
        try {
          const areasRes = await AreasServices.getBySucursal(sucursal);
          const areasData = areasRes && areasRes.data && (areasRes.data.data || areasRes.data) || [];
          setAreas(areasData);
        } catch (err) {
          setAreas([]);
        }

        // Preparar params
        const params = {};
        if (soloActivas) params.solo_activas = true;

        let response;
        if (selectedArea) {
          response = await MesasService.getByArea(selectedArea, sucursal, params);
        } else {
          response = await MesasService.getBySucursal(sucursal, params);
        }

        const data = response && response.data && (response.data.data || response.data) || [];
        setMesas(data);
      } catch (error) {
        setMesas([]);
        toast.error('Error cargando mesas');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [sucursal]);

  // Nuevo estado: áreas y filtros
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [soloActivas, setSoloActivas] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Refetch cuando cambian filtros
  useEffect(() => {
    const fetchWithFilters = async () => {
      if (!sucursal) return;
      setLoading(true);
      try {
        const params = {};
        if (soloActivas) params.solo_activas = true;

        let response;
        if (selectedArea) {
          response = await MesasService.getByArea(selectedArea, sucursal, params);
        } else {
          response = await MesasService.getBySucursal(sucursal, params);
        }
        const data = response && response.data && (response.data.data || response.data) || [];
        setMesas(data);
      } catch (error) {
        console.error('Error cargando mesas con filtros', error);
        toast.error('Error cargando mesas');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when sucursal is set or filters change
    fetchWithFilters();
  }, [sucursal, selectedArea, soloActivas]);

  const handleEdit = (mesa) => {
    setEditingMesa(mesa);
    setMesaEditada({
      nombre: mesa.nombre || '',
      capacidad: mesa.capacidad || '',
      descripcion: mesa.descripcion || '',
      es_activa: mesa.es_activa !== undefined ? mesa.es_activa : true
    });
    setEditError('');
  };

  const handleCloseEdit = () => {
    setEditingMesa(null);
    setMesaEditada({ nombre: '', capacidad: '', descripcion: '', es_activa: true });
    setEditError('');
    setEditLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMesaEditada(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    // Solo actualizamos la capacidad según la API
    if (mesaEditada.capacidad === '' || mesaEditada.capacidad === null) {
      setEditError('La capacidad es requerida');
      return;
    }

    try {
      setEditLoading(true);
      setEditError('');
      const payload = {
        capacidad: mesaEditada.capacidad ? parseInt(mesaEditada.capacidad) : 0
      };
      await MesasService.update(editingMesa.id, payload);
      toast.success('Capacidad actualizada correctamente');
      setMesas(prev => prev.map(m => m.id === editingMesa.id ? { ...m, ...payload } : m));
      handleCloseEdit();
    } catch (error) {
      console.error('Error actualizando capacidad de mesa:', error);
      setEditError('Error actualizando la mesa');
      toast.error('Error actualizando la mesa');
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleStatus = async (mesaId, currentStatus) => {
    setLoadingActions(prev => ({ ...prev, [mesaId]: true }));
    try {
      const newStatus = !currentStatus;
      await MesasService.update(mesaId, { es_activa: newStatus });
      setMesas(prev => prev.map(m => m.id === mesaId ? { ...m, es_activa: newStatus } : m));
      toast.success(`Mesa ${newStatus ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      console.error('Error actualizando estado mesa:', error);
      toast.error('Error actualizando el estado de la mesa');
    } finally {
      setLoadingActions(prev => ({ ...prev, [mesaId]: false }));
    }
  };

  const handleOpenDeleteDialog = (mesaId) => {
    setMesaToDelete(mesaId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMesaToDelete(null);
  };

  const handleDelete = async () => {
    if (!mesaToDelete) return;
    setLoadingActions(prev => ({ ...prev, [mesaToDelete]: true }));
    try {
      await MesasService.delete(mesaToDelete);
      setMesas(prev => prev.filter(m => m.id !== mesaToDelete));
      toast.success('Mesa eliminada correctamente');
    } catch (error) {
      console.error('Error eliminando mesa:', error);
      toast.error('Error eliminando la mesa');
    } finally {
      setLoadingActions(prev => ({ ...prev, [mesaToDelete]: false }));
      handleCloseDeleteDialog();
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" py={4}>
          <LoadingComponent />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title="Eliminar Mesa"
        message="¿Estás seguro de que deseas eliminar esta mesa? Esta acción no se puede deshacer."
      />

      {/* Modal de Edición */}
      <Dialog
        open={!!editingMesa}
        onClose={handleCloseEdit}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(88, 129, 87, 0.2)',
            border: `1px solid ${colors.primary}20`
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: colors.primary,
          color: 'white',
          py: 2,
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '5%',
            width: '90%',
            height: '2px',
            backgroundColor: colors.secondary
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: colors.primary, width: 48, height: 48 }}>
              <EditIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Editar Mesa
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {editingMesa?.nombre}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleCloseEdit} sx={{ color: 'white' }} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmitEdit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {editError && (
                <Alert severity="error">{editError}</Alert>
              )}

              <Box sx={{ p: 2, backgroundColor: colors.background, borderRadius: 1, border: `1px solid ${colors.primary}20` }}>
                <Typography variant="body2" fontWeight="medium">Información de la Mesa:</Typography>
                <Typography variant="body2" color="textSecondary">ID: {editingMesa?.id} • Sucursal: {sucursal}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>{editingMesa?.nombre}</Typography>
              </Box>

              <TextField name="capacidad" label="Capacidad" value={mesaEditada.capacidad} onChange={handleInputChange} type="number" fullWidth disabled={editLoading} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button type="button" variant="outlined" color="inherit" onClick={handleCloseEdit} disabled={editLoading} sx={{ color: colors.text, borderColor: colors.primary }}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={editLoading} startIcon={editLoading ? <CircularProgress size={20} /> : <EditIcon />} sx={{ backgroundColor: colors.accent }}>
                  {editLoading ? 'Guardando...' : 'Actualizar Mesa'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* Filtros: Área y Solo Activas (estilo similar a BarraBusqueda) */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 2,
          alignItems: isMobile ? 'stretch' : 'center'
        }}>
          <FormControl size="small" sx={{ minWidth: 220, mr: isMobile ? 0 : 2 }}>
            <InputLabel id="select-area-label">Área</InputLabel>
            <Select
              labelId="select-area-label"
              value={selectedArea}
              label="Área"
              onChange={(e) => setSelectedArea(e.target.value)}
              sx={{
                borderRadius: 2,
                backgroundColor: 'background.default',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                }
              }}
            >
              <MenuItem value="">Todas las áreas</MenuItem>
              {areas.map(area => (
                <MenuItem key={area.id_area || area.id} value={area.id_area || area.id}>{area.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={<Switch checked={soloActivas} onChange={(e) => setSoloActivas(e.target.checked)} />}
              label="Solo activas"
            />
          </Box>
        </Box>
      </Paper>

      <Box mt={4}>
        {mesas.length === 0 ? (
          <Typography variant="h6" textAlign="center" color="textSecondary">No hay mesas registradas para esta sucursal</Typography>
        ) : (
          <Grid container spacing={2}>
            {mesas.map(mesa => (
              <Grid size={{xs: 12, sm: 6, md: 4}} key={mesa.id_mesa}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{mesa.nombre}</Typography>
                      <Chip label={mesa.es_activa ? 'Activa' : 'Inactiva'} color={mesa.es_activa ? 'success' : 'default'} size="small" variant={mesa.es_activa ? 'filled' : 'outlined'} />
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: '40px' }}>{mesa.descripcion || 'Sin descripción'}</Typography>

                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="caption" color="textSecondary" display="block">ID: {mesa.id_mesa}</Typography>
                      <Typography variant="caption" color="textSecondary" display="block">Capacidad: {mesa.capacidad ?? '-'}</Typography>
                      <Typography variant="caption" color="textSecondary" display="block">Creado: {mesa.created_at ? new Date(mesa.created_at).toLocaleDateString() : '-'}</Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box>
                      <IconButton onClick={() => handleToggleStatus(mesa.id, mesa.es_activa)} disabled={loadingActions[mesa.id]} color={mesa.es_activa ? 'success' : 'default'} size="small" title={mesa.es_activa ? 'Desactivar mesa' : 'Activar mesa'}>
                        {loadingActions[mesa.id] ? <Box width={24} height={24} /> : mesa.es_activa ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>

                      <IconButton onClick={() => handleEdit(mesa)} disabled={loadingActions[mesa.id]} color="primary" size="small" title="Editar mesa"><EditIcon /></IconButton>
                    </Box>

                    <Button onClick={() => handleOpenDeleteDialog(mesa.id)} disabled={loadingActions[mesa.id]} color="error" size="small" startIcon={<DeleteIcon />} variant="outlined">Eliminar</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default CardMesas;
