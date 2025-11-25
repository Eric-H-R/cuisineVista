import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import FilterConfig from '../components/FilterConfig';



const Configuracion = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Configuraciones
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administración de configuraciones del restaurante
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
          </Box>
        </Box>
            <Box sx={{ mt: 3 }}>
              <FilterConfig />
            </Box>
    </Container>
  );
}

export default Configuracion;