import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CardMedia
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import productosService from '../services/productos.service';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import colors, { withAlpha } from '../../../theme/colores';
// TOAST
import { toast } from 'react-toastify';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CardProducto = ({ producto, onEdit, onEliminar }) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [detalleCompleto, setDetalleCompleto] = useState(null);

  const handleExpandClick = async () => {
    if (!expanded && !detalleCompleto) {
      // Cargar detalle completo solo la primera vez
      await loadDetalleProducto();
    }
    setExpanded(!expanded);
  };

  const loadDetalleProducto = async () => {
    try {
      setLoadingDetalle(true);
      const { data } = await productosService.getById(producto.id_producto);
      
      if (data && data.success) {
        setDetalleCompleto(data.data);
      }
    } catch (error) {
      console.error('Error cargando detalle del producto:', error);
      toast.error('Error cargando el detalle del producto');
    } finally {
      setLoadingDetalle(false);
    }
  };

    const getEstadoColor = (esActivo) => {
        return esActivo ? colors.status.success : colors.status.error;
    };

  const getEstadoText = (esActivo) => {
    return esActivo ? 'Activo' : 'Inactivo';
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precio);
  };
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        bgcolor: colors.background.light,
        border: `1px solid ${colors.border.light}`,
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          borderColor: colors.primary.light
        }
      }}
    >
      {producto.imagen_url && (
        <CardMedia
          component="img"
          height="140"
          image={producto.imagen_url}
          alt={producto.nombre}
          sx={{ 
            objectFit: 'cover',
            width: '100%'
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header con nombre y estado (ACTUALIZADO) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" fontWeight="bold" color={colors.text.primary}>
            {producto.nombre}
          </Typography>
          <Chip 
            label={getEstadoText(producto.es_activo)}
            sx={{
              backgroundColor: getEstadoColor(producto.es_activo),
              color: 'white',
              fontWeight: 'bold'
            }}
            size="small"
          />
        </Box>

        {/* Código */}
        <Typography variant="body2" color={colors.text.secondary} gutterBottom>
          Código: {producto.codigo}
        </Typography>

        {/* Descripción */}
        {producto.descripcion && (
          <Typography variant="body2" color={colors.text.primary} sx={{ mb: 2 }}>
            {producto.descripcion.length > 100 
              ? `${producto.descripcion.substring(0, 100)}...` 
              : producto.descripcion
            }
          </Typography>
        )}

        {/* Precio (ACTUALIZADO) */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color={colors.status.success} fontWeight="bold">
            {formatPrecio(producto.precio)}
          </Typography>
        </Box>

        {/* Información básica del detalle si está cargado (ACTUALIZADO) */}
        {detalleCompleto && (
          <Box sx={{ mt: 1 }}>
            {detalleCompleto.categoria && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CategoryIcon sx={{ fontSize: 16, color: colors.text.secondary, mr: 1 }} />
                <Typography variant="body2" color={colors.text.secondary}>
                  {detalleCompleto.categoria.nombre}
                </Typography>
              </Box>
            )}
            
            {detalleCompleto.receta && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RestaurantIcon sx={{ fontSize: 16, color: colors.text.secondary, mr: 1 }} />
                <Typography variant="body2" color={colors.text.secondary}>
                  {detalleCompleto.receta.items?.length || 0} ingredientes
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>

      {/* Detalle expandible (ACTUALIZADO) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ borderColor: colors.border.light }} />
        <CardContent sx={{ bgcolor: colors.background.paper }}>
          {loadingDetalle ? (
            <LoadingComponent message="Cargando detalle..." size="small" />
          ) : detalleCompleto ? (
            <Box>
              {/* Información de categoría */}
              {detalleCompleto.categoria && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color={colors.text.primary} gutterBottom>
                    Categoría
                  </Typography>
                  <Typography variant="body2" color={colors.text.primary}>
                    {detalleCompleto.categoria.nombre}
                  </Typography>
                  {detalleCompleto.categoria.descripcion && (
                    <Typography variant="body2" color={colors.text.secondary}>
                      {detalleCompleto.categoria.descripcion}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Receta */}
              {detalleCompleto.receta && (
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color={colors.text.primary} gutterBottom>
                    Receta: {detalleCompleto.receta.nombre}
                  </Typography>
                  
                  {detalleCompleto.receta.items && detalleCompleto.receta.items.length > 0 ? (
                    <List dense sx={{ py: 0 }}>
                      {detalleCompleto.receta.items.map((item, index) => (
                        <ListItem 
                          key={item.id_receta_item} 
                          sx={{ 
                            px: 0,
                            borderBottom: `1px solid ${colors.border.light}`,
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body2" color={colors.text.primary}>
                                {item.insumo.nombre}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color={colors.text.secondary}>
                                {item.cantidad} {item.insumo.unidad_medida.clave}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color={colors.text.secondary}>
                      No hay ingredientes en la receta
                    </Typography>
                  )}
                </Box>
              )}

              {/* Fechas */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color={colors.text.secondary}>
                  Creado: {new Date(producto.created_at).toLocaleDateString('es-MX')}
                </Typography>
                {producto.updated_at && (
                  <Typography variant="caption" color={colors.text.secondary} display="block">
                    Actualizado: {new Date(producto.updated_at).toLocaleDateString('es-MX')}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color={colors.text.secondary} textAlign="center">
              No se pudo cargar el detalle
            </Typography>
          )}
        </CardContent>
      </Collapse>

      {/* Acciones (ACTUALIZADO) */}
      <CardActions sx={{ 
        justifyContent: 'space-between', 
        pt: 0,
        
      }}>
        <Box>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(producto)}
            sx={{
              color: colors.primary.main,
              '&:hover': {
                backgroundColor: withAlpha(colors.primary.main, '10')
              }
            }}
          >
            Editar
          </Button>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onEliminar(producto)}
            sx={{
              color: colors.status.error,
              '&:hover': {
                backgroundColor: withAlpha(colors.status.error, '10')
              }
            }}
          >
            Eliminar
          </Button>
        </Box>
        
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="mostrar más"
          sx={{
            color: colors.primary.main
          }}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
};

export default CardProducto;