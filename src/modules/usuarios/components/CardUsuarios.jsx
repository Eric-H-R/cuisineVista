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
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import PropTypes from 'prop-types';

const CardUsuarios = ({ user }) => {
  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header con nombre y estado */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#A3B18A' }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <Chip 
            label={user.status} 
            color={user.status === 'Activo' ? 'success' : 'error'}
            size="small"
          />
        </Box>

        <Typography variant="body1" fontWeight="medium" gutterBottom>
          {user.phone}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Información del usuario */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{xs:12,sm:6}}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Último acceso</strong>
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.lastAccess}
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{xs:12,sm:6}}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Miembro desde</strong>
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.memberSince}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{xs:12}}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Sucursales</strong>
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.branches}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Botones de acción */}
        <Box sx={{ display: 'flex',justifyContent:'center', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            size="small"
            sx={{mr:2}}
            label="bsba"
          >
            Editar
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<BlockIcon />}
            size="small"
          >
            Desactivar
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Roles asignados */}
        <Box>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Roles asignados:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {user.roles.map((role, index) => (
              <Chip 
                key={index}
                label={role}
                size="small"
                color="primary"
                variant="filled"
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

CardUsuarios.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    status: PropTypes.string.isRequired,
    lastAccess: PropTypes.string.isRequired,
    memberSince: PropTypes.string,
    branches: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default CardUsuarios;