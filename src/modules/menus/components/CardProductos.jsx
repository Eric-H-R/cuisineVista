//import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import PropTypes from 'prop-types';

const CardProducto = ({ product }) => {
  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header del producto */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#588157' }}>
              <RestaurantIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {product.name}
              </Typography>
              <Typography variant="body2" color="#57300D">
                {product.category}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={product.status ? 'Disponible' : 'Agotado'}
            color={product.status ? 'success' : 'error'}
            size="small"
          />
        </Box>

        {/* Descripción */}
        <Typography variant="body2" color="#333333" sx={{ mb: 2 }}>
          {product.description}
        </Typography>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Información del producto */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Precio:
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="#588157">
              ${product.price.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Costo:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              ${product.cost.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="#57300D">
              Inventario:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InventoryIcon sx={{ fontSize: 16, mr: 0.5, color: '#57300D' }} />
              <Typography variant="body1" fontWeight="bold">
                {product.inventory}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            size="small"
            sx={{
              color: '#588157',
              borderColor: '#588157',
              '&:hover': {
                backgroundColor: '#588157',
                color: 'white'
              }
            }}
          >
            Editar
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            sx={{
              color: '#57300D',
              borderColor: '#57300D',
              '&:hover': {
                backgroundColor: '#57300D',
                color: 'white'
              }
            }}
          >
            Inventario
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            sx={{
              color: product.status ? '#D32F2F' : '#2E7D32',
              borderColor: product.status ? '#D32F2F' : '#2E7D32',
              '&:hover': {
                backgroundColor: product.status ? '#D32F2F' : '#2E7D32',
                color: 'white'
              }
            }}
          >
            {product.status ? 'Desactivar' : 'Activar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CardProducto.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    cost: PropTypes.number.isRequired,
    inventory: PropTypes.number.isRequired,
    status: PropTypes.bool.isRequired
  }).isRequired
};

export default CardProducto;