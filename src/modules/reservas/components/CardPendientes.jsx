import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';


const CardPendientes = ({ pendiente }) => {
    return (
        <Box
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                mb: 2,
                backgroundColor: 'background.paper',
                boxShadow: 1
            }}
        >
            <Typography variant="h6" gutterBottom>
                Reserva Pendiente
            </Typography>
            <Typography variant="body1">
                Nombre: {pendiente.name}
            </Typography>
            <Typography variant="body1">
                Fecha: {pendiente.date}
            </Typography>
            <Typography variant="body1">
                Hora: {pendiente.time}
            </Typography>
            <Typography variant="body1">
                Personas: {pendiente.people}
            </Typography>
        </Box>
    );
};

CardPendientes.propTypes = {
    pendiente: PropTypes.shape({
        name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        people: PropTypes.number.isRequired
    }).isRequired
};
export default CardPendientes;