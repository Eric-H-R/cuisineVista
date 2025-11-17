import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  Grid
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PropTypes from 'prop-types';


const CardUsuarios = ({ user, onDesactivate, onEdit }) => {
  const handleClick = () => {
    onDesactivate(user.id); 
  };
  const handleEditClick = () => {
    onEdit(user);
  };
  return (
    <Card
  sx={{
    borderRadius: 3,
    height: "100%",
    border: "1px solid #E0E0E0",
    backgroundColor: "#F8F9FA",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: "0.2s ease",
    "&:hover": {
      boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
    },
  }}
>
  <CardContent sx={{ p: 3 }}>

    {/* HEADER */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <Avatar
        sx={{
          width: 54,
          height: 54,
          mr: 2.5,
          bgcolor: "#588157",
          color: "white",
          fontSize: 28,
        }}
      >
        <PersonIcon />
      </Avatar>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" color="#333333">
          {user.name}
        </Typography>
        <Typography variant="body2" color="#57300D">
          {user.email}
        </Typography>
      </Box>

      <Chip
        label={user.status}
        color={user.status === "Activo" ? "success" : "error"}
        size="small"
        sx={{
          fontWeight: "bold",
          px: 1,
          borderRadius: 1,
        }}
      />
    </Box>

    {/* TELÉFONO */}
    <Typography
      variant="body1"
      fontWeight="medium"
      color="#333333"
      sx={{
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
    <PhoneInTalkIcon sx={{ fontSize: 18, color: "#57300D" }} /> {user.phone}
    </Typography>

    <Divider sx={{ my: 2 }} />

    {/* INFO DEL USUARIO */}
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="#57300D" gutterBottom>
          <strong>Último acceso</strong>
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {user.lastAccess}
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" color="#57300D" gutterBottom>
          <strong>Miembro desde</strong>
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {user.memberSince}
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography
          variant="body2"
          color="#57300D"
          fontWeight="bold"
          gutterBottom
        >
          Sucursales
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: 0.5,
          }}
        >
          {user.branches?.length ? (
            user.branches.map((branch, index) => (
              <Chip
                key={index}
                label={branch}
                icon={<LocationOnIcon sx={{ color: "#57300D" }} />}
                sx={{
                  backgroundColor: "#DAD7CD",
                  color: "#333333",
                  borderRadius: 1.5,
                  "& .MuiChip-icon": {
                    fontSize: 18,
                  },
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sin sucursales asignadas
            </Typography>
          )}
        </Box>
      </Grid>

    </Grid>

    <Divider sx={{ my: 2 }} />

    {/* BOTONES */}
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        size="small"
        onClick={handleEditClick}
        sx={{
          color: "#588157",
          borderColor: "#588157",
          "&:hover": {
            backgroundColor: "#588157",
            color: "white",
          },
        }}
      >
        Editar
      </Button>

      <Button
        variant="outlined"
        startIcon={<BlockIcon />}
        size="small"
        color="error"
        onClick={handleClick}
        sx={{
          "&:hover": {
            backgroundColor: "#B22222",
            color: "white",
          },
        }}
      >
        Desactivar
      </Button>
    </Box>

    <Divider sx={{ my: 2 }} />

    {/* ROLES */}
    <Typography variant="body2" fontWeight="bold" color="#333333" gutterBottom>
      Roles asignados:
    </Typography>

    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
      {user.roles.map((role, index) => (
        <Chip
          key={index}
          label={role}
          size="small"
          sx={{
            backgroundColor: "#A3B18A",
            color: "#333333",
            fontWeight: "bold",
          }}
        />
      ))}
    </Box>

  </CardContent>
</Card>

  );
};

CardUsuarios.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    status: PropTypes.string.isRequired,
    lastAccess: PropTypes.string.isRequired,
    memberSince: PropTypes.string,
    branches: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default CardUsuarios;