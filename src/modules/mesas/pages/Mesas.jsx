import { Container, Typography, Box, Card } from "@mui/material";
import IndicadoresMesas from "../components/IndicadoresMesas";
import FormsMesas from "../components/FormsMesas";
import CardMesas from "../components/CardMesas";


const Mesas = () =>{
    return (
      <Container maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Mesas
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administración de mesas del restaurante por áreas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormsMesas />
          </Box>
        </Box>
        <IndicadoresMesas />
        <CardMesas />
    </Container>
  );
}

export default Mesas;