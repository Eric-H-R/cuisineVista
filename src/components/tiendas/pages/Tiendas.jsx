import { 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  CardActionArea,
  Box,
  Fade
} from "@mui/material";
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import moduleRouteMap from "../../../config/routes.config";
import { useEffect, useState } from "react";
import BlurText from "../components/BlurText";


function Tiendas() {
  return <ImagenTienda />;
}

function ImagenTienda() {
  const { user, seleccionarSucursal } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Efecto para manejar la transición del modal de bienvenida
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      // Pequeño delay antes de mostrar el contenido principal
      setTimeout(() => setShowContent(true), 300);
    }, 2000); // Tiempo suficiente para que termine la animación del BlurText

    return () => clearTimeout(timer);
  }, []);

  // Si no es administrador, redirige al primer módulo automáticamente
  useEffect(() => {
    if (user.roles[0].nombre !== "Administrador") {
      seleccionarSucursal(user.sucursales[0].id_sucursal);
      const firstModulo = user.modulos[0];
      const route = firstModulo ? moduleRouteMap[firstModulo.clave] : "/dashboard";
      navigate(route);
    }
  }, [user, seleccionarSucursal, navigate]);

  // Para administradores, mostramos la selección de sucursales
  const sucursalesDisponibles = user.sucursales;

  const handleHome = (idSucursal) => {
    seleccionarSucursal(idSucursal);
    const firstModulo = user.modulos[0];
    const route = firstModulo ? moduleRouteMap[firstModulo.clave] : "/dashboard";
    navigate(route);
  };

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fef9f3",
        backgroundImage: `
          radial-gradient(#d4a574 1px, transparent 1px),
          radial-gradient(#d4a574 1px, #fef9f3 1px)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(45deg, rgba(212, 165, 116, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%)",
          pointerEvents: "none"
        }
      }}
    >
      {/* Modal de bienvenida */}
      {showWelcome && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#fef9f3",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            animation: "fadeIn 0.5s ease-in"
          }}
        >
          <BlurText
            text="Bienvenido a Cuisine Management"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="TitleBlur"
          />
        </Box>
      )}

      {/* Contenido principal */}
      <Fade in={showContent} timeout={800}>
        <Box>
          
            <Grid
              container
              sx={{ 
                minHeight: "100vh", 
                p: 3, 
                position: "relative",
                zIndex: 1 
              }}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 1200,
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    border: "none"
                  }}
                >
                  {/* Título principal */}
                  <CardContent sx={{ textAlign: "center", mb: 4, mt: 2 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        fontFamily: "'Playfair Display', serif",
                        color: "#582c0cff",
                        mb: 2,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
                      }}
                    >
                      Nuestras Sucursales
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: "#5D4037",
                        fontFamily: "'Italianno', cursive",
                        fontSize: "3rem",
                        mb: 1
                      }}
                    >
                      La vera cuisine francesa
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: "#795548",
                        fontStyle: "italic",
                        maxWidth: 600,
                        mx: "auto",
                        fontSize: "1.1rem"
                      }}
                    >
                      Selecciona la sucursal donde deseas administrar el sistema.
                    </Typography>
                  </CardContent>

                  {/* Grid de sucursales */}
                 
                  <Grid 
                    container 
                    spacing={4} 
                    justifyContent="center" 
                    alignItems="center" 
                    sx={{ mt: 2 }}
                  >
                    {sucursalesDisponibles.map((sucursal) => (
                      <Grid item key={sucursal.id_sucursal}>
                        <Card
                          sx={{
                            width: 340,
                            height: 260,
                            borderRadius: 3,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "stretch",
                            background: "linear-gradient(135deg, #fff 0%, #f8f4e9 100%)",
                            border: "2px solid #d4a574",
                            position: "relative",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "4px",
                              background: "linear-gradient(90deg, #8B4513, #d4a574, #8B4513)",
                            }
                          }}
                          elevation={0}
                        >
                       
                          <CardActionArea
                            onClick={() => handleHome(sucursal.id_sucursal)}
                            sx={{
                              width: "100%",
                              height: "100%",
                              transition: "all 0.4s ease",
                              "&:hover": {
                                transform: "translateY(-8px) scale(1.02)",
                                boxShadow: "0 20px 40px rgba(139, 69, 19, 0.3)",
                                "& .store-icon": {
                                  transform: "scale(1.2)",
                                  color: "#8B4513"
                                }
                              },
                              display: "flex",
                              alignItems: "stretch",
                            }}
                          >
                            <CardContent
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                p: 3,
                                background: "linear-gradient(to bottom, transparent, rgba(212, 165, 116, 0.1))"
                              }}
                            >
                              <StoreMallDirectoryIcon 
                                className="store-icon"
                                sx={{ 
                                  fontSize: 48, 
                                  color: "#d4a574",
                                  mb: 2,
                                  transition: "all 0.3s ease"
                                }} 
                              />
                              
                              <Typography
                                variant="h5"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  mb: 2,
                                  fontWeight: 600,
                                  fontFamily: "'Playfair Display', serif",
                                  color: "#5D4037",
                                  textAlign: "center"
                                }}
                              >
                                {sucursal.nombre}
                              </Typography>

                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: "#795548",
                                  textAlign: "center",
                                  fontStyle: "italic",
                                  lineHeight: 1.4
                                }}
                              >
                                {sucursal.direccion}
                              </Typography>

                              {/* Elemento decorativo */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 16,
                                  right: 16,
                                  color: "#d4a574",
                                  fontSize: "1.5rem",
                                  opacity: 0.7
                                }}
                              >
                                🍝
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                      
                  {/* Pie de página decorativo */}
                  <CardContent sx={{ textAlign: "center", mt: 6 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#795548",
                        fontFamily: "'Italianno', cursive",
                        fontSize: "1.8rem",
                        opacity: 0.8
                      }}
                    >
                      Buon appetito!
                    </Typography>
                  </CardContent>
                </Card>
               
              </Grid>
            </Grid>
      
        </Box>
      </Fade>

      {/* Estilos globales */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Italianno&display=swap');
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}

export default Tiendas;