import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Topbar = ({ handleDrawerToggle }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
            Sucursal Principal • {fecha.charAt(0).toUpperCase() + fecha.slice(1)}
          </Typography>
        )}
        </Box>

        {/* Notificaciones */}
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Topbar;
