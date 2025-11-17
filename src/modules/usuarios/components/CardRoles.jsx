//import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import PropTypes from 'prop-types';

const CardRoles = ({ role, onEdit }) => {

  const handleEditClick = () => {
    onEdit(role);
  };
  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header con nombre del rol y usuarios */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettingsIcon sx={{ mr: 1, color: '#588157' }} />
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {role.nombre}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <PeopleIcon sx={{ fontSize: 16, mr: 0.5, color: '#57300D' }} />
                <Typography variant="body2" color="#57300D">
                  {role.usuarios_asignados} usuario{role.usuarios_asignados !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Chip 
            label={role.nombre}
            size="small"
            sx={{
              backgroundColor: role.nombre === 'Administrador' ? '#588157' : '#A3B18A',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>

        {/* Descripción */}
        <Typography variant="body2" color="#333333" sx={{ mb: 2 }}>
          {role.descripcion ? role.descripcion : 'Sin descripción disponible.'}
        </Typography>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Módulos con acceso */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#333333" gutterBottom>
            Módulos con acceso:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {role.modulos.map(m => (
              <Chip 
                key={m.id_modulo}
                label={m.nombre}
                size="small"
                sx={{
                  backgroundColor: '#EDE0D4',
                  color: '#57300D',
                  border: '1px solid #A3B18A'
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1 }}>
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
            Permisos
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            size="small"
            sx={{
              backgroundColor: '#57300D',
              color: 'white',
              '&:hover': {
                backgroundColor: '#46250A'
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

CardRoles.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userCount: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    modules: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default CardRoles;