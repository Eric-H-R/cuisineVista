import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';


function CardProveedores ({ proveedor }) {
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {proveedor.id_proveedor}
          {proveedor.nombre}
        </Typography>
    
      </CardContent>
    </Card>
  );
}

export default CardProveedores;