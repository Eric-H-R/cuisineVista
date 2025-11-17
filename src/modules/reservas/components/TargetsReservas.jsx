import { Grid, Typography, Card, CardContent } from '@mui/material';
import PropTypes from 'prop-types';

const CardReservas = ({ reservasData }) => {
     return (

    <Grid container item  spacing={2} sx={{ mb: 4 }}>
      {reservasData.map((card, index) => {
        const numberColors = ['#2E7D32', '#1976D2', '#7B1FA2', '#D32F2F'];
        return (
          <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Card sx={{ borderRadius: 4 }}>
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
        </Grid>
        );
      })}

    </Grid>
  );
};

CardReservas.propTypes = {
  reservasData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired
    })
  ).isRequired
};

export default CardReservas;