import { useState, useEffect } from 'react';
import {
  Box, Typography, Button,Container
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda'
import UserTabs from '../components/UserTabs'
import FormularioUsuario from '../components/FormularioUsuario'
import Scroll from '../../../hooks/Scroll'
//API
import rolesService from '../services/roles.service'
import sucursalesService from '../../sucursales/services/sucursales.service'
 

const Sucursales = () => {
  Scroll()

  const [openRolesModal, setOpenRolesModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [roless, setRoles] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


   // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const rolesResponse = await rolesService.getAll();
      const sucursalesResponse = await sucursalesService.getAll();
      setRoles(Array.isArray(rolesResponse?.data?.data) ? rolesResponse.data.data : []);
      setSucursales(Array.isArray(sucursalesResponse?.data?.data) ? sucursalesResponse.data.data : []);
      
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      setRoles([]);
      setSucursales([]);
      showSnackbar('Error cargando datos iniciales', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSucursales = async () => {
    const response =  await rolesService.getAll();
    console.log(response.data.data)
  };

   const handleOpenUserModal = (user = null) => {
    setUserToEdit(user);
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setUserToEdit(null);
    setOpenUserModal(false);
  };

  const handleOpenRolesModal = () => {
    setOpenRolesModal(true);
  };

  const handleCloseRolesModal = () => {
    setOpenRolesModal(false);
  };

  const handleSaveUser = async (userData) => {
    try {
      setLoading(true);
      
      // Aquí llamas a tu servicio de usuarios
      console.log('Guardando usuario:', userData);
      
      showSnackbar(
        userToEdit ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente', 
        'success'
      );
      
      handleCloseUserModal();
      
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

const cardsData = [
    { title: 'Usuarios Activos', value: 3 },
    { title: 'Roles Disponibles', value: 7 },
    { title: 'Clientes Registrados', value: 3 },
    { title: 'Conectados Hoy', value: 5 }
  ];

  const users = [
    {
      id: 1,
      name: 'Ana García',
      email: 'admin@cuisine.com',
      phone: '555-0101',
      status: 'Activo',
      lastAccess: '5/10/2024',
      memberSince: '15/1/2024',
      branches: 'Sucursal Principal',
      roles: ['Administrador', 'Gerente']
    },
    {
      id: 2,
      name: 'Carlos López',
      email: 'carlos@cuisine.com',
      phone: '555-0102',
      status: 'Inactivo',
      lastAccess: '4/10/2024',
      memberSince: '20/2/2024',
      branches: 'Sucursal Norte',
      roles: ['Editor', 'Supervisor']
    },
    // ... más usuarios
  ];

  // En tu componente principal
const roles = [
  {
    id: 1,
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    userCount: 2,
    type: 'Administrador',
    modules: ['Dashboard', 'Pedidos', 'Mesas', 'Menu', 'Inventario', 'Reservas', 'Pages', 'Usuarios', 'Configuración']
  },
  {
    id: 2,
    name: 'Gerente',
    description: 'Gestión operativa del restaurante',
    userCount: 1,
    type: 'Gerente',
    modules: ['Dashboard', 'Pedidos', 'Mesas', 'Menu', 'Inventario', 'Reservas', 'Pages']
  },
  {
    id: 3,
    name: 'Supervisor',
    description: 'Supervisión de operaciones diarias',
    userCount: 3,
    type: 'Supervisor',
    modules: ['Dashboard', 'Pedidos', 'Mesas', 'Menu', 'Inventario']
  }
];

// En tu componente principal
const clients = [
  {
    id: 1,
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '555-1234',
    department: 'Dept',
    totalOrders: 12,
    totalSpent: 2340,
    averageTicket: 195,
    lastOrder: '3/10/2024',
    memberSince: '15/8/2024'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '555-5678',
    department: 'MKT',
    totalOrders: 8,
    totalSpent: 1560,
    averageTicket: 195,
    lastOrder: '2/10/2024',
    memberSince: '10/7/2024'
  }
  // ... más clientes
];

return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Usuarios
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administración de usuarios, roles y permisos
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleSucursales}
              startIcon={<AdminPanelSettingsIcon/>}
              sx={{
                    color: '#333333',
                    borderColor: '#333333',
                    '&:hover': {
                      borderColor: '#333333',
                      backgroundColor: '#2e2d2dff',
                      color: 'white'
                    }
                  }}
            >
              Nuevo Rol
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon/>}
              onClick={() => handleOpenUserModal()}
               sx={{
                    backgroundColor: '#588157',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#486a47ff'
                    }
                  }}
            >
              Nuevo Usuario
            </Button>
          </Box>
        </Box>

        <FormularioUsuario
          open={openUserModal}
          onClose={handleCloseUserModal}
          onSave={handleSaveUser}
          userToEdit={userToEdit}
          roles={roless}
          sucursales={sucursales}
          loading={loading}
        />
        <CardEstadisticas cardsData={cardsData}/>

        <BarraBusqueda />

        <UserTabs users={users} roles={roles} clientes={clients}/>

      
    </Container>
  );
}

export default Sucursales;