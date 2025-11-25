import React from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Chip, Button } from '@mui/material';


const menuTypes = [
  { key: 'premium', label: 'Combos premium' },
  { key: 'familia', label: 'Combos familiares' },
  { key: 'economicos', label: 'Combos económicos' }
];

const ComboCard = ({ combo, onEdit, onDelete }) => (
  <Card sx={{ display: 'flex', height: 140 }}>
    {combo.imagen_url && (
      <CardMedia component="img" sx={{ width: 160 }} image={combo.imagen_url.startsWith('http') || combo.imagen_url.startsWith('data:') ? combo.imagen_url : `data:image/png;base64,${combo.imagen_url}`} alt={combo.nombre} />
    )}
    <CardContent sx={{ flex: 1 }}>
      <Typography variant="h6">{combo.nombre}</Typography>
      <Typography variant="body2" color="text.secondary">{combo.descripcion}</Typography>
      <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>${combo.precio}</Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button size="small" variant="outlined" onClick={() => onEdit && onEdit(combo)}>Editar</Button>
        <Button size="small" variant="contained" color="error" onClick={() => onDelete && onDelete(combo)}>Eliminar</Button>
      </Box>
    </CardContent>
  </Card>
);

const CardsCombos = ({ combos = [], onEdit, onDelete }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {menuTypes.map(mt => <Chip key={mt.key} label={mt.label} color="primary" />)}
      </Box>

      <Grid container spacing={2}>
        {combos.map(c => (
          <Grid item xs={12} md={6} key={c.id_combo || c.id}>
            <ComboCard combo={c} onEdit={(combo) => typeof onEdit === 'function' && onEdit(combo)} onDelete={(combo) => typeof onDelete === 'function' && onDelete(combo)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsCombos;
