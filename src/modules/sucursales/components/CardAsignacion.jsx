import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ReportIcon from '@mui/icons-material/Assessment';

const CardAsignacion = ({ branch, onEdit, onDesactivate }) => {
  
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(branch);
    }
  };

  const handleDesactivateClick = () => {
    if (onDesactivate) {
      onDesactivate(branch.id_sucursal);
    }
  };

  if (!branch) {
    return (
      <Card sx={{ borderRadius: 2, height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography>Cargando...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#588157' }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {branch.nombre || 'Sin nombre'}
              </Typography>
              <Typography variant="body2" color="#57300D" fontWeight="medium">
                {branch.codigo_sucursal || 'Sin código'}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={branch.es_activa ? 'Activa' : 'Inactiva'}
            color={branch.es_activa ? 'success' : 'error'}
            size="small"
          />
        </Box>

        {/* Información de contacto */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {branch.telefono || 'Sin teléfono'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: '#57300D' }} />
            <Typography variant="body2" color="#333333">
              {branch.direccion || 'Sin dirección'}
            </Typography>
          </Box>
        </Box>
        
        {/* Información de la sucursal */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="#57300D" fontWeight="medium" sx={{ mb: 1 }}>
            Información de la Sucursal
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="#333333">
              ID: {branch.id_sucursal}
            </Typography>
            <Typography variant="body2" color="#333333">
              Creada: {new Date(branch.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            startIcon={<ReportIcon />}
            onClick={handleDesactivateClick}
            size="small"
            sx={{
              color: '#f12525ff',
              borderColor: '#d81f1fff',
              '&:hover': {
                backgroundColor: '#d81f1fff',
                color: 'white'
              }
            }}
          >
            Desactivar
          </Button>
          <Button 
            variant="outlined"
            onClick={handleEditClick} 
            startIcon={<EditIcon />}
            size="small"
            sx={{
              color: '#486A47',
              borderColor: '#486A47',
              '&:hover': {
                backgroundColor: '#486A47',
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

export default CardAsignacion;