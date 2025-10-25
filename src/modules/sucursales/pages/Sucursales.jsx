//import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
//import CardEstadisticas from '../components/CardEstadisticas'
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda'
import CardAsignacion from '../components/CardAsignacion'
import Scroll from '../../../hooks/Scroll'

const Sucursales = () => {
   Scroll()
    const statsData = [
    { title: 'Sucursales Activas', value: 3 },
    { title: 'Ingresos del Día', value: '$35.400' },
    { title: 'Pedidos del Día', value: 201 },
    { title: 'Empleados Activos', value: 30 }
  ];

  const branches = [
    {
      id: 1,
      name: 'Sucursal Principal',
      code: 'SUC-001',
      phone: '555-0100',
      email: 'principal@cuisine.com',
      status: 'Active',
      tables: { current: 23, total: 25 },
      employees: 12,
      ordersToday: 89,
      incomeToday: 15420,
      averageTicket: 173,
      assignments: [
        {
          id: 1,
          employeeName: 'Ana García',
          role: 'Gerente',
          shift: 'Matutino',
          schedule: '8:00 - 16:00'
        },
        {
          id: 2,
          employeeName: 'Carlos López',
          role: 'Supervisor',
          shift: 'Vespertino', 
          schedule: '14:00 - 22:00'
        },
         {
          id: 3,
          employeeName: 'Carlos López',
          role: 'Supervisor',
          shift: 'Vespertino', 
          schedule: '14:00 - 22:00'
        },
         {
          id: 4,
          employeeName: 'Carlos López',
          role: 'Supervisor',
          shift: 'Vespertino', 
          schedule: '14:00 - 22:00'
        },
         {
          id: 5,
          employeeName: 'Carlos López',
          role: 'Supervisor',
          shift: 'Vespertino', 
          schedule: '14:00 - 22:00'
        },
      ]
    },
    {
      id: 2,
      name: 'Sucursal Norte',
      code: 'SUC-002',
      phone: '555-0200',
      email: 'norte@cuisine.com',
      status: 'Active',
      tables: { current: 18, total: 20 },
      employees: 8,
      ordersToday: 67,
      incomeToday: 11200,
      averageTicket: 167,
      assignments: [
        {
          id: 3,
          employeeName: 'María Rodríguez',
          role: 'Cajera',
          shift: 'Matutino',
          schedule: '7:00 - 15:00'
        }
      ]
    },
    {
      id: 3,
      name: 'Sucursal Sur',
      code: 'SUC-003',
      phone: '555-0300',
      email: 'sur@cuisine.com',
      status: 'Inactive',
      tables: { current: 0, total: 15 },
      employees: 0,
      ordersToday: 0,
      incomeToday: 0,
      averageTicket: 0,
      assignments: []
    }
  ];

  const handleNewBranch = () => {
    console.log('Abrir modal de nueva sucursal');
  };

  const handleAssign = (branch) => {
    console.log('Asignar personal a:', branch.name);
  };

  const handleUnassign = (assignment) => {
    console.log('Desasignar:', assignment.employeeName);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Gestión de Sucursales
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra las sucursales y asignaciones de personal
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleNewBranch}
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
          NUEVA SUCURSAL
        </Button>
      </Box>

      {/* Cards de estadísticas */}
      <CardEstadisticas cardsData={statsData} />

      {/* Barra de búsqueda */}
      <BarraBusqueda placeholder="Buscar sucursales..." />

      {/* Grid de Sucursales con asignaciones */}
      <Grid container spacing={3}>
        {branches.map((branch) => (
          <Grid size={{ xs: 12, lg: 6 }} key={branch.id}>
            <CardAsignacion 
              branch={branch} 
              onAssign={handleAssign}
              onUnassign={handleUnassign}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Sucursales;