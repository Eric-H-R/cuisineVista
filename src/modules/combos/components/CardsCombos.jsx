import React from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Chip, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import colores from '../../../theme/colores';

const ComboCard = ({ combo, onEdit, onDelete }) => {
  const image = combo.imagen_url && (combo.imagen_url.startsWith('http') || combo.imagen_url.startsWith('data:') ? combo.imagen_url : `data:image/png;base64,${combo.imagen_url}`);

  return (
    <Card sx={{
      borderRadius: 2,
      height: '100%',
      border: '1px solid',
      borderColor: '#E8E0D5',
      boxShadow: 'none',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column'
      
    }}>
      {image && (
        <CardMedia
          component="img"
          image={image}
          alt={combo.nombre}
          sx={{ width: '100%', height: 140, objectFit: 'cover', }}
        />
      )}

      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h6" fontWeight={600} color="#5D4037">
            {combo.nombre}
          </Typography>
          <Typography variant="body2" color="#8B7355">
            {combo.descripcion}
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
            ${combo.precio}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 18 }} />}
              onClick={() => onEdit && onEdit(combo)}
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
              onClick={() => onDelete && onDelete(combo)}
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

const CardsCombos = ({ combos = [], onEdit, onDelete }) => {
  return (
    <>
     
      <Grid container spacing={2} size={{xs:12, md:6, lg:4}} >
        {combos.map(c => (
          <Grid size={{xs:12, md:6, lg:4}} key={c.id_combo || c.id}>
            <ComboCard combo={c} onEdit={(combo) => typeof onEdit === 'function' && onEdit(combo)} onDelete={(combo) => typeof onDelete === 'function' && onDelete(combo)} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CardsCombos;
