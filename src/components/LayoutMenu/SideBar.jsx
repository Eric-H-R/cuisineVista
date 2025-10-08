import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,IconButton , Box, Typography, Avatar, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TableBarIcon from '@mui/icons-material/TableBar';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
//import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 260;

const Sidebar = () => {

  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: "/" },
    { text: 'Ordenes', icon: <ReceiptIcon />, path: "/ordenes"},
    { text: 'Mesas', icon: <TableBarIcon />, path: "/mesas" },
    { text: 'Menú', icon: <RestaurantMenuIcon />, path: "/menu"},
    { text: 'Inventario', icon: <InventoryIcon />, path: "/inventario" },
    { text: 'Reservas', icon: <CalendarMonthIcon />, path: "/reservas" },
    { text: 'Pagos', icon: <PaymentIcon />, path: "/pagos" },
    { text: 'Sucursales', icon: <StoreIcon />, path: "/sucursales"},
    { text: 'Usuarios', icon: <PeopleIcon />, path: "/usuarios" },
    { text: 'Configuración', icon: <SettingsIcon />, path: "/configuracion" },
  ];

  return (
    <Drawer
     variant="permanent"
    sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#588157',
        color: 'white',
        borderRight: 'none',
        height: '100vh',
        overflowX: 'hidden',
        },
    }}
    >
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Cuisine</Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
             <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  color: "#fff",
                  backgroundColor: location.pathname === item.path ? "rgba(255,255,255,0.1)" : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      

        <Box sx={{  bottom: 0, width: '100%', mt:10 }}>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 1 }} />
           <List sx={{ width: '100%', maxWidth: 360 }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Avatar sx={{ mx: 'auto', bgcolor: '#4caf50' }}>A</Avatar>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Admin" secondary="Administrador" />
              <IconButton aria-label="LogOut" sx={{color:'white', p:2}}>
                    <LogoutIcon />
              </IconButton >
            </ListItem>
          </List>
        </Box>
    </Drawer>
  );
}

export default Sidebar;