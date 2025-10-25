//import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button
} from '@mui/material';
//import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StatsCards from '../components/CardEstadisticas'
import BarraBusqueda from '../components/BarraBusqueda';
import TabsMenus from '../components/TabsMenus';

const Menus = () => {
  // Stats cards data
  const statsData = [
    { title: 'Total Productos', value: 45 },
    { title: 'Combos Activos', value: 12 },
    { title: 'Categorías', value: 8 },
    { title: 'Ventas Hoy', value: '$8,420' }
  ];
  
  // Datos de productos
  const products = [
    {
      id: 1,
      name: 'Pasta Alfredo',
      description: 'Pasta con salsa cremosa de parmesano y pollo',
      category: 'Platos Fuertes',
      price: 18500,
      cost: 8500,
      inventory: 25,
      status: true
    },
    {
      id: 2,
      name: 'Ensalada César',
      description: 'Lechuga romana, crutones, parmesano y aderezo césar',
      category: 'Entradas',
      price: 12500,
      cost: 4500,
      inventory: 18,
      status: true
    },
    {
      id: 3,
      name: 'Tiramisú',
      description: 'Postre italiano con café y mascarpone',
      category: 'Postres',
      price: 9500,
      cost: 3500,
      inventory: 0,
      status: false
    }
  ];

  // Datos de combos
  const combos = [
    {
      id: 1,
      name: 'Combo Familiar',
      description: 'Perfecto para 4 personas',
      type: 'Familiar',
      comboPrice: 45000,
      individualPrice: 52000,
      status: true,
      products: ['Pizza Grande', 'Ensalada César', 'Refresco 2L', 'Postre']
    },
    {
      id: 2,
      name: 'Combo Pareja',
      description: 'Ideal para una cena romántica',
      type: 'Pareja',
      comboPrice: 32000,
      individualPrice: 38000,
      status: true,
      products: ['Pasta Alfredo', 'Vino Tinto', 'Postre Especial']
    }
  ];

  // Datos de categorías
  const categories = [
    {
      id: 1,
      name: 'Entradas',
      description: 'Platos para comenzar tu experiencia',
      productCount: 8,
      salesToday: 23,
      incomeToday: 287500,
      status: true
    },
    {
      id: 2,
      name: 'Platos Fuertes',
      description: 'Nuestros platos principales',
      productCount: 15,
      salesToday: 45,
      incomeToday: 845000,
      status: true
    },
    {
      id: 3,
      name: 'Postres',
      description: 'Dulces para terminar tu comida',
      productCount: 10,
      salesToday: 18,
      incomeToday: 171000,
      status: true
    },
    {
      id: 4,
      name: 'Bebidas',
      description: 'Refrescos, jugos y bebidas especiales',
      productCount: 12,
      salesToday: 67,
      incomeToday: 201000,
      status: true
    }
  ];

  const handleNewCategory = () => {
    console.log('Abrir modal para nueva categoría');
  };

  const handleNewProduct = () => {
    console.log('Abrir modal para nuevo producto');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Gestión de Menús
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra productos, combos y categorías del menú
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<CategoryIcon />}
            onClick={handleNewCategory}
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
            NUEVA CATEGORÍA
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<RestaurantIcon />}
            onClick={handleNewProduct}
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
            NUEVO PRODUCTO
          </Button>
        </Box>
      </Box>

      {/* Cards de estadísticas */}
      <StatsCards cardsData={statsData} />

      {/*Barra de búsqueda y filtros */}
      <BarraBusqueda />

      {/* Tabs con Productos, Combos y Categorías */}
      <TabsMenus 
        products={products}
        combos={combos}
        categories={categories}
      />
      
    </Container>
  );
};

export default Menus;