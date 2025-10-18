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
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

const CardMetodosPagos = ({ method }) => {
  const getMethodIcon = (type) => {
    const icons = {
      tarjeta: <CreditCardIcon />,
      efectivo: <AttachMoneyIcon />,
      transferencia: <AccountBalanceWalletIcon />,
      digital: <PaymentIcon />
    };
    return icons[type] || <PaymentIcon />;
  };

  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header del método */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#588157' }}>
              {getMethodIcon(method.type)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {method.name}
              </Typography>
              <Typography variant="body2" color="#57300D">
                {method.description}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={method.status ? 'Activo' : 'Inactivo'}
            color={method.status ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Estadísticas */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Transacciones Hoy:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {method.transactionsToday}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Total Hoy:
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="#588157">
              ${method.totalToday.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="#57300D">
              Tasa de Aceptación:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {method.acceptanceRate}%
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
            Configurar
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
            {method.status ? 'Desactivar' : 'Activar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CardMetodosPagos.propTypes = {
  method: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    transactionsToday: PropTypes.number.isRequired,
    totalToday: PropTypes.number.isRequired,
    acceptanceRate: PropTypes.number.isRequired
  }).isRequired
};

export default CardMetodosPagos;