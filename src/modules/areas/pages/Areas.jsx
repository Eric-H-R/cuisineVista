// Sección de areas del restaurante
import { Container, Typography, Box,  } from "@mui/material";
import CardAreas from "../components/CardAreas";
import IndicadoresAreas from "../components/IndicadoresAreas";
import BasicModal from "../components/FormAddArea";


const Areas = () => {

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gestión de Áreas
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administración de áreas del restaurante
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt:1 }}>
           <BasicModal />
          </Box>
        </Box>
        <IndicadoresAreas />
        <CardAreas />
    </Container>
  );
};

export default Areas;