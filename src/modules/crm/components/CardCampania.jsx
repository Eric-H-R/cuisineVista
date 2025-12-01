import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  People as PeopleIcon,
  Discount as DiscountIcon
} from '@mui/icons-material';
import colors from '../../../theme/colores';

const CardCampania = ({ campania, onActivar, onDesactivar }) => {
  const porcentajeUso = (campania.cupones_usados / campania.total_cupones) * 100;
  const puedeActivar = campania.estatus === 0; // Inactiva
  const puedeDesactivar = campania.estatus === 1; // Activa

  const getEstadoColor = (estatus) => {
    switch (estatus) {
      case 1: return colors.status.success; // Activa
      case 2: return colors.status.warning; // Inactiva
      default: return colors.text.disabled;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CampaignIcon sx={{ color: colors.primary.main }} />
            <Typography variant="h6" component="h3" fontWeight="bold">
              {campania.nombre_campania}
            </Typography>
          </Box>
          <Chip 
            label={campania.estatus_display}
            size="small"
            sx={{
              backgroundColor: getEstadoColor(campania.estatus),
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>

        {/* Código y Descuento */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip 
            label={campania.codigo}
            variant="outlined"
            color="primary"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DiscountIcon sx={{ color: colors.status.success, fontSize: 20 }} />
            <Typography variant="h6" color={colors.status.success} fontWeight="bold">
              {campania.porcentaje_desc}%
            </Typography>
          </Box>
        </Box>

        {/* Progreso de uso */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color={colors.text.secondary}>
              Cupones utilizados
            </Typography>
            <Typography variant="body2" fontWeight="bold">
               {campania.total_cupones_usados} / {campania.total_cupones}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={porcentajeUso}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.background.paper,
              '& .MuiLinearProgress-bar': {
                backgroundColor: colors.primary.main
              }
            }}
          />
        </Box>

        {/* Información adicional */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PeopleIcon sx={{ fontSize: 18, color: colors.text.secondary }} />
          <Typography variant="body2" color={colors.text.secondary}>
            {campania.total_cupones} clientes beneficiados
          </Typography>
        </Box>
      </CardContent>

      {/* Acciones */}
      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
        {puedeActivar && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onActivar(campania)}
            sx={{
              bgcolor: colors.status.success,
              '&:hover': { bgcolor: colors.status.success }
            }}
          >
            Activar
          </Button>
        )}
        {puedeDesactivar && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onDesactivar(campania)}
            sx={{
              color: colors.status.warning,
              borderColor: colors.status.warning,
              '&:hover': { 
                backgroundColor: `${colors.status.warning}10`,
                borderColor: colors.status.warning
              }
            }}
          >
            Desactivar
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default CardCampania;