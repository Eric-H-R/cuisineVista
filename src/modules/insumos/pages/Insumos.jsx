//import React from 'react';
import {  Box,Typography,Container,Button, List} from '@mui/material';

//import AddIcon from '@mui/icons-material/Add';

import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda';
import TabsInventario from '../components/TabsInventario';
import proveedoresApi from '../services/ProveedoresService';
import { useEffect, useState } from 'react';




const Insumos = () => {
  // Stats cards data
  const statsData = [
    { title: 'Insumos Activos', value: 125 },
    { title: 'Stock Crítico', value: 8 },
    { title: 'Stock Bajo', value: 15 },
    { title: 'Valor Total', value: '$2,845,000' }
  ];

  
 
  const [proveedores, setProveedores] = useState([]);
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await proveedoresApi.getAll();
        setProveedores(data.data.data);
        console.log(data);
        console.log('Total de proveedores:', data.data.total);
      } catch (error) {
        console.error('Error al cargar los proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);
  
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
          <Typography variant="subtitle2" color="text.secondary">
            
          </Typography>

        </Box>
      </Box> 
      
      {/*Tabs con Stock, Movimientos y Proveedores */}
      <TabsInventario 
        
        suppliers={proveedores}
      />
    </Container>
  );
};

export default Insumos;