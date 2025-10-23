
import { Box, Typography, Card,Grid } from '@mui/material';

const CardPedidos = () => {

    const recentOrders = [
        { id: 1, item: 'P001', quantity: 10, status: 'Entregado', total: '$100', tiempo: '2 días', mesa: 'Mesa 5' },
        { id: 2, item: 'P002', quantity: 5, status: 'En camino', total: '$50', tiempo: '1 día', mesa: 'Mesa 3' },
        { id: 3, item: 'P003', quantity: 8, status: 'Pendiente', total: '$80', tiempo: '3 días', mesa: 'Mesa 1' },
    ];



const ArticulosInventario = [
    { id: 1, item: 'P001',  articulo: 'Pollo', estatus: 'Disponible', peso: '20kg', cantidadMinima: '10kg' },
    { id: 2, item: 'P002', articulo: 'Carne', estatus: 'Agotado', peso: '15kg', cantidadMinima: '5kg' },
    { id: 3, item: 'P003', articulo: 'Pescado', estatus: 'Bajo stock', peso: '10kg', cantidadMinima: '3kg' },
];

  return (
    <>
    {/* Card de Inventario */}
    <Grid container spacing={2} sx={{ mt: 2, mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Grid item size = {{ xs: 12, sm: 6, md: 4, lg: 6 }}>
            <Card sx={{ mb: 2, p:2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Pedidos recientes
                </Typography>
                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                    {recentOrders.map((order) => (
                        <Box key={order.id} sx={{ mb: 2, border: '0.5px solid #c0bfbfff', p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">
                                {order.item} <br />
                                {order.mesa}
                            </Typography>
                             <Typography variant="body1">
                                 {order.quantity} <br />
                                    Cantidad
                            </Typography>
                            <Typography variant="body1" 
                            bgcolor={order.status === 'Entregado' ? '#b7e39eff' : order.status === 'En camino' ? '#ffe347' : '#d7877fff'}
                            color={order.status === 'Entregado' ? '#283e30' : order.status === 'En camino' ? '#e53905ff' : '#3a0505ff'}
                            sx={{ px: 1.5, borderRadius: 1, boxShadow: 1 }}
                            >
                                {order.status} 
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {order.total} <br />
                                Total
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {order.tiempo}
                                <br />
                                Tiempo
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Card>
        </Grid>

        {/* Card de Estatus Inventario */}
        
        <Grid item size = {{ xs: 12, sm: 6, md: 4, lg: 6 }}>
            <Card sx={{ mb: 2, p:2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Estatus inventario
                </Typography>
                <Box
                    sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}
                >
                    {ArticulosInventario.map((articulo) => (

                        <Box key={articulo.id} sx={{ mb: 2, border: '0.5px solid #c0bfbfff', p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">
                                {articulo.articulo} <br />
                                Articulo
                            </Typography>
                            <Typography variant="body1">
                                {articulo.cantidadMinima} <br />
                                Cantidad minima
                            </Typography>
                            <Typography variant="body1">
                                {articulo.peso}
                                <br />
                                Total
                            </Typography>
                            <Typography variant="body1" bgcolor={articulo.estatus === 'Disponible' ? 'green' : articulo.estatus === 'Bajo stock' ? 'orange' : '#780000'}
                            color="white" sx={{ px: 1.5, borderRadius: 1, boxShadow: 1 }}
                            >
                                {articulo.estatus}
                            </Typography>
                           
                        </Box>
                    ))}
                </Box>
            </Card>
        </Grid>
    </Grid>
    
    </>
    
  );
};

export default CardPedidos;