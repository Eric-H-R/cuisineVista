import React from 'react';
import {
  Box,
  Tabs,
  Tab
} from '@mui/material';
import CardStock from './CardStock';
import CardMovimiento from './CardMovimiento';
import CardProveedores from './CardProveedores';
import PropTypes from 'prop-types';

const TabsInvetario = ({ stocks, movements, suppliers }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabsData = [
    { label: 'Stock', count: stocks.length },
    { label: 'Movimientos', count: movements.length },
    { label: 'Proveedores', count: suppliers.length }
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
                minWidth: { xs: 'auto', sm: '140px' },
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
        {value === 0 && ( // Tab de Stock - Cards que cubren todo el ancho
          <Box>
            {stocks.map((stock) => (
              <CardStock key={stock.id} stock={stock} />
            ))}
          </Box>
        )}
        
        {value === 1 && ( // Tab de Movimientos - Cards que cubren todo el ancho
          <Box>
            {movements.map((movement) => (
              <CardMovimiento key={movement.id} movement={movement} />
            ))}
          </Box>
        )}
        
        {value === 2 && ( // Tab de Proveedores - Cards que cubren todo el ancho
          <Box>
            {suppliers.map((supplier) => (
              <CardProveedores key={supplier.id} supplier={supplier} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

TabsInvetario.propTypes = {
  stocks: PropTypes.array.isRequired,
  movements: PropTypes.array.isRequired,
  suppliers: PropTypes.array.isRequired
};

export default TabsInvetario;