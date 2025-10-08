import { AppBar, Toolbar, Typography, IconButton, Badge, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 250px)`,
        ml: '250px',
        backgroundColor: '#fff',
        color: '#333',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Sucursal Principal • lunes, 6 de octubre de 2025
          </Typography>
        </Box>

        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
