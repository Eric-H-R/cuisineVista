//import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaymentIcon from '@mui/icons-material/Payment';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda';
import PagosTabs from '../components/PagoTabs'

const Pagos = () => {


   const statsData = [
    { title: 'Total del Día', value: '$15,420' },
    { title: 'Transacciones', value: 89 },
    { title: 'Autorizados', value: 85 },
    { title: 'Rechazados', value: 4 }
  ];

  const payments = [
    {
      id: 1,
      code: 'PAY-001',
      status: 'autorizado',
      method: 'tarjeta',
      amountPaid: 2500,
      totalOrder: 2500,
      processedBy: 'Ana García',
      dateTime: '5/10/2024 14:30',
      reference: 'REF-123456'
    },
    {
      id: 2,
      code: 'PAY-002',
      status: 'rechazado',
      method: 'digital',
      amountPaid: 0,
      totalOrder: 1800,
      processedBy: 'Carlos López',
      dateTime: '5/10/2024 15:15',
      reference: 'REF-123457'
    },
    {
      id: 3,
      code: 'PAY-003',
      status: 'autorizado',
      method: 'efectivo',
      amountPaid: 3200,
      totalOrder: 3200,
      processedBy: 'María Rodríguez',
      dateTime: '5/10/2024 16:45',
      reference: 'REF-123458'
    }
  ];

  // Datos de métodos de pago
  const paymentMethods = [
    {
      id: 1,
      name: 'Tarjeta de Crédito',
      type: 'tarjeta',
      description: 'Visa, Mastercard, Amex',
      status: true,
      transactionsToday: 45,
      totalToday: 11200,
      acceptanceRate: 98
    },
    {
      id: 2,
      name: 'Efectivo',
      type: 'efectivo',
      description: 'Pagos en efectivo',
      status: true,
      transactionsToday: 25,
      totalToday: 6250,
      acceptanceRate: 100
    },
    {
      id: 3,
      name: 'Transferencia',
      type: 'transferencia',
      description: 'Transferencias bancarias',
      status: true,
      transactionsToday: 12,
      totalToday: 4800,
      acceptanceRate: 95
    },
    {
      id: 4,
      name: 'Pago Digital',
      type: 'digital',
      description: 'Mercado Pago, PayPal',
      status: false,
      transactionsToday: 7,
      totalToday: 2100,
      acceptanceRate: 92
    }
  ];
  const handleAddPaymentMethod = () => {
    console.log('Abrir modal para añadir método de pago');
  };

  const handleRegisterPayment = () => {
    console.log('Abrir modal para registrar pago');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Gestión de Pagos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra los pagos y métodos de pago del sistema
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAddPaymentMethod}
            sx={{
              color: '#57300D',
              borderColor: '#57300D',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                backgroundColor: '#57300D',
                color: 'white'
              }
            }}
          >
            AÑADIR MÉTODO
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<PaymentIcon />}
            onClick={handleRegisterPayment}
            sx={{
              backgroundColor: '#588157',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                backgroundColor: '#486a47'
              }
            }}
          >
            REGISTRAR PAGO
          </Button>
        </Box>
      </Box>
    
    <CardEstadisticas cardsData={statsData} />
    <BarraBusqueda />
    <PagosTabs payments={payments}
        paymentMethods={paymentMethods} />
    </Container>
  );
};

export default Pagos;