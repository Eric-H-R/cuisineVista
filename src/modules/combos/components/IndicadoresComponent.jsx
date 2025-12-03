import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import colores from '../../../theme/colores'; // Asegúrate de importar tus colores

const IndicadoresComponent = ({ combos = [] }) => {
  const total = combos.length;
  const activos = combos.filter(c => c.es_activo).length;
  const inactivos = total - activos;

  const CombosCardData = [
    { 
      title: 'Total de Combos', 
      value: total 
    },
    { 
      title: 'Combos activos', 
      value: activos 
    },
    { 
      title: 'Combos inactivos', 
      value: inactivos 
    },
  ];

  const numberColors = [colores.accent.main, colores.accent.main, colores.accent.main];

  return (
    <Box mt={4} sx={{ display: 'flex', gap: 2, justifyContent: 'space-around', width: '100%', mb:5 }}>
      {CombosCardData.map((card, index) => (
        <Card 
          key={index}
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            width: '35%', 
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',  
            background: 'linear-gradient(to bottom, #ce8c4e10 0%, #ede0d436 100%)'
          }}
        >
          <CardContent sx={{ height: '100%', textAlign: 'center' }}>
            <Typography variant="h4" component="div" sx={{ color: numberColors[index] }}>
              {card.value}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {card.title}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default IndicadoresComponent;