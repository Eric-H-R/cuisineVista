import { useState } from "react";
import { useAuth } from "../../../context/AuthContext"
import { useEffect } from "react";
import MesasService from "../services/MesasService";
import { Box, Card, Typography, CardContent } from "@mui/material";
import colors from "../../../theme/colores";


const IndicadoresMesas = () => {
    const { sucursal } = useAuth();
    const [areas, setAreas] = useState([]);
    const [mesas , setMesas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                if (!sucursal) {
                    setMesas([]);
                    return;
                }
                const mesasResponse = await MesasService.getByArea(areas.id, sucursal.id);
                const mesasData = mesasResponse.data?.data || [];
                setMesas(mesasData);
            } catch (error) {
                console.error("Error cargando mesas:", error);
                setMesas([]);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }
    , [sucursal, areas]);

    // Calcular las estadísticas basadas en el estado 'mesas'
    const mesasActivas = mesas.filter(mesa => mesa.es_activa === true).length;
    const mesasInactivas = mesas.filter(mesa => mesa.es_activa === false).length;
    const MesasCardData = [
        {
            title: 'Total de Mesas',
            value: mesas.length
        },
        {
            title: 'Mesas activas',
            value: mesasActivas
        },
        {
            title: 'Mesas inactivas',
            value: mesasInactivas
        },
    ];

    const numberColors = [colors.accent.main, colors.accent.main, colors.accent.main];
    return (
       <Box mt={4} sx={{ display: 'flex', gap: 2, justifyContent: 'space-around', width: '100%' }}>
        {MesasCardData.map((card, index) => (
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
}

export default IndicadoresMesas;