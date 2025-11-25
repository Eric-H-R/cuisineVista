import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const Indicador = ({ title, value, color }) => (
  <Card sx={{ mb: 1, backgroundColor: color || 'white' }} elevation={1}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </CardContent>
  </Card>
);

const IndicadoresComponent = ({ combos = [] }) => {
  const total = combos.length;
  const activos = combos.filter(c => c.es_activo).length;
  const inactivos = total - activos;

  return (
    <Box>
      <Indicador title="Total de combos" value={total} color="#E3F2FD" />
      <Indicador title="Combos activos" value={activos} color="#E8F5E9" />
      <Indicador title="Combos inactivos" value={inactivos} color="#FFEBEE" />
    </Box>
  );
};

export default IndicadoresComponent;
