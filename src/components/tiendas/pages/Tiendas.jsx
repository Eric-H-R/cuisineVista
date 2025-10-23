 import { Card, CardContent,Grid,Typography, CardActionArea} from "@mui/material";
 import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
 import { useNavigate } from "react-router-dom";

 function Tiendas(){
    return (
        <>
        <ImagenTienda />
        </>
    );
}


 
    function ImagenTienda(){   
        const tiendas = [
            { id: 1, name: 'Tienda A', desc: 'Productos gourmet y utensilios de cocina.', contact: 'tiendaA@example.com', hours: 'Lun-Vie 9:00 - 18:00' },
            { id: 2, name: 'Tienda B', desc: 'Ingredientes frescos y orgánicos.', contact: 'tiendaB@example.com', hours: 'Lun-Sab 8:00 - 20:00' },
            { id: 3, name: 'Tienda C', desc: 'Electrodomésticos y accesorios.', contact: 'tiendaC@example.com', hours: 'Mar-Dom 10:00 - 19:00' },
            { id: 4, name: 'Tienda D', desc: 'Utensilios profesionales para chefs.', contact: 'tiendaD@example.com', hours: 'Lun-Vie 9:30 - 17:30' },
            { id: 5, name: 'Tienda E', desc: 'Ingredientes de alta calidad para repostería.', contact: 'tiendaE@example.com', hours: 'Lun-Sab 8:00 - 20:00' },
            { id: 6, name: 'Tienda F', desc: 'Accesorios y gadgets de cocina innovadores.', contact: 'tiendaF@example.com', hours: 'Mar-Dom 10:00 - 19:00' }
        ];

        const navigate = useNavigate();
        
          const handleHome = () => {
            //Solo sirve para redirigir por el momento no se hizo validaciones o rutas protegidas amigo
            navigate("/dashboard");
          };

        return (
            <>
                <Grid
                    container
                    sx={{ minHeight: '100vh', p: 3, backgroundColor:'#f6fcf6' }}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , }}>
                        <Card sx={{ width: '100%', maxWidth: 1200, p: 3, boxShadow: 'none' , backgroundColor:'#f6fcf6'}}>
                            <CardContent sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                                    Bienvenido a la sección de Tiendas
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                    Aquí puedes encontrar todas las tiendas disponibles. Selecciona una para ver más detalles.
                                </Typography>
                            </CardContent>

                            <Grid
                                container
                                spacing={6}
                                justifyContent="center"
                                alignItems="center"
                                sx={{ mt: 2 }}
                            >
                                {tiendas.map((t, index) => {
                                    const directions = [
                                        { x: -12, y: -12 }, // arriba-izquierda
                                    ];
                                    const dir = directions[index % directions.length];

                                    return (
                                        <Grid item key={t.id}>
                                            <Card
                                                sx={{
                                                    width: 320,
                                                    height: 240,
                                                    borderRadius: 2,
                                                    overflow: 'visible',
                                                    display: 'flex',
                                                    alignItems: 'stretch',
                                                }}
                                                elevation={0}
                                            >
                                                <CardActionArea
                                                    onClick={handleHome}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                                                        '&:hover': {
                                                            transform: `translate(${dir.x}px, ${dir.y}px) scale(1.06)`,
                                                            boxShadow: '0 18px 20px rgba(0,0,0,0.18)',
                                                        },
                                                        display: 'flex',
                                                        alignItems: 'stretch',
                                                    }}
                                                >
                                                    <CardContent sx={{ flex: 1, border: 'solid 1px', borderColor: 'divider', borderRadius: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Typography
                                                            variant="h5"
                                                            component="div"
                                                            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 600 }}
                                                        >
                                                            <StoreMallDirectoryIcon color="primary" sx={{ fontSize: 35 }} />
                                                            {t.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {t.desc}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            Contacto: {t.contact}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Horario: {t.hours}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </>
        );
    }


export default Tiendas;