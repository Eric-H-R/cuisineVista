import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import CardUsuarios from './CardUsuarios';
import CardRoles from './CardRoles';
import CardClientes from './CardClinetes';
import PropTypes from 'prop-types';

const UserTabs = ({ users, roles, clientes }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabsData = [
    { label: 'Usuarios', count: users.length },
    { label: 'Roles', count: roles.length },
    { label: 'Clientes', count: 3 }
  ];

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'start' }}>
        <Box
          sx={{
            display: 'inline-flex',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '24px',
            backgroundColor: '#EDE0D4',
            p: 0.5,
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: '40px',
              '& .MuiTab-root': {
                minHeight: '32px',
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'none',
                color: 'text.primary',
                borderRadius: '20px',
                mx: 0.5,
                minWidth: { xs: 'auto', sm: '100px' },
                px: { xs: 2, sm: 3 },
                '&.Mui-selected': {
                  color: 'text.primary',
                  fontWeight: 600,
                  backgroundColor: 'grey.100'
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            {tabsData.map((tab, index) => (
              <Tab 
                key={index}
                label={`${tab.label} (${tab.count})`}
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* Contenido del Tab seleccionado */}
      <Box>
        {value === 0 && ( // Tab de Usuarios
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid size={{xs:12, md:6, lg:4}}  key={user.id}>
                <CardUsuarios user={user} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {value === 1 && ( // Tab de Roles
           <Grid container spacing={3}>
            {roles.map((role) => (
              <Grid size={{xs:12, md:6, lg:6}}   key={role.id}>
                <CardRoles role={role} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {value === 2 && ( // Tab de Clientes
           <Grid container spacing={3}>
            {clientes.map((cliente) => (
              <Grid size={{ xs: 12, lg: 6 }} key={cliente.id}>
                <CardClientes client={cliente} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

UserTabs.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      status: PropTypes.string.isRequired,
      lastAccess: PropTypes.string.isRequired,
      memberSince: PropTypes.string,
      branches: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired,
  roles: PropTypes.array.isRequired,
  clientes: PropTypes.array.isRequired
};

export default UserTabs;