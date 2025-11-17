// components/CardEstadisticas.jsx
import { Grid, Paper, Typography, Box } from '@mui/material';

const CardEstadisticas = ({ cardsData }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardsData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {card.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {card.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardEstadisticas;