import { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
  Card,
  CardMedia
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';

// Services
import productosService from '../services/productos.service';
import categoriasService from '../../menus/services/MenuService';

// Validations
import { validateProductoForm } from '../../../utils/validations';

// TOAST
import { toast } from 'react-toastify';

import colors,{ withAlpha } from '../../../theme/colores';

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
  const [categorias, setCategorias] = useState([]);
  const [loadingInsumos, setLoadingInsumos] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [precioSugerido, setPrecioSugerido] = useState(0);
  const [nuevoItem, setNuevoItem] = useState({
    insumo_id: '',
    cantidad: ''
  });

  const fileInputRef = useRef(null);

  // Cargar insumos y categorías al abrir el modal
  useEffect(() => {
    if (open) {
      loadInsumos();
      loadCategorias();
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

  // Calcular precio sugerido cuando cambian los items de receta
  useEffect(() => {
    calcularPrecioSugerido();
  }, [formData.receta_items]);

  const loadInsumos = async () => {
    try {
      setLoadingInsumos(true);
      const sucursalId = localStorage.getItem('sucursalId');
      if (!sucursalId) {
        toast.error('No se encontró la sucursal en localStorage');
        return;
      }
      const { data } = await productosService.getExistencias(parseInt(sucursalId), true);
 
      if (data && data.success) {
        setInsumos(data.data.filter(insumo => insumo.es_activo));
      }
    } catch (error) {
      console.error('Error cargando insumos:', error);
      toast.error('Error cargando los insumos');
    } finally {
      setLoadingInsumos(false);
    }
  };

  const loadCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const { data } = await categoriasService.getAll();
      
      if (data && data.success) {
        setCategorias(data.data.filter(categoria => categoria.es_activa));
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      toast.error('Error cargando las categorías');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const loadProductoData = async () => {
    try {
      const { data } = await productosService.getById(productoToEdit.id_producto);
      
      if (data && data.success) {
        const producto = data.data;
        setFormData({
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          precio: producto.precio || '',
          imagen_url: producto.imagen_url || '',
          categoria_id: producto.categoria?.id_categoria || '',
          receta_items: producto.receta?.items?.map(item => ({
            insumo_id: item.insumo_id,
            cantidad: item.cantidad,
            id_receta_item: item.id_receta_item,
            insumo_nombre: item.insumo.nombre,
            unidad_clave: item.insumo.unidad_medida.clave
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
    setPrecioSugerido(0);
    setErrors({});
  };

  // Función para calcular precio sugerido basado en costos de insumos
  const calcularPrecioSugerido = () => {
    if (formData.receta_items.length === 0) {
      setPrecioSugerido(0);
      return;
    }

    let costoTotal = 0;

    formData.receta_items.forEach(item => {
      const insumo = insumos.find(i => i.id_insumo === item.insumo_id);
      if (insumo && insumo.costo_promedio > 0) {
        costoTotal += item.cantidad * insumo.costo_promedio;
      }
    });

    // Aplicar margen de ganancia (60% - costo de operación típico en restaurantes)
    const precioSugeridoCalculado = costoTotal * 2.5; // 150% de margen
    setPrecioSugerido(precioSugeridoCalculado);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe exceder los 5MB');
      return;
    }

    setUploadingImage(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setFormData(prev => ({
        ...prev,
        imagen_url: base64
      }));
      setUploadingImage(false);
    };
    reader.onerror = () => {
      toast.error('Error al cargar la imagen');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
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
      unidad_clave: insumoSeleccionado.unidad_clave,
      costo_promedio: insumoSeleccionado.costo_promedio || 0
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

  const usarPrecioSugerido = () => {
    setFormData(prev => ({
      ...prev,
      precio: precioSugerido.toFixed(2)
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

    // Preparar datos para enviar según si es creación o actualización
    let datosEnvio;

    if (productoToEdit) {
      // MODO ACTUALIZACIÓN
      datosEnvio = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen_url: formData.imagen_url,
        receta_items: formData.receta_items.map(item => ({
          id_receta_item: item.id_receta_item || 0,
          insumo_id: item.insumo_id,
          cantidad: item.cantidad
        }))
      };
    } else {
      // MODO CREACIÓN
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

    await onSave(datosEnvio);
  };

  const getCostoInsumo = (insumoId) => {
    const insumo = insumos.find(i => i.id_insumo === insumoId);
    return insumo ? insumo.costo_promedio : 0;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: colors.background.light,
          maxHeight: '90vh'
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
            <Grid size={12}>
              <Typography variant="h6" sx={{ 
                color: colors.primary.main,
                mb: 2,
                pb: 1,
                borderBottom: `2px solid ${colors.primary.light}`
              }}>
                Información Básica
              </Typography>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
                disabled={loading}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <FormControl fullWidth error={!!errors.categoria_id} disabled={loading || loadingCategorias}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.categoria_id}
                  label="Categoría"
                  onChange={(e) => handleInputChange('categoria_id', e.target.value)}
                  startAdornment={loadingCategorias ? <CircularProgress size={20} /> : null}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoria_id && (
                  <Typography variant="caption" color="error">
                    {errors.categoria_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={12}>
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

            {/* Precio con sugerencia */}
            <Grid size={{xs: 12, md: 6}}>
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
              {precioSugerido > 0 && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color={colors.text.secondary}>
                    Precio sugerido: ${precioSugerido.toFixed(2)}
                  </Typography>
                  <Button
                    size="small"
                    onClick={usarPrecioSugerido}
                    sx={{
                      color: colors.primary.main,
                      fontSize: '0.75rem'
                    }}
                  >
                    Usar
                  </Button>
                </Box>
              )}
            </Grid>

            {/* Imagen */}
            <Grid size={{xs: 12, md: 6}}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              
              <Button
                fullWidth
                variant="outlined"
                component="span"
                startIcon={uploadingImage ? <CircularProgress size={20} /> : <UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || uploadingImage}
                sx={{
                  height: '56px',
                  borderColor: colors.border.main,
                  color: colors.text.primary
                }}
              >
                {uploadingImage ? 'Cargando...' : 'Subir Imagen'}
              </Button>

              {formData.imagen_url && (
                <Card sx={{ mt: 2 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={formData.imagen_url}
                    alt="Vista previa"
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
              )}
            </Grid>

            
          {/* Receta */}
          <Grid size={12}>
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
              {precioSugerido > 0 && (
                <Typography variant="body2" color={colors.text.secondary} sx={{ ml: 'auto' }}>
                  Costo estimado: ${(precioSugerido / 2.5).toFixed(2)}
                </Typography>
              )}
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
                {productoToEdit 
                  ? 'Este producto no tiene ingredientes en la receta'
                  : 'Agrega los ingredientes que componen este producto'
                }
              </Alert>
            )}

            {/* Lista de items de receta - MODIFICADO PARA EDICIÓN */}
            {formData.receta_items.map((item, index) => {
              const costoInsumo = getCostoInsumo(item.insumo_id);
              const costoItem = item.cantidad * costoInsumo;
              
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1,
                    p: 2,
                    bgcolor: colors.background.paper,
                    borderRadius: 1,
                    border: `1px solid ${colors.border.light}`
                  }}
                >
                  {/* Información del insumo - Solo lectura */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="bold" color={colors.text.primary}>
                      {item.insumo_nombre}
                    </Typography>
                    <Typography variant="body2" color={colors.text.secondary}>
                      {item.unidad_clave}
                      {costoInsumo > 0 && (
                        <span> • ${costoInsumo.toFixed(2)} c/u</span>
                      )}
                    </Typography>
                  </Box>

                  {/* Campo de cantidad - EDITABLE */}
                  <TextField
                    size="small"
                    label="Cantidad"
                    type="number"
                    step="0.01"
                    value={item.cantidad}
                    onChange={(e) => {
                      const nuevosItems = [...formData.receta_items];
                      nuevosItems[index] = {
                        ...nuevosItems[index],
                        cantidad: parseFloat(e.target.value) || 0
                      };
                      setFormData(prev => ({
                        ...prev,
                        receta_items: nuevosItems
                      }));
                    }}
                    disabled={loading}
                    sx={{ width: 120 }}
                    InputProps={{
                      endAdornment: (
                        <Typography variant="caption" color={colors.text.secondary}>
                          {item.unidad_clave}
                        </Typography>
                      )
                    }}
                  />

                  {/* Costo del item */}
                  {costoInsumo > 0 && (
                    <Typography variant="body2" color={colors.text.secondary} sx={{ minWidth: 80 }}>
                      ${costoItem.toFixed(2)}
                    </Typography>
                  )}

                  {/* Botón eliminar - SOLO en creación */}
                  {!productoToEdit && (
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
                  )}
                </Box>
              );
            })}

            {/* SECCIÓN PARA AGREGAR NUEVOS INSUMOS - SOLO EN CREACIÓN */}
            {!productoToEdit && (
              <Box sx={{ 
                p: 2, 
                bgcolor: colors.background.default,
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
                    <Grid size={{xs:12, md:5}}>
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
                              {insumo.costo_promedio > 0 && ` - $${insumo.costo_promedio.toFixed(2)}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{xs:12, md:3}}>
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
                    <Grid size={{xs:12, md:4}} >
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={agregarItemReceta}
                        disabled={loading || !nuevoItem.insumo_id || !nuevoItem.cantidad}
                        sx={{
                          bgcolor: colors.primary.main,
                          color: 'white',
                          '&:hover': {
                            bgcolor: colors.primary.dark
                          }
                        }}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
          </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          py: 2,
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