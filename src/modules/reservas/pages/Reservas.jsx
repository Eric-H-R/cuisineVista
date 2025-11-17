import { Box, Button, Container, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchReservas from '../components/SearchReservas';
import CardReservas from '../components/TargetsReservas';
import ReservasTabs from '../components/ReservasTabs';

const Reservas = ()=>{
    return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Gestión de Reservas
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => { console.log('Nueva Reserva'); }}
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
            Nueva Reserva
          </Button>
        </Box>
      </Box>
      <CardReservas reservasData={reservasData} />
      <SearchReservas onSearch={(query) => { console.log('Buscar:', query); }} />
      <ReservasTabs pendientes={pendientesData} reservas={reservasData} />
    </Container>
  );
};

const reservasData = [
  { id: 1, phone: '477-582-3664', person: 'John Doe', name: 'Reserva 1', date: '2024-07-01', status: 'Programada', people: 4, time: '19:00', note: 'Mesa cerca de la ventana' },
  { id: 2, phone: '123-456-7890', person: 'Jane Smith', name: 'Reserva 2', date: '2024-07-02', status: 'En curso', people: 2 , time: '20:00', note: 'Mesa en el interior' },
  { id: 3, phone: '987-654-3210', person: 'Alice Johnson', name: 'Reserva 3', date: '2024-07-03', status: 'Completada', people: 5, time: '21:00', note: 'Mesa al aire libre' },
  { id: 4, phone: '555-555-5555', person: 'Bob Brown', name: 'Reserva 4', date: '2024-07-04', status: 'Cancelada', people: 3, time: '22:00', note: 'Mesa en la esquina' },
];

const pendientesData = [
  { id: 1, name: 'Reserva 1', date: '2024-07-01', status: 'Programada', people: 4, time: '19:00' },
  { id: 2, name: 'Reserva 2', date: '2024-07-02', status: 'En curso', people: 2 , time: '20:00' },
  { id: 3, name: 'Reserva 3', date: '2024-07-03', status: 'Completada', people: 5, time: '21:00' },
  { id: 4, name: 'Reserva 4', date: '2024-07-04', status: 'Cancelada', people: 3, time: '22:00' },

];


export default Reservas;