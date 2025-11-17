import { Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';


const CardReservas = ({ reserva }) => {
    return (
        <Box
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                mb: 2,
                backgroundColor: 'background.paper',
                boxShadow: 1,
                
            }}
        >
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
               <Typography variant="h5" gutterBottom>
              {reserva.person} | {reserva.status}
              <Typography variant="body1" gutterBottom>
                Tel: {reserva.phone}
            </Typography>
            </Typography>
            </Box >
                    <Box sx={{ display: 'grid', gap: 2 }}>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: '#588157',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: '#486a47'
                                    }
                                }} 
                            >
                                Ver
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: '#588157',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: '#486a47'
                                    }
                                }} 
                            >
                                Ver
                            </Button>
                            
                    </Box>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">
                Nombre: {reserva.name}
            </Typography>
            <Typography variant="body1">
                Fecha: {reserva.date}
            </Typography>
            <Typography variant="body1">
                Hora: {reserva.time}
            </Typography>
            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: '#588157',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: '#486a47'
                                    }
                                }} 
                            >
                                Ver
                            </Button>
            </Box>
         <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="body1" sx={{bgcolor:'blue'}}>
                Nota: {reserva.note}
            </Typography>
            <Typography variant="body1" sx={{bgcolor:'primary'}}>
                Personas: {reserva.people}
            </Typography>
            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: '#588157',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: '#486a47'
                                    }
                                }} 
                            >
                                Ver
                            </Button>
            </Box>
        </Box>
    );
};

CardReservas.propTypes = {
    reserva: PropTypes.shape({
        phone: PropTypes.string.isRequired,
        person: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        note: PropTypes.string.isRequired,
        people: PropTypes.number.isRequired
    }).isRequired
};

export default CardReservas;