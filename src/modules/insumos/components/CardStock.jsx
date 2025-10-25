//import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import PropTypes from 'prop-types';

const CardStock = ({ stock }) => {
  const getStockStatus = (current, min, max) => {
    const percentage = (current / max) * 100;
    if (percentage <= 10) return { status: 'Crítico', color: 'error' };
    if (percentage <= 30) return { status: 'Bajo', color: 'warning' };
    return { status: 'Normal', color: 'success' };
  };

  const stockInfo = getStockStatus(stock.currentStock, stock.minStock, stock.maxStock);
  const progressPercentage = (stock.currentStock / stock.maxStock) * 100;

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
        {/* Header del insumo */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#588157' }}>
              <InventoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {stock.name}
              </Typography>
              <Typography variant="body2" color="#57300D">
                {stock.category}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={stockInfo.status}
            color={stockInfo.color}
            size="small"
            icon={stockInfo.status === 'Crítico' ? <WarningIcon /> : undefined}
          />
        </Box>

        {/* Descripción */}
        <Typography variant="body2" color="#333333" sx={{ mb: 2 }}>
          {stock.description}
        </Typography>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Información de stock */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Stock Actual:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {stock.currentStock} {stock.unit}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Mínimo:
            </Typography>
            <Typography variant="body2">
              {stock.minStock} {stock.unit}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="#57300D">
              Máximo:
            </Typography>
            <Typography variant="body2">
              {stock.maxStock} {stock.unit}
            </Typography>
          </Box>

          {/* Barra de progreso */}
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage}
              color={stockInfo.color}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 1
              }}
            />
            <Typography variant="caption" color="#57300D">
              {progressPercentage.toFixed(1)}% del stock máximo
            </Typography>
          </Box>
        </Box>

        {/* Información de costos */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Costo Unitario:
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="#588157">
              ${stock.unitCost.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="#57300D">
              Valor Total:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              ${stock.totalValue.toLocaleString()}
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
            Ajustar Stock
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
            Historial
          </Button>
          {stockInfo.status === 'Crítico' && (
            <Button 
              variant="contained" 
              size="small"
              sx={{
                backgroundColor: '#D32F2F',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#B71C1C'
                }
              }}
            >
              Ordenar
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

CardStock.propTypes = {
  stock: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    currentStock: PropTypes.number.isRequired,
    minStock: PropTypes.number.isRequired,
    maxStock: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
    unitCost: PropTypes.number.isRequired,
    totalValue: PropTypes.number.isRequired
  }).isRequired
};

export default CardStock;