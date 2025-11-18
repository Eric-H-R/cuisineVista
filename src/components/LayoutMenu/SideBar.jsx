import PropTypes from "prop-types";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import { Link, useLocation, useNavigate } from "react-router-dom";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

import ICONS from "../../config/icons.config";
import moduleRouteMap from "../../config/routes.config";
import { useAuth } from "../../context/AuthContext";

import { useState } from "react";

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const nameUser = user ? user.nombre : "Usuario";
  const roleUser = user ? user.roles[0].nombre : "Rol";
  const modulesWithRoutes = user.modulos.map((mod) => ({
    ...mod,
    route: moduleRouteMap[mod.clave] || "#",
    Icon: ICONS[mod.clave] || ICONS.DASHBOARD,
  }));

  const drawerWidth = collapsed ? 80 : 260;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        px: collapsed ? 1 : 2,
        transition: "all 0.3s ease",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          py: 3,
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
            Cuisine
          </Typography>
        )}

      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />

      {/* LISTA DE MODULOS */}
      <Box 
       sx={{
            flexGrow: 1,
            overflowY: "auto",
            mt: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}>
        <List>
          {modulesWithRoutes.map((mod) => {
            const IconComponent = mod.Icon;
            const isActive = location.pathname === mod.route;

            return (
              <Tooltip key={mod.nombre} title={collapsed ? mod.nombre : ""} placement="right">
                <ListItem disablePadding sx={{ width: "100%" }}>
                  <ListItemButton
                    component={Link}
                    to={mod.route}
                    sx={{
                      color: "white",
                      borderRadius: 2,
                      mb: 0.5,
                      px: collapsed ? 1.5 : 2,
                      justifyContent: collapsed ? "center" : "flex-start",
                      transition: "all 0.3s ease",
                      backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.3)",
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#FFD700" : "white",
                        minWidth: collapsed ? "auto" : 40,
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        mr: collapsed ? 0 : 2,
                      }}
                    >
                      <IconComponent />
                    </ListItemIcon>

                    {!collapsed && (
                      <ListItemText
                        primary={mod.nombre}
                        sx={{ opacity: collapsed ? 0 : 1, transition: "opacity 0.3s" }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* FOOTER */}
      <Box sx={{ flexShrink: 0 }}>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
        <List>
          <ListItem>
            {!collapsed && (
              <>
                <Avatar sx={{ bgcolor: "white", color: "#588157", mr: 1 }}>{nameUser.charAt(0)}</Avatar>
                <ListItemText primary={nameUser} secondary={roleUser} sx={{ color: "white" }} />
              </>
            )}

            <IconButton sx={{ color: "white" }} onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#588157",
            color: "white",
            transition: "width 0.3s ease",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#588157",
            color: "white",
            borderRight: "none",
            transition: "width 0.3s ease",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
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
