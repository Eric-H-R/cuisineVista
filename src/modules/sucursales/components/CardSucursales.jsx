//import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PropTypes from 'prop-types';

const CardSucursales = ({ branch }) => {
  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header con código y nombre */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#588157' }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {branch.name}
              </Typography>
              <Typography variant="body2" color="#57300D" fontWeight="medium">
                {branch.code}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={branch.status}
            color={branch.status === 'Active' ? 'success' : 'error'}
            size="small"
          />
        </Box>

        {/* Contacto */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {branch.phone}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {branch.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Estadísticas */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                {branch.tables.current}/{branch.tables.total}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Mesas
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                {branch.employees}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Empleados
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                {branch.ordersToday}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Pedidos Hoy
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                ${branch.incomeToday.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Ingresos Hoy
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Ticket promedio */}
        <Box sx={{ textAlign: 'center', mb: 2, p: 1, backgroundColor: '#EDE0D4', borderRadius: 1 }}>
          <Typography variant="h6" component="div" fontWeight="bold" color="#57300D">
            ${branch.averageTicket}
          </Typography>
          <Typography variant="body2" color="#57300D">
            Ticket Promedio
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
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
            Reportes
          </Button>
          <Button 
            variant="outlined" 
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
            Personal
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            sx={{
              color: '#333333',
              borderColor: '#333333',
              '&:hover': {
                backgroundColor: '#333333',
                color: 'white'
              }
            }}
          >
            Config
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
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
            Editar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CardSucursales.propTypes = {
  branch: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    tables: PropTypes.shape({
      current: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired
    }).isRequired,
    employees: PropTypes.number.isRequired,
    ordersToday: PropTypes.number.isRequired,
    incomeToday: PropTypes.number.isRequired,
    averageTicket: PropTypes.number.isRequired
  }).isRequired
};

export default CardSucursales;