//import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
//import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';

const CardMovimiento = ({ movement }) => {
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
        {/* Header del movimiento */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              width: 48, 
              height: 48, 
              mr: 2, 
              bgcolor: movement.type === 'entrada' ? '#2E7D32' : '#D32F2F' 
            }}>
              {movement.type === 'entrada' ? <TrendingUpIcon /> : <TrendingDownIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {movement.productName}
              </Typography>
              <Typography variant="body2" color="#57300D">
                {movement.reference}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={movement.type === 'entrada' ? 'ENTRADA' : 'SALIDA'}
            color={movement.type === 'entrada' ? 'success' : 'error'}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Detalles del movimiento */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Cantidad:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {movement.quantity} {movement.unit}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Tipo:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {movement.movementType}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Responsable:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: '#57300D' }} />
              <Typography variant="body2" fontWeight="medium">
                {movement.responsible}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Fecha y Hora:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {movement.dateTime}
            </Typography>
          </Box>

          {movement.supplier && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="#57300D">
                Proveedor:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {movement.supplier}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Stock resultante */}
        <Box>
          <Typography variant="body2" color="#57300D" gutterBottom>
            Stock Resultante:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              Anterior: {movement.previousStock} {movement.unit}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              Actual: {movement.currentStock} {movement.unit}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

CardMovimiento.propTypes = {
  movement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productName: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    movementType: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
    responsible: PropTypes.string.isRequired,
    dateTime: PropTypes.string.isRequired,
    supplier: PropTypes.string,
    previousStock: PropTypes.number.isRequired,
    currentStock: PropTypes.number.isRequired
  }).isRequired
};

export default CardMovimiento;