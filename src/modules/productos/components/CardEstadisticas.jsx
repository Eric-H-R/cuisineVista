//import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import colores from '../../../theme/colores';

const CardEstadisticas = ({ cardsData }) => {
  return (
    <Box mt={4} sx={{ display: 'flex', gap: 2, justifyContent: 'space-around', width: '100%' }}>
      {cardsData.map((card, index) => {
        const numberColors = [colores.primary.dark, colores.primary.dark, colores.primary.dark];
        
        return (
          <Card key={index}
             elevation={0} 
            sx={{mb:4, borderRadius: 4, width: '35%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',  background: 'linear-gradient(to bottom, #ce8c4e10 0%, #ede0d436 100%)'}}
            >
            <CardContent sx={{ height: '100%', textAlign: 'center'}}>
              <Typography 
                variant="h5" 
                component="div"
                sx={{ color: numberColors[index] }}
              >
                {card.value}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

CardEstadisticas.propTypes = {
  cardsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired
    })
  ).isRequired
};

export default CardEstadisticas;