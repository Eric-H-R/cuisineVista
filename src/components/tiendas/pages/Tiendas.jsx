import { Card, CardContent, Grid, Typography, CardActionArea } from "@mui/material";
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import moduleRouteMap from "../../../config/routes.config";
import { useEffect } from "react";
function Tiendas() {
  return <ImagenTienda />;
}

function ImagenTienda() {
  const { user, seleccionarSucursal } = useAuth();
  const navigate = useNavigate();

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

 
  return (
    <Grid
      container
      sx={{ minHeight: "100vh", p: 3, backgroundColor: "#f6fcf6" }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid size={{xs:12}}  sx={{ display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 1200,
            p: 3,
            boxShadow: "none",
            backgroundColor: "#f6fcf6",
          }}
        >
          <CardContent sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Selecciona una Sucursal
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Elige la sucursal con la que deseas trabajar.
            </Typography>
          </CardContent>

          <Grid container spacing={6} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
            {sucursalesDisponibles.map((sucursal) => (
              <Grid item key={sucursal.id_sucursal}>
                <Card
                  sx={{
                    width: 320,
                    height: 240,
                    borderRadius: 2,
                    overflow: "visible",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                  elevation={0}
                >
                  <CardActionArea
                    onClick={() => handleHome(sucursal.id_sucursal)}
                    sx={{
                      width: "100%",
                      height: "100%",
                      transition: "transform 0.35s ease, box-shadow 0.35s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 18px 20px rgba(0,0,0,0.18)",
                      },
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <CardContent
                      sx={{
                        flex: 1,
                        border: "solid 1px",
                        borderColor: "divider",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                          fontWeight: 600,
                        }}
                      >
                        <StoreMallDirectoryIcon color="primary" sx={{ fontSize: 35 }} />
                        {sucursal.nombre}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Dirección: {sucursal.direccion}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Tiendas;
