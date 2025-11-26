import React, { useEffect, useState, useRef } from 'react';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    Button, 
    Stack, 
    Chip,
    Grid,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import { CocinaService } from '../services/CocinaService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useAuth } from '../../../context/AuthContext';

const FIVE_MINUTES = 5 * 60 * 1000;

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
};

const formatTimeInKitchen = (timeStr) => {
    if (!timeStr) return '—';
    return timeStr;
};

const Cocina = () => {
    const apiRef = useRef({ items: [] });
    const [version, setVersion] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [processingItem, setProcessingItem] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const timerRef = useRef(null);
    const { sucursal } = useAuth();

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const fetchPendientes = async () => {
        setLoading(true);
        try {
            // Resolver sucursalId: `sucursal` en AuthContext puede ser un string/number (localStorage)
            // o un objeto { id: ... }. Normalizamos a un número o null.
            const resolveSucursalId = () => {
                if (!sucursal) return null;
                if (typeof sucursal === 'object') return sucursal.id ?? sucursal.sucursalId ?? null;
                const n = Number(sucursal);
                return Number.isNaN(n) ? null : n;
            };

            const sucursalId = resolveSucursalId();

            if (!sucursalId) {
                // Evitar enviar petición que cause 403 si no hay sucursal seleccionada
                console.warn('No hay sucursal seleccionada. Selecciona una sucursal antes de actualizar.');
                showSnackbar('Selecciona una sucursal antes de actualizar', 'warning');
                apiRef.current = { items: [] };
                setVersion((v) => v + 1);
                setLoading(false);
                return;
            }

            const res = await CocinaService.postPendientes({ sucursal_id: sucursalId });
            // envio de sucursalId para obtener los pedidos
            console.log('Enviando sucursal_id:', sucursalId);
            console.log('Respuesta de pedidos pendientes:', res);
            
            const apiItems = res?.data ?? { items: [] };
            apiRef.current = apiItems;
            setVersion((v) => v + 1);
            setLastUpdated(new Date());
            
            if (apiItems.items?.length > 0) {
                console.log(`Cargados ${apiItems.items.length} pedidos pendientes`);
            }
        } catch (err) {
            console.error('Error al obtener pedidos pendientes:', err);
            apiRef.current = { items: [] };
            setVersion((v) => v + 1);
            showSnackbar('Error al cargar pedidos pendientes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const marcarListo = async (pedido) => {
        const id_pedido_item = pedido?.id_pedido_item;
        if (!id_pedido_item) {
            showSnackbar('No se encontró el ID del pedido', 'error');
            return;
        }

        setProcessingItem(id_pedido_item);
        try {
            await CocinaService.itemListo(id_pedido_item);
            
            // Remover el item marcado como listo del estado local
            const currentItems = Array.isArray(apiRef.current?.items) ? apiRef.current.items : [];
            apiRef.current.items = currentItems.filter((item) => item.id_pedido_item !== id_pedido_item);
            
            setVersion((v) => v + 1);
            showSnackbar(`¡${pedido.producto_nombre} marcado como listo!`);
            
        } catch (err) {
            console.error('Error al marcar como listo:', err);
            showSnackbar('Error al marcar como listo', 'error');
        } finally {
            setProcessingItem(null);
        }
    };

    const handleCardClick = (pedido) => {
        marcarListo(pedido);
    };

    const getStatusColor = (estatus) => {
        return estatus === 1 ? 'warning' : 'success';
    };

    const getStatusText = (estatus) => {
        return estatus === 1 ? 'En preparación' : 'Listo';
    };

    useEffect(() => {
        fetchPendientes();
        timerRef.current = setInterval(() => {
            fetchPendientes();
        }, FIVE_MINUTES);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const items = Array.isArray(apiRef.current?.items) ? apiRef.current.items : [];
    const totalPedidos = apiRef.current?.total || items.length;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4
            }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        <RestaurantIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
                        Gestión de Cocina
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Control y seguimiento de pedidos en proceso
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Chip 
                        icon={<AccessTimeIcon />}
                        label={`${totalPedidos} pendientes`}
                        color="primary"
                        variant="outlined"
                    />
                    <Button 
                        variant="contained" 
                        onClick={fetchPendientes} 
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                        {lastUpdated ? `Última: ${formatDate(lastUpdated)}` : 'Sin actualizar'}
                    </Typography>
                </Stack>
            </Box>

            {/* Grid de Pedidos */}
            <Grid container spacing={3}>
                {items.length === 0 ? (
                    <Grid item xs={12}>
                        <Alert severity="info" sx={{ mt: 2 }}>
                            No hay pedidos pendientes en cocina
                        </Alert>
                    </Grid>
                ) : (
                    items.map((pedido) => (
                        <Grid item xs={12} sm={6} md={4} key={pedido.id_pedido_item}>
                            <Card 
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: 1,
                                    borderColor: 'divider',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 4,
                                        borderColor: 'primary.main'
                                    }
                                }}
                                onClick={() => handleCardClick(pedido)}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Header */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'flex-start',
                                        mb: 2 
                                    }}>
                                        <Typography 
                                            variant="h6" 
                                            component="h3"
                                            fontWeight="medium"
                                            sx={{ flex: 1 }}
                                        >
                                            {pedido.producto_nombre}
                                        </Typography>
                                        <Chip 
                                            icon={pedido.estatus_detalle === 2 ? <CheckCircleIcon /> : <AccessTimeIcon />}
                                            label={getStatusText(pedido.estatus_detalle)}
                                            color={getStatusColor(pedido.estatus_detalle)}
                                            size="small"
                                        />
                                    </Box>

                                    {/* Información del pedido */}
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Cantidad:
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {pedido.cantidad}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Mesa:
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                #{pedido.mesa_id}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Tiempo en cocina:
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium" color="primary.main">
                                                {formatTimeInKitchen(pedido.tiempo_en_cocina)}
                                            </Typography>
                                        </Box>

                                        {pedido.notas && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Notas:
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                    "{pedido.notas}"
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Folio: {pedido.folio_pedido}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(pedido.created_at)}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Botón de acción */}
                                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            fullWidth
                                            startIcon={<CheckCircleIcon />}
                                            disabled={processingItem === pedido.id_pedido_item}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                marcarListo(pedido);
                                            }}
                                        >
                                            {processingItem === pedido.id_pedido_item ? (
                                                <>Procesando...</>
                                            ) : (
                                                <>Marcar como Listo</>
                                            )}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    severity={snackbar.severity} 
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Cocina;