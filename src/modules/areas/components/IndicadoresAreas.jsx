
import { Box, Card, Typography, CardContent,Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import AreasServices from "../services/AreasServices";
import colores from '../../../theme/colores';



const IndicadoresAreas = () => {
 const { sucursal } = useAuth();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (!sucursal) {
          setAreas([]);
          return;
        }
        
        const areasResponse = await AreasServices.getBySucursal(sucursal);
        console.log("Respuesta de áreas:", areasResponse);
        
        const areasData = areasResponse.data?.data || [];
        setAreas(areasData);
        
        // Calcular estadísticas
        const areasActivas = areasData.filter(area => area.es_activa === true).length;
        console.log("Total de áreas activas:", areasActivas);
        
      } catch (error) {
        console.error("Error cargando áreas:", error);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [sucursal]);

  // Calcular las estadísticas basadas en el estado 'areas'
  const areasActivas = areas.filter(area => area.es_activa === true).length;
  const areasInactivas = areas.filter(area => area.es_activa === false).length;

  const AreasCardData = [
    { 
      title: 'Total de Áreas', 
      value: areas.length 
    },
    { 
      title: 'Áreas activas', 
      value: areasActivas 
    },
    { 
      title: 'Áreas inactivas', 
      value: areasInactivas 
    },
  ];

  const numberColors = [colores.accent.main, colores.accent.main, colores.accent.main];
    return (

    <Box mt={4} sx={{ display: 'flex', gap: 2, justifyContent: 'space-around', width: '100%' }}>
        {AreasCardData.map((card, index) => (
            <Card key={index}
             elevation={0} 
            sx={{ borderRadius: 4, width: '35%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',  background: 'linear-gradient(to bottom, #ce8c4e10 0%, #ede0d436 100%)'}}
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

export default IndicadoresAreas;