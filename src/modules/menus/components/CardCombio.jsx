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
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EditIcon from '@mui/icons-material/Edit';
//import GroupIcon from '@mui/icons-material/Group';
import PropTypes from 'prop-types';

const CardCombo = ({ combo }) => {
  return (
    <Card sx={{ 
      borderRadius: 2, 
      height: '100%',
      border: '1px solid',
      borderColor: '#E0E0E0',
      backgroundColor: '#F8F9FA'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header del combo */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#A3B18A' }}>
              <FastfoodIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold" color="#333333">
                {combo.name}
              </Typography>
              <Typography variant="body2" color="#57300D">
                {combo.type}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={combo.status ? 'Disponible' : 'Agotado'}
            color={combo.status ? 'success' : 'error'}
            size="small"
          />
        </Box>

        {/* Descripción */}
        <Typography variant="body2" color="#333333" sx={{ mb: 2 }}>
          {combo.description}
        </Typography>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Precios */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#57300D">
              Precio Combo:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#588157">
              ${combo.comboPrice.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="#57300D">
              Precio Individual:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              ${combo.individualPrice.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Productos incluidos */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold" color="#333333" gutterBottom>
            Productos incluidos:
          </Typography>
          <List dense>
            {combo.products.map((product, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      • {product}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E0E0E0' }} />

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
            Editar Combo
          </Button>
          <Button 
            variant="outlined" 
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
            Ver Detalles
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CardCombo.propTypes = {
  combo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    comboPrice: PropTypes.number.isRequired,
    individualPrice: PropTypes.number.isRequired,
    status: PropTypes.bool.isRequired,
    products: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default CardCombo;