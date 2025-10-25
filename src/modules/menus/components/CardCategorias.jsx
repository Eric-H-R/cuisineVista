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
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PropTypes from 'prop-types';

const CardCategoria = ({ category }) => {
  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header de la categoría */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#57300D' }}>
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {category.name}
              </Typography>
              <Typography variant="body2" color="#57300D">
                {category.description}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={category.status ? 'Activa' : 'Inactiva'}
            color={category.status ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Estadísticas */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Productos:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RestaurantMenuIcon sx={{ fontSize: 16, mr: 0.5, color: '#57300D' }} />
              <Typography variant="body1" fontWeight="bold">
                {category.productCount}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Ventas Hoy:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {category.salesToday}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="#57300D">
              Ingresos Hoy:
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="#588157">
              ${category.incomeToday.toLocaleString()}
            </Typography>
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
            Ver Productos
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            sx={{
              color: category.status ? '#D32F2F' : '#2E7D32',
              borderColor: category.status ? '#D32F2F' : '#2E7D32',
              '&:hover': {
                backgroundColor: category.status ? '#D32F2F' : '#2E7D32',
                color: 'white'
              }
            }}
          >
            {category.status ? 'Desactivar' : 'Activar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CardCategoria.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    productCount: PropTypes.number.isRequired,
    salesToday: PropTypes.number.isRequired,
    incomeToday: PropTypes.number.isRequired,
    status: PropTypes.bool.isRequired
  }).isRequired
};

export default CardCategoria;