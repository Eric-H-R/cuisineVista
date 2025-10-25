import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import ProductCard from './CardProductos';
import ComboCard from './CardCombio';
import CategoryCard from './CardCategorias';
import PropTypes from 'prop-types';

const TabsMenus = ({ products, combos, categories }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabsData = [
    { label: 'Productos', count: products.length },
    { label: 'Combos', count: combos.length },
    { label: 'Categorías', count: categories.length }
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
                minWidth: { xs: 'auto', sm: '120px' },
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
        {value === 0 && ( // Tab de Productos
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid size={{ xs: 12, lg: 6 }} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {value === 1 && ( // Tab de Combos
          <Grid container spacing={3}>
            {combos.map((combo) => (
              <Grid size={{ xs: 12, lg: 6 }} key={combo.id}>
                <ComboCard combo={combo} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {value === 2 && ( // Tab de Categorías
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid size={{ xs: 12, lg: 6 }} key={category.id}>
                <CategoryCard category={category} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

TabsMenus.propTypes = {
  products: PropTypes.array.isRequired,
  combos: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired
};

export default TabsMenus;