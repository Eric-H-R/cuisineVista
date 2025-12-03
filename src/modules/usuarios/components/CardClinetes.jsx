//import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Divider,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';

const CardClientes = ({ client }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        border: "1px solid #E4E4E7",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        transition: "0.3s",
        "&:hover": {
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)"
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#588157",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.16)"
              }}
            >
              <PersonIcon fontSize="medium" />
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                component="h3"
                fontWeight="bold"
                sx={{ color: "#1F2937" }}
              >
                {client.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                ID Cliente: {client.id ?? "—"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Información de contacto */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 2,
            flexWrap: "wrap"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmailIcon sx={{ fontSize: 18, color: "#57300D" }} />
            <Typography variant="body2" sx={{ color: "#374151" }}>
              {client.email}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon sx={{ fontSize: 18, color: "#57300D" }} />
            <Typography variant="body2" sx={{ color: "#374151" }}>
              {client.phone}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Información adicional */}
        <Box>
          <Typography variant="body2" sx={{ color: "#374151" }}>
            <strong style={{ color: "#111827" }}>Cliente desde:</strong>{" "}
            {client.memberSince}
          </Typography>
        </Box>
      </CardContent>
    </Card>

  );
};

CardClientes.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    memberSince: PropTypes.string.isRequired
  }).isRequired
};

export default CardClientes;