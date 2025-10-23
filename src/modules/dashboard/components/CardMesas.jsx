import {  Grid, Typography, Box } from '@mui/material';

const CardMesas = () => {

    const mesasActivas = [
        { id: 1, mesa: 'Mesa 1', estado: 'Ocupada', clientes: 4 },
        { id: 2, mesa: 'Mesa 2', estado: 'Libre', clientes: 0 },
        { id: 3, mesa: 'Mesa 3', estado: 'Ocupada', clientes: 2 },
    ];

    return (
      <Box sx={{ mb: 2, p: 2, backgroundColor: '#ffff', borderRadius: 2 , boxShadow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom >
          Estado de Mesas
        </Typography>
        <Box sx={{  p: 2, borderTop: '1px solid #e0e0e0' }}>
             <Grid container item spacing={2} 
             
             sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          {mesasActivas.map((mesa) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={mesa.id}>
              <Box
                bgcolor={mesa.estado === 'Ocupada' ? '#ffbbbb' : mesa.estado === 'Libre' ? '#cde5d1' : 'transparent'}
                color={mesa.estado === 'Ocupada' ? '#5a0000' : mesa.estado === 'Libre' ? '#1b3a1a' : 'inherit'}
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="h6" component="h2" gutterBottom>
                  {mesa.mesa}
                </Typography>
                <Typography variant="body2">
                  Estado: {mesa.estado}
                </Typography>
                <Typography variant="body2">
                  Clientes: {mesa.clientes}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        </Box>
       
      </Box>
    );
}

export default CardMesas;
           