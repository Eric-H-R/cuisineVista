//import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button
} from '@mui/material';
//import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BusinessIcon from '@mui/icons-material/Business';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda';
import TabsInventario from '../components/TabsInventario';

const Insumos = () => {
  // Stats cards data
  const statsData = [
    { title: 'Insumos Activos', value: 125 },
    { title: 'Stock Crítico', value: 8 },
    { title: 'Stock Bajo', value: 15 },
    { title: 'Valor Total', value: '$2,845,000' }
  ];

  // Datos de stock
  const stocks = [
    {
      id: 1,
      name: 'Carne de Res Premium',
      description: 'Corte premium para platos principales',
      category: 'Carnes',
      currentStock: 200,
      minStock: 50,
      maxStock: 200,
      unit: 'kg',
      unitCost: 28500,
      totalValue: 712500
    },
    {
      id: 2,
      name: 'Pollo Entero',
      description: 'Pollo fresco para diversos platillos',
      category: 'Aves',
      currentStock: 15,
      minStock: 30,
      maxStock: 100,
      unit: 'kg',
      unitCost: 12500,
      totalValue: 187500
    },
    {
      id: 3,
      name: 'Aceite de Oliva Extra Virgen',
      description: 'Aceite premium para cocina y aderezos',
      category: 'Aceites',
      currentStock: 8,
      minStock: 20,
      maxStock: 80,
      unit: 'lt',
      unitCost: 35000,
      totalValue: 280000
    }
  ];

  // Datos de movimientos
  const movements = [
    {
      id: 1,
      productName: 'Carne de Res Premium',
      reference: 'ENT-001',
      type: 'entrada',
      movementType: 'Compra',
      quantity: 50,
      unit: 'kg',
      responsible: 'Ana García',
      dateTime: '5/10/2024 09:30',
      supplier: 'Carnes Premium S.A.',
      previousStock: 25,
      currentStock: 75
    },
    {
      id: 2,
      productName: 'Pollo Entero',
      reference: 'SAL-001',
      type: 'salida',
      movementType: 'Consumo Cocina',
      quantity: 10,
      unit: 'kg',
      responsible: 'Carlos López',
      dateTime: '5/10/2024 14:15',
      previousStock: 25,
      currentStock: 15
    },
    {
      id: 3,
      productName: 'Aceite de Oliva Extra Virgen',
      reference: 'ENT-002',
      type: 'entrada',
      movementType: 'Ajuste Inventario',
      quantity: 5,
      unit: 'lt',
      responsible: 'María Rodríguez',
      dateTime: '5/10/2024 16:45',
      previousStock: 3,
      currentStock: 8
    }
  ];

  // Datos de proveedores
  const suppliers = [
    {
      id: 1,
      name: 'Carnes Premium S.A.',
      contactPerson: 'Roberto Mendoza',
      phone: '555-1001',
      email: 'ventas@carnespremium.com',
      address: 'Av. Principal #123, Zona Industrial',
      productsCount: 15,
      ordersThisMonth: 8,
      deliveryTime: 2,
      status: true
    },
    {
      id: 2,
      name: 'Distribuidora de Lácteos Norte',
      contactPerson: 'Laura González',
      phone: '555-1002',
      email: 'lgonzalez@lacteosnorte.com',
      address: 'Calle Secundaria #456, Centro',
      productsCount: 25,
      ordersThisMonth: 12,
      deliveryTime: 1,
      status: true
    },
    {
      id: 3,
      name: 'Importadora de Especias Oriental',
      contactPerson: 'David Chen',
      phone: '555-1003',
      email: 'dchen@especiasoriental.com',
      address: 'Plaza Comercial #789, Este',
      productsCount: 40,
      ordersThisMonth: 5,
      deliveryTime: 3,
      status: true
    }
  ];

  const handleNewPurchase = () => {
    console.log('Abrir modal para nueva compra');
  };

  const handleNewSupply = () => {
    console.log('Abrir modal para nuevo insumo');
  };

  const handleNewSupplier = () => {
    console.log('Abrir modal para nuevo proveedor');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Gestión de Inventarios
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra stock, movimientos y proveedores
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<LocalShippingIcon />}
            onClick={handleNewPurchase}
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
            NUEVA COMPRA
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<InventoryIcon />}
            onClick={handleNewSupply}
            sx={{
              color: '#588157',
              borderColor: '#588157',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                backgroundColor: '#588157',
                color: 'white'
              }
            }}
          >
            NUEVO INSUMO
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<BusinessIcon />}
            onClick={handleNewSupplier}
            sx={{
              backgroundColor: '#333333',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                backgroundColor: '#1a1a1a'
              }
            }}
          >
            AGREGAR PROVEEDOR
          </Button>
        </Box>
      </Box>

      {/* Cards de estadísticas */}
      <CardEstadisticas cardsData={statsData} />

      {/* Barra de búsqueda y filtros */}
      <BarraBusqueda />
      
      {/*Tabs con Stock, Movimientos y Proveedores */}
      <TabsInventario 
        stocks={stocks}
        movements={movements}
        suppliers={suppliers}
      />
    </Container>
  );
};

export default Insumos;