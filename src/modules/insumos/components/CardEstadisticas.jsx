//import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid
} from '@mui/material';
import PropTypes from 'prop-types';

const CardEstadisticas = ({ cardsData }) => {
  return (
    
     <Grid container item  spacing={2} sx={{ mb: 4 }}>
      {cardsData.map((card, index) => {
        const numberColors = ['#2E7D32', '#1976D2', '#7B1FA2', '#D32F2F'];
        
        return (
          <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
             <Card  sx={{ borderRadius: 2 }}>
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
          </Grid>
         
        );
      })}
    </Grid>
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