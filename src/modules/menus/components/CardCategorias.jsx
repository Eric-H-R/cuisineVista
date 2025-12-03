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
  CardMedia,
  Grid
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CardCategoria = ({ category, imageNumber, onEdit, onDelete }) => {
  const image = category?.image || category?.image_url || category?.imagen || (imageNumber ? `/img/${imageNumber}.jpg` : null);

  return (
    <Card sx={{
      borderRadius: 2,
      height: '100%',
      border: '1px solid',
      borderColor: '#E8E0D5',
      boxShadow: 'none',
      transition: 'all 0.2s ease',
    }}>
      {image && (
        <CardMedia
          component="img"
          image={image}
          alt={category.name || 'Categoría'}
          sx={{ width: '100%', height: 140, objectFit: 'cover' }}
        />
      )}

      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h6" fontWeight={600} color="#5D4037">
            {category.name}
          </Typography>
          <Typography variant="body2" color="#8B7355">
            {category.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 18 }} />}
              onClick={() => onEdit?.(category)}
              sx={{
                color: "#588157",
                borderColor: "#588157",
                "&:hover": { backgroundColor: "#588157", color: "white" },
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
              sx={{ '&:hover': { backgroundColor: '#B22222', color: 'white' } }}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

CardCategoria.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    productCount: PropTypes.number,
    salesToday: PropTypes.number,
    incomeToday: PropTypes.number,
    status: PropTypes.bool,
  }).isRequired,
  imageNumber: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

CardCategoria.defaultProps = {
  imageNumber: null,
  onEdit: null,
  onDelete: null,
};

export default CardCategoria;