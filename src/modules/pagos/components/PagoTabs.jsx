import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import CardPagos from './CardPagos';
import CarMetodosPagos from './CardMetodosPagos';
import PropTypes from 'prop-types';

const CustomTabsPayments = ({ payments, paymentMethods }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabsData = [
    { label: 'Pagos', count: payments.length },
    { label: 'Métodos de Pago', count: paymentMethods.length }
  ];

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'inline-flex',
            border: '1px solid',
            borderColor: '#E0E0E0',
            borderRadius: '24px',
            backgroundColor: '#F8F9FA',
            p: 0.5,
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: '40px',
              '& .MuiTab-root': {
                minHeight: '32px',
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'none',
                color: '#333333',
                borderRadius: '20px',
                mx: 0.5,
                minWidth: { xs: 'auto', sm: '150px' },
                px: { xs: 2, sm: 3 },
                '&.Mui-selected': {
                  color: '#333333',
                  fontWeight: 600,
                  backgroundColor: '#EDE0D4'
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            {tabsData.map((tab, index) => (
              <Tab 
                key={index}
                label={`${tab.label} (${tab.count})`}
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* Contenido del Tab seleccionado */}
      <Box>
        {value === 0 && ( // Tab de Pagos
          <Grid container spacing={3}>
            {payments.map((payment) => (
              <Grid size={{ xs: 12, lg: 6 }} key={payment.id}>
                <CardPagos payment={payment} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {value === 1 && ( // Tab de Métodos de Pago
          <Grid container spacing={3}>
            {paymentMethods.map((method) => (
              <Grid size={{ xs: 12, lg: 6 }} key={method.id}>
                <CarMetodosPagos method={method} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

CustomTabsPayments.propTypes = {
  payments: PropTypes.array.isRequired,
  paymentMethods: PropTypes.array.isRequired
};

export default CustomTabsPayments;