import { useState } from "react";
import { useAuth } from "../../../context/AuthContext"
import { useEffect } from "react";
import MesasService from "../services/MesasService";
import { Box, Card, Typography } from "@mui/material";


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

    const numberColors = ['#2E7D32', '#1976D2', '#D32F2F'];
    return (
       <Box sx={{ display: 'flex', gap: 2, mt:4 }}>
        {MesasCardData.map((card, index) => (
          <Card key={index} sx={{ flex: 1, textAlign: 'center', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                {card.title}
            </Typography>
            <Typography variant="h4" style={{ color: numberColors[index] }}>
                {card.value}
            </Typography>
            </Card>
        ))}
      </Box>
    );
}

export default IndicadoresMesas;