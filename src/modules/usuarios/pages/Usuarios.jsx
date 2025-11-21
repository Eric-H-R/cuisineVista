import { useState, useEffect, useMemo  } from 'react';
import {
  Box, Typography, Button,Container
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CardEstadisticas from '../components/CardEstadisticas';
import BarraBusqueda from '../components/BarraBusqueda'
import UserTabs from '../components/UserTabs'
import FormularioUsuario from '../components/FormularioUsuario'
import FormularioRol from '../components/FormularioRol'
import { listaUsuariosAdapter, separarUsuariosYClientes } from '../adapters/usuarioAdapter';
import Scroll from '../../../hooks/Scroll'
import LoadingComponent from '../../../components/Loadings/LoadingComponent';

//TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
//API
import usuarioService from '../services/usuarios.service'
import rolesService from '../services/roles.service'
import sucursalesService from '../../sucursales/services/sucursales.service'


const Usuarios = () => {
  Scroll()

  const [openRolesModal, setOpenRolesModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [roles, setRoles] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    rol: 'todos-los-roles',
    status: 'todos'
  });

   // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
     const [rolesResponse, sucursalesResponse, usuarioResponse, modulosResponse] = await Promise.all([
        rolesService.getAll(),
        sucursalesService.getAll(),
        usuarioService.getAll(),
        rolesService.modulos()
      ]);
      console.log('Roles API:', rolesResponse?.data);
      console.log('Usuarios API:', usuarioResponse?.data);
      console.log('Sucursales API:', sucursalesResponse?.data);
      console.log('Módulos API:', modulosResponse?.data);
      
  
      // Adaptar Data y separar usuarios y clientes
      const adaptedUsers = listaUsuariosAdapter(usuarioResponse?.data || []);
      const { usuariosNormales, clientes } = separarUsuariosYClientes(adaptedUsers);
      console.log('Clientes:', clientes);
      setUsers(usuariosNormales);
      setClients(clientes);

      setRoles(Array.isArray(rolesResponse?.data?.data) ? rolesResponse.data.data : []);
      setSucursales(Array.isArray(sucursalesResponse?.data?.data) ? sucursalesResponse.data.data : []);
      setModulos(Array.isArray(modulosResponse?.data?.data) ? modulosResponse.data.data : []);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      setRoles([]);
      setSucursales([]);
      showSnackbar('Error cargando datos iniciales', 'error');
    } finally {
      setLoading(false);
    }
  };

   const handleOpenUserModal = (user = null) => {
    setUserToEdit(user);
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setUserToEdit(null);
    setOpenUserModal(false);
  };

  const handleOpenRolesModal = (rol = null) => {
    setRoleToEdit(rol);
    setOpenRolesModal(true);
  };

  const handleCloseRolesModal = () => {
    setOpenRolesModal(false);
  };

  const handleSaveUser = async (userData) => {
    try {
      setLoading(true);
       let response;
      if (userToEdit) {
        // EDITAR
        await usuarioService.update(userToEdit.id, userData);
        toast.success(`Usuario ${userToEdit.name} actualizado correctamente`);
      } else {
        // CREAR
        const { data }= await usuarioService.createUser(userData);
        response = data
        toast.success(`Usuario ${response.data.nombre} creado correctamente`);
      }
      console.log(response)
      handleCloseUserModal();
      await loadInitialData();

    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (roleData) => {
    try {
      setLoading(true);
      let response;
      if (roleToEdit) {
        // EDITAR
        await rolesService.update(roleToEdit.id_rol, roleData);
        toast.success(`Rol ${roleToEdit.nombre} actualizado correctamente`);
      } else {
        // CREAR
        const { data} = await rolesService.create(roleData);
        response = data
        toast.success(`Rol ${response.data.nombre} creado correctamente`);
      }
      handleCloseRolesModal();
      await loadInitialData();
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivate = async (user_id) => {
    try {
      const response =  await usuarioService.delete(user_id);
      console.log('Desactivar usuario response:', response);
      loadInitialData();
    } catch (error) {
      console.error('Error desactivating user:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
    }
  };

  const actions = {
    onDesactivate: handleDesactivate,
    onEdit: handleOpenUserModal,
    onEditRole: handleOpenRolesModal
  };

  // Función para filtrar usuarios
  const filteredUsers = useMemo(() => {
      if (!users.length) return [];

      return users.filter(user => {
        // Filtro por término de búsqueda
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = filters.searchTerm === '' || 
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          (user.roles && user.roles.some(rol => 
            rol?.toLowerCase().includes(searchLower)
          ));

        // Filtro por rol
        const matchesRol = filters.rol === 'todos-los-roles' || 
          (user.roles && user.roles.includes(filters.rol));

        // Filtro por estado
        const matchesStatus = filters.status === 'todos' || 
          (filters.status === 'activos' && user.status === 'Activo') ||
          (filters.status === 'inactivos' && user.status !== 'Activo');

        return matchesSearch && matchesRol && matchesStatus;
      });
    }, [users, filters]);

    // Función para filtrar clientes
  const filteredClients = useMemo(() => {
      if (!clients.length) return [];

      return clients.filter(client => {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = filters.searchTerm === '' || 
          client.name?.toLowerCase().includes(searchLower) ||
          client.email?.toLowerCase().includes(searchLower);

        // Los clientes siempre tienen rol "Cliente"
        const matchesRol = filters.rol === 'todos-los-roles' || 
          filters.rol === 'cliente';

        const matchesStatus = filters.status === 'todos' || 
          (filters.status === 'activos' && client.status === 'Activo') ||
          (filters.status === 'inactivos' && client.status !== 'Activo');

        return matchesSearch && matchesRol && matchesStatus;
      });
    }, [clients, filters]);

  const uniqueRoles = useMemo(() => {
      const allRoles = users.flatMap(user => user.roles || []);
      const uniqueUserRoles = [...new Set(allRoles)].map(rol => ({ 
        id: rol, 
        nombre: rol 
      }));
      
      // Agregar "Cliente" si hay clientes
      if (clients.length > 0) {
        uniqueUserRoles.push({ id: 'cliente', nombre: 'Cliente' });
      }
      
      return uniqueUserRoles;
    }, [users, clients]);

  const handleSearch = (newFilters) => {
      setFilters(newFilters);
    };

  const handleFilterChange = (newFilters) => {
      setFilters(newFilters);
    };

  const cardsData = [
      { title: 'Usuarios Activos', value: users.length },
      { title: 'Roles Disponibles', value: roles.length },
      { title: 'Clientes Registrados', value: clients.length },
      { title: 'Conectados Hoy', value: users.filter(u => u.lastAccess === 'Reciente').length }
    ];

return (
  <>
   <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
    />
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
              onClick={() => handleOpenRolesModal()}
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
          roles={roles}
          sucursales={sucursales}
          loading={loading}
        />

        <FormularioRol
          open={openRolesModal}
          onClose={handleCloseRolesModal}
          onSave={handleSaveRole}
          rolToEdit={roleToEdit}
          modulos={modulos}
          loading={loading}
        />
        <CardEstadisticas cardsData={cardsData}/>

        <BarraBusqueda 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
          roles={uniqueRoles}
        />


        {loading ? (
          <LoadingComponent message="Cargando usuarios..."  />
        ) : (
                <UserTabs users={filteredUsers} roles={roles} clientes={filteredClients} actions={actions} />
        )}
      
    </Container>
  </>
  
  );
}

export default Usuarios;