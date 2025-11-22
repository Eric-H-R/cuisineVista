//import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';

const StatsCards = ({ cardsData }) => {
  return (
   <Box sx={{ display: 'flex', gap: 2, mt:2, mb:4 }}>
      {cardsData.map((card, index) => {
        // Array de colores diferentes para cada número
        const numberColors = ['#2E7D32', '#1976D2', '#7B1FA2', '#D32F2F'];
        
        return (
          <Card key={index} sx={{ flex: 1, textAlign: 'center', padding: 2, mt:4, borderRadius: 2 }} >
            <CardContent sx={{ height: '100%', textAlign: 'center' }}>
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

StatsCards.propTypes = {
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

export default StatsCards;