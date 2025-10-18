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
  Grid
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PropTypes from 'prop-types';

const CardPagos = ({ payment }) => {
  const getPaymentIcon = (method) => {
    const icons = {
      tarjeta: <CreditCardIcon />,
      efectivo: <AttachMoneyIcon />,
      transferencia: <AccountBalanceWalletIcon />,
      digital: <PaymentIcon />
    };
    return icons[method] || <PaymentIcon />;
  };

  const getStatusColor = (status) => {
    const colors = {
      autorizado: 'success',
      rechazado: 'error',
      registrado: 'primary',
      rembolso: 'warning'
    };
    return colors[status] || 'default';
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
        {/* Header con código y estatus */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#588157' }}>
              {getPaymentIcon(payment.method)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {payment.code}
              </Typography>
              <Typography variant="body2" color="#57300D" fontWeight="medium">
                {payment.method.toUpperCase()}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={payment.status.toUpperCase()}
            color={getStatusColor(payment.status)}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Montos */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="body2" color="#57300D" gutterBottom>
                Monto Pagado
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#588157">
                ${payment.amountPaid.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="body2" color="#57300D" gutterBottom>
                Total Pedido
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#333333">
                ${payment.totalOrder.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Información del pago */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Procesado por:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {payment.processedBy}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Fecha y Hora:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {payment.dateTime}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="#57300D">
              Referencia:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {payment.reference}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            startIcon={<ReceiptIcon />}
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
            Detalles
          </Button>
          {payment.status === 'autorizado' && (
            <Button 
              variant="outlined" 
              size="small"
              sx={{
                color: '#D32F2F',
                borderColor: '#D32F2F',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                  color: 'white'
                }
              }}
            >
              Rembolsar
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

CardPagos.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    code: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    amountPaid: PropTypes.number.isRequired,
    totalOrder: PropTypes.number.isRequired,
    processedBy: PropTypes.string.isRequired,
    dateTime: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired
  }).isRequired
};

export default CardPagos;