//import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CardCategoria = ({ category, onEdit, onDelete }) => {
  return (
    <Card sx={{
  borderRadius: 2,
  height: '100%',
  border: '1px solid',
  borderColor: '#E8E0D5', // Café claro
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  
}}>
  <CardContent sx={{
    p: 2,
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'justify', }}>
      
      <Box>
        <Typography variant="h5" fontWeight={600} color="#5D4037"> {/* Café oscuro */}
          {category.name}
        </Typography>
        <Typography variant="subtitle2" color="#8B7355" sx={{ display: 'block', }}>
          {category.description}
        </Typography>
      </Box>
    </Box>
    <Divider sx={{ my: 1, borderColor: '#E0E0E0', mb:4 }} />
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<EditIcon sx={{ fontSize: 18 }} />}
        onClick={() => onEdit?.(category)}
         sx={{
          color: "#588157",
          borderColor: "#588157",
          "&:hover": {
            backgroundColor: "#588157",
            color: "white",
          },
        }}
      >
        Editar
      </Button>
      <Button
        variant="outlined"
        size="small"
        color="error"
        startIcon={<DeleteOutlineIcon sx={{ fontSize: 18 }} />}
        onClick={() => onDelete?.(category)}
        sx={{
          "&:hover": {
            backgroundColor: "#B22222",
            color: "white",
          },
        }}
      >
        Eliminar
      </Button>
    </Box>
  </CardContent>
</Card>
  );
};

CardCategoria.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    productCount: PropTypes.number.isRequired,
    salesToday: PropTypes.number.isRequired,
    incomeToday: PropTypes.number.isRequired,
    status: PropTypes.bool.isRequired
  }).isRequired
};

CardCategoria.defaultProps = {
  onEdit: null,
  onToggle: null,
  onDelete: null
};

export default CardCategoria;