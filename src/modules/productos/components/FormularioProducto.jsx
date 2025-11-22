import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';

// Services
import productosService from '../services/productos.service';
import colors, { withAlpha } from '../../../theme/colores';
// Validations
import { validateProductoForm } from '../../../utils/Validations';

// TOAST
import { toast } from 'react-toastify';

const FormularioProducto = ({ open, onClose, onSave, productoToEdit, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen_url: '',
    categoria_id: '',
    receta_items: []
  });
  
  const [errors, setErrors] = useState({});
  const [insumos, setInsumos] = useState([]);
  const [loadingInsumos, setLoadingInsumos] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({
    insumo_id: '',
    cantidad: ''
  });

  // Cargar insumos al abrir el modal
  useEffect(() => {
    if (open) {
      loadInsumos();
    }
  }, [open]);

  // Cargar datos del producto si está en modo edición
  useEffect(() => {
    if (productoToEdit && open) {
      loadProductoData();
    } else {
      resetForm();
    }
  }, [productoToEdit, open]);

  const loadInsumos = async () => {
    try {
        setLoadingInsumos(true);
        const sucursalId = localStorage.getItem('sucursalId');
        if (!sucursalId) {
        toast.error('No se encontró la sucursal en localStorage');
        setInsumos([]);
        return;
        }

        const { data } = await productosService.getExistencias(parseInt(sucursalId), true);
        
        if (data && data.success && Array.isArray(data.data)) {
        const insumosActivos = data.data.filter(insumo => insumo.es_activo);
        setInsumos(insumosActivos);
        console.log('insumos disponibles:', insumosActivos);
        } else {
        setInsumos([]);
        console.log('No se pudieron cargar los insumos o respuesta vacía');
        }
    } catch (error) {
        console.error('Error cargando insumos:', error);
        toast.error('Error cargando los insumos');
        setInsumos([]);
    } finally {
        setLoadingInsumos(false);
    }
    };

  const loadProductoData = async () => {
    try {
      const { data } = await productosService.getById(productoToEdit.id_producto);
      
      if (data && data.success) {
        const producto = data.data;
        console.log('Datos del producto cargado:', producto);
        setFormData({
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          precio: producto.precio || '',
          imagen_url: producto.imagen_url || '',
          categoria_id: producto.categoria?.id_categoria || '',
          receta_items: producto.receta?.items?.map(item => ({
            insumo_id: item.insumo_id,
            cantidad: item.cantidad,
            id_receta_item: item.id_receta_item
          })) || []
        });
      }
    } catch (error) {
      console.error('Error cargando datos del producto:', error);
      toast.error('Error cargando los datos del producto');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen_url: '',
      categoria_id: '',
      receta_items: []
    });
    setNuevoItem({
      insumo_id: '',
      cantidad: ''
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo modificado
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNuevoItemChange = (field, value) => {
    setNuevoItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const agregarItemReceta = () => {
    if (!nuevoItem.insumo_id || !nuevoItem.cantidad) {
      toast.warning('Selecciona un insumo y especifica la cantidad');
      return;
    }

    const insumoSeleccionado = insumos.find(i => i.id_insumo === parseInt(nuevoItem.insumo_id));
    
    if (!insumoSeleccionado) {
      toast.error('Insumo no encontrado');
      return;
    }

    // Verificar si el insumo ya está en la receta
    const existeEnReceta = formData.receta_items.some(item => 
      item.insumo_id === parseInt(nuevoItem.insumo_id)
    );

    if (existeEnReceta) {
      toast.warning('Este insumo ya está en la receta');
      return;
    }

    const nuevoItemCompleto = {
      insumo_id: parseInt(nuevoItem.insumo_id),
      cantidad: parseFloat(nuevoItem.cantidad),
      insumo_nombre: insumoSeleccionado.nombre,
      unidad_clave: insumoSeleccionado.unidad_clave
    };

    setFormData(prev => ({
      ...prev,
      receta_items: [...prev.receta_items, nuevoItemCompleto]
    }));

    setNuevoItem({
      insumo_id: '',
      cantidad: ''
    });
  };

  const eliminarItemReceta = (index) => {
    setFormData(prev => ({
      ...prev,
      receta_items: prev.receta_items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateProductoForm(formData, !!productoToEdit);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

     let datosEnvio;
    console.log('formData antes de enviar:', formData);
    if (productoToEdit) {
        // MODO ACTUALIZACIÓN - Solo envía los campos que el endpoint espera
        datosEnvio = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen_url: formData.imagen_url,
        receta_items: formData.receta_items.map(item => ({
            id_receta_item: item.id_receta_item || 0, // Incluir ID si existe
            insumo_id: item.insumo_id,
            cantidad: item.cantidad
        }))
        };
    } else {
        // MODO CREACIÓN - Envía todos los campos incluyendo categoria_id
        datosEnvio = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen_url: formData.imagen_url,
        categoria_id: parseInt(formData.categoria_id),
        receta_items: formData.receta_items.map(item => ({
            insumo_id: item.insumo_id,
            cantidad: item.cantidad
        }))
        };
    }
    console.log('Datos a enviar:', datosEnvio);

    // Si es edición, incluir los IDs de los items de receta existentes
    if (productoToEdit && formData.receta_items.some(item => item.id_receta_item)) {
      datosEnvio.receta_items = formData.receta_items.map(item => ({
        id_receta_item: item.id_receta_item || 0,
        insumo_id: item.insumo_id,
        cantidad: item.cantidad
      }));
    }

    await onSave(datosEnvio);
  };

  const getNombreInsumo = (insumoId) => {
    const insumo = insumos.find(i => i.id_insumo === insumoId);
    return insumo ? insumo.nombre : 'Insumo no encontrado';
  };

  const getUnidadInsumo = (insumoId) => {
    const insumo = insumos.find(i => i.id_insumo === insumoId);
    return insumo ? insumo.unidad_clave : '';
  };

  console.log('insumos disponibles:', insumos); 

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: colors.background.light
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: colors.primary.main,
        color: colors.primary.contrastText,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestaurantIcon />
            <Typography variant="h6" component="div" fontWeight="bold">
            {productoToEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </Typography>
        </Box>
        <IconButton 
            onClick={onClose}
            sx={{ color: colors.primary.contrastText }}
        >
            <CloseIcon />
        </IconButton>
        </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Información Básica */}
            <Grid size={{xs:12}}>
              <Typography variant="h6" sx={{ 
                color: colors.primary.main,
                mb: 2,
                pb: 1,
                borderBottom: `2px solid ${colors.primary.light}`
              }}>
                Información Básica
              </Typography>
            </Grid>

            <Grid size={{xs:12, md:6}}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: colors.primary.light,
                    },
                  }
                }}
              />
            </Grid>

            <Grid size={{xs:12, md:6}}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => handleInputChange('precio', e.target.value)}
                error={!!errors.precio}
                helperText={errors.precio}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <Typography sx={{ mr: 1, color: colors.text.secondary }}>$</Typography>
                  )
                }}
              />
            </Grid>

            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                disabled={loading}
              />
            </Grid>

            <Grid size={{xs:12, md:6}}>
              <TextField
                fullWidth
                label="URL de Imagen"
                value={formData.imagen_url}
                onChange={(e) => handleInputChange('imagen_url', e.target.value)}
                disabled={loading}
              />
            </Grid>
            
            {!productoToEdit && (
            <Grid size={{xs:12, md:6}}>
              <TextField
                fullWidth
                label="Categoría ID"
                type="number"
                value={formData.categoria_id}
                onChange={(e) => handleInputChange('categoria_id', e.target.value)}
                error={!!errors.categoria_id}
                helperText={errors.categoria_id}
                disabled={loading}
              />
            </Grid>
            )}
            {productoToEdit && formData.categoria_id && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                    fullWidth
                    label="Categoría (Actual)"
                    value={`ID: ${formData.categoria_id}`}
                    disabled
                    helperText="La categoría no se puede modificar en edición"
                    />
                </Grid>
            )}

            {/* Receta */}
            <Grid size={{xs:12}}>
              <Divider sx={{ my: 2, borderColor: colors.border.light }} />
              <Typography variant="h6" sx={{ 
                color: colors.primary.main,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <RestaurantIcon />
                Receta del Producto
              </Typography>

              {formData.receta_items.length === 0 && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 2,
                    bgcolor: withAlpha(colors.status.info, '10'),
                    border: `1px solid ${colors.status.info}${colors.alpha[20]}`
                  }}
                >
                  Agrega los ingredientes que componen este producto
                </Alert>
              )}

              {/* Lista de items de receta */}
              {formData.receta_items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    p: 2,
                    bgcolor: colors.background.paper,
                    borderRadius: 1,
                    border: `1px solid ${colors.border.light}`
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="bold" color={colors.text.primary}>
                      {item.insumo_nombre || getNombreInsumo(item.insumo_id)}
                    </Typography>
                    <Typography variant="body2" color={colors.text.secondary}>
                      {item.cantidad} {item.unidad_clave || getUnidadInsumo(item.insumo_id)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => eliminarItemReceta(index)}
                    disabled={loading}
                    sx={{
                      color: colors.status.error,
                      '&:hover': {
                        bgcolor: withAlpha(colors.status.error, '10')
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              {/* Agregar nuevo item */}
                <Box sx={{ 
                p: 2, 
                bgcolor: colors.background.paper,
                borderRadius: 1,
                border: `1px dashed ${colors.border.main}`
                }}>
                {loadingInsumos ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                    <CircularProgress size={24} sx={{ color: colors.primary.main }} />
                    <Typography variant="body2" color={colors.text.secondary} sx={{ mt: 1 }}>
                        Cargando insumos...
                    </Typography>
                    </Box>
                ) : insumos.length === 0 ? (
                    <Alert 
                    severity="warning"
                    sx={{ 
                        bgcolor: withAlpha(colors.status.warning, '10'),
                        border: `1px solid ${colors.status.warning}${colors.alpha[20]}`
                    }}
                    >
                    No hay insumos disponibles. Verifica que tengas insumos activos en la sucursal.
                    </Alert>
                ) : (
                    <Grid container spacing={2} alignItems="center">
                    <Grid size={{xs:12, md:6}}>
                        <FormControl fullWidth size="small">
                        <InputLabel>Insumo</InputLabel>
                        <Select
                            value={nuevoItem.insumo_id}
                            label="Insumo"
                            onChange={(e) => handleNuevoItemChange('insumo_id', e.target.value)}
                            disabled={loading}
                        >
                            {insumos.map((insumo) => (
                            <MenuItem key={insumo.id_insumo} value={insumo.id_insumo}>
                                {insumo.nombre} ({insumo.unidad_clave})
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{xs:12, md:4}}>
                        <TextField
                        fullWidth
                        size="small"
                        label="Cantidad"
                        type="number"
                        step="0.01"
                        value={nuevoItem.cantidad}
                        onChange={(e) => handleNuevoItemChange('cantidad', e.target.value)}
                        disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={agregarItemReceta}
                        disabled={loading || !nuevoItem.insumo_id || !nuevoItem.cantidad}
                        sx={{
                            bgcolor: colors.secondary.main,
                            color: colors.secondary.contrastText,
                            '&:hover': {
                            bgcolor: colors.secondary.dark
                            }
                        }}
                        >
                        Agregar
                        </Button>
                    </Grid>
                    </Grid>
                )}
                </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          bgcolor: colors.background.paper,
          borderTop: `1px solid ${colors.border.light}`
        }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              color: colors.text.secondary,
              borderColor: colors.border.main,
              '&:hover': {
                borderColor: colors.primary.main,
                color: colors.primary.main
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              bgcolor: colors.primary.main,
              color: colors.primary.contrastText,
              px: 4,
              '&:hover': {
                bgcolor: colors.primary.dark
              },
              '&:disabled': {
                bgcolor: colors.primary.light
              }
            }}
          >
            {productoToEdit ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormularioProducto;