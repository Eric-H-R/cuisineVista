import PropTypes from "prop-types";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import TableBarIcon from "@mui/icons-material/TableBar";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { Link, useLocation, useNavigate } from "react-router-dom";


const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Ordenes", icon: <ReceiptIcon />, path: "/ordenes" },
    { text: "Mesas", icon: <TableBarIcon />, path: "/mesas" },
    { text: "Menú", icon: <RestaurantMenuIcon />, path: "/menu" },
    { text: "Inventario", icon: <InventoryIcon />, path: "/inventario" },
    { text: "Reservas", icon: <CalendarMonthIcon />, path: "/reservas" },
    { text: "Pagos", icon: <PaymentIcon />, path: "/pagos" },
    { text: "Sucursales", icon: <StoreIcon />, path: "/sucursales" },
    { text: "Usuarios", icon: <PeopleIcon />, path: "/usuarios" },
    { text: "Configuración", icon: <SettingsIcon />, path: "/configuracion" },
    { text: "Horarios", icon: <WorkHistoryIcon/>, path: "/horarios"}
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ textAlign: "center", py: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Cuisine
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                color: "#fff",
                backgroundColor:
                  location.pathname === item.path
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
              onClick={handleDrawerToggle} // Cierra el drawer en móviles
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 1 }} />
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "#4caf50" }}>A</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Admin" secondary="Administrador" />
            <IconButton
              aria-label="LogOut"
              sx={{ color: "white" }}
              onClick={handleLogout}
            >
              <LogoutIcon />
            </IconButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
     <Drawer
  variant="temporary"
  open={mobileOpen}
  onClose={handleDrawerToggle}
  ModalProps={{ keepMounted: true }}
  sx={{
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': {
      width: 260,
      backgroundColor: '#588157',
      color: 'white',
    },
  }}
>
  {drawerContent}
</Drawer>

<Drawer
  variant="permanent"
  sx={{
    display: { xs: 'none', sm: 'block' },
    '& .MuiDrawer-paper': {
      width: 260,
      backgroundColor: '#588157',
      color: 'white',
      borderRight: 'none',
    },
  }}
  open
>
  {drawerContent}
</Drawer>

    </>
  );
};

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Sidebar;