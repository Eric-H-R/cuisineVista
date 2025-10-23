import { Box,Typography,Container,Button} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; 
import CardDashboard from '../components/CardDashboard';
import CardInventario from '../components/CardPedidos';
import CardMesas from '../components/CardMesas';

const Dashboard = () => {

  const statsData = [
    { title: 'Ingresos del día', value: '$150,420' },
    { title: 'Pedidos', value: 501 },
    { title: 'Clientes', value: 100 },
    { title: 'Ticket Promedio', value: 4 }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Resumen del día a día y métricas clave
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => { console.log('Reporte de Dashboard'); }}
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
            Ver reporte completo
          </Button>
        </Box>
      </Box>
    
      {/* Aquí iría el contenido principal del Dashboard */}
      <CardDashboard statsData={statsData} />
      <CardInventario />
      <CardMesas />
    </Container>
  );
};

export default Dashboard;