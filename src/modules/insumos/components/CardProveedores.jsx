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
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

const CardProveedores = ({ supplier }) => {
  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA',
      mb: 2
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header del proveedor */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#57300D' }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {supplier.name}
              </Typography>
              <Typography variant="body2" color="#57300D">
                {supplier.contactPerson}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={supplier.status ? 'Activo' : 'Inactivo'}
            color={supplier.status ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {/* Información de contacto */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {supplier.phone}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {supplier.email}
            </Typography>
          </Box>
          <Typography variant="body2" color="#333333">
            {supplier.address}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Estadísticas */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Productos Suministrados:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {supplier.productsCount}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Pedidos Este Mes:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {supplier.ordersThisMonth}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="#57300D">
              Tiempo Entrega Promedio:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {supplier.deliveryTime} días
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
              color: '#333333',
              borderColor: '#333333',
              '&:hover': {
                backgroundColor: '#333333',
                color: 'white'
              }
            }}
          >
            Nuevo Pedido
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CardProveedores.propTypes = {
  supplier: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    contactPerson: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    productsCount: PropTypes.number.isRequired,
    ordersThisMonth: PropTypes.number.isRequired,
    deliveryTime: PropTypes.number.isRequired,
    status: PropTypes.bool.isRequired
  }).isRequired
};

export default CardProveedores;