//import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Divider,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';

const CardClientes = ({ client }) => {
  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header con nombre y departamento */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#588157' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {client.name}
              </Typography>
              <Typography variant="body2" color="#57300D" fontWeight="medium">
                {client.department}
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<HistoryIcon />}
            size="small"
            sx={{
              color: '#588157',
              borderColor: '#588157',
              '&:hover': {
                backgroundColor: '#588157',
                color: 'white'
              }
            }}
          >
            Ver Historial
          </Button>
        </Box>

        {/* Contacto */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {client.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {client.phone}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            size="small"
            sx={{
              color: '#57300D',
              borderColor: '#57300D',
              '&:hover': {
                backgroundColor: '#57300D',
                color: 'white'
              }
            }}
          >
            Editar
          </Button>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Estadísticas */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                {client.totalOrders}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Pedidos totales
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                ${client.totalSpent}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Gasto total
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                ${client.averageTicket}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Ticket promedio
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                {client.lastOrder}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Último pedido
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Información adicional */}
        <Box>
          <Typography variant="body2" color="#333333">
            <strong>Cliente desde:</strong> {client.memberSince}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

CardClientes.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    totalOrders: PropTypes.number.isRequired,
    totalSpent: PropTypes.number.isRequired,
    averageTicket: PropTypes.number.isRequired,
    lastOrder: PropTypes.string.isRequired,
    memberSince: PropTypes.string.isRequired
  }).isRequired
};

export default CardClientes;