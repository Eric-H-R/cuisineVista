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
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const BranchCardWithAssignments = ({ branch, onAssign, onUnassign }) => {
  const tables = branch.tables || { current: 0, total: 0 };
  const employees = branch.employees || 0;
  const ordersToday = branch.ordersToday || 0;
  const incomeToday = branch.incomeToday || 0;
  const averageTicket = branch.averageTicket || 0;
  const assignments = branch.assignments || [];

  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header de la sucursal */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#588157' }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {branch.name || 'Sin nombre'}
              </Typography>
              <Typography variant="body2" color="#57300D" fontWeight="medium">
                {branch.code || 'Sin código'}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={branch.status || 'Inactiva'}
            color={branch.status === 'Active' ? 'success' : 'error'}
            size="small"
          />
        </Box>

        {/* Contacto */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {branch.phone || 'Sin teléfono'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {branch.email || 'Sin email'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Estadísticas */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                {tables.current}/{tables.total}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Mesas
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                {employees}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Empleados
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                {ordersToday}
              </Typography>
              <Typography variant="body2" color="#57300D">
                Pedidos Hoy
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" fontWeight="bold" color="#588157">
                ${incomeToday.toLocaleString()}
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
            ${averageTicket}
          </Typography>
          <Typography variant="body2" color="#57300D">
            Ticket Promedio
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Personal Asignado */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#333333">
              Personal Asignado ({assignments.length})
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={() => onAssign(branch)}
              sx={{
                color: '#588157',
                borderColor: '#588157',
                '&:hover': {
                  backgroundColor: '#588157',
                  color: 'white'
                }
              }}
            >
              Asignar Personal
            </Button>
          </Box>

          {assignments.length > 0 ? (
            <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
              {assignments.map((assignment) => (
                <ListItem 
                  key={assignment.id}
                  sx={{ 
                    border: '1px solid',
                    borderColor: '#E0E0E0',
                    borderRadius: 1,
                    mb: 0.5,
                    py: 1
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#A3B18A' }}>
                    <PersonIcon />
                  </Avatar>
                  <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {assignment.employeeName}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="#57300D" display="block">
                            {assignment.role} • {assignment.shift}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {assignment.schedule}
                          </Typography>
                        </>
                      }
                    />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={() => onUnassign(assignment)}
                      sx={{
                        color: '#D32F2F',
                        '&:hover': {
                          backgroundColor: '#D32F2F',
                          color: 'white'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2, backgroundColor: '#EDE0D4', borderRadius: 1 }}>
              <Typography variant="body2" color="#57300D">
                No hay personal asignado
              </Typography>
            </Box>
          )}
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
            Editar Sucursal
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

BranchCardWithAssignments.propTypes = {
  branch: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    code: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
    tables: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number
    }),
    employees: PropTypes.number,
    ordersToday: PropTypes.number,
    incomeToday: PropTypes.number,
    averageTicket: PropTypes.number,
    assignments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        employeeName: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        shift: PropTypes.string.isRequired,
        schedule: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  onAssign: PropTypes.func.isRequired,
  onUnassign: PropTypes.func.isRequired
};

export default BranchCardWithAssignments;