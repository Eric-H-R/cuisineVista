import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../context/AuthContext";
import sucursalesService from "../../modules/sucursales/services/sucursales.service";
import { useEffect, useState } from "react";
import LoadingComponent from "../Loadings/LoadingComponent";

const Topbar = ({ handleDrawerToggle }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Obtener datos desde el contexto
  const { user, sucursal, seleccionarSucursal } = useAuth(); 
  const userId = user?.id;

  // Obtener sucursales 
  const sucursales = user?.sucursales || [];

  const handleChangeSucursal = (event) => {
    const sucursalId = event.target.value;
    console.log("Sucursal seleccionada:", sucursalId);
    seleccionarSucursal(sucursalId);

    window.location.reload();
  };

  // obtener la sucursal actual 
  const sucursalActual = sucursales.find(
    suc => suc.id_sucursal === parseInt(sucursal)
    
  );

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await sucursalesService.getAll();
        const sucursalesData = Array.isArray(response.data?.data) ? response.data.data : [];
        
        // Establecer sucursal por defecto si no hay una seleccionada
        if (sucursalesData.length > 0 && !sucursal) {
          const primeraSucursal = sucursalesData[0];
          seleccionarSucursal(primeraSucursal.id_sucursal.toString());
        }
      } catch (error) {
        console.error("Error al obtener sucursales:", error); 
      }
    };

    fetchSucursales();
  }, [seleccionarSucursal, sucursal]);



  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 260px)` },
        ml: { sm: `260px` },
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>
        {/* Botón de menú visible solo en móvil */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Información de sucursal y fecha */}
        <Box sx={{ flexGrow: 1 }}>
          {!isMobile && (
            <Typography variant="body2" color="textSecondary">
              {sucursalActual ? sucursalActual.nombre : "Sucursal Principal"} • {fecha.charAt(0).toUpperCase() + fecha.slice(1)}
            </Typography>
          )}
        </Box>

        {/* Select de sucursales solo para ADMIN */}
        {userId === 1 && Array.isArray(sucursales) && sucursales.length > 0 && (
          <Box sx={{ mr: 2 }}>
    <FormControl sx={{ m: 1, minWidth: 120 }} variant="standard" size="small">
      <Select
        value={sucursal || ""}
        onChange={handleChangeSucursal}
        
        displayEmpty
        inputProps={{ 'aria-label': 'Seleccionar sucursal' }}
      >
        <MenuItem value="" disabled>
          <em>Seleccionar sucursal</em>
        </MenuItem>
        {sucursales.map((sucursalItem) => (
          <MenuItem 
            key={sucursalItem.id_sucursal} 
            value={sucursalItem.id_sucursal.toString()}
          >
            {sucursalItem.nombre || `Sucursal ${sucursalItem.id_sucursal}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
        )}

        {/* Icono de notificaciones para otros usuarios */}
        {userId !== 1 && (
          <IconButton color="inherit">
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

Topbar.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Topbar;