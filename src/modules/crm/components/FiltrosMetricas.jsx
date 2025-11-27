import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Chip
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import colors from '../../../theme/colores';

const FiltrosMetricas = ({ 
  tipoMetrica, 
  parametros, 
  onParametrosChange,
  totalClientes 
}) => {
  
  const renderFiltrosVIP = () => (
    <Grid container spacing={2}>
      <Grid item size={{xs: 12, sm: 6}}>
        <FormControl fullWidth size="small">
          <InputLabel>Top N clientes</InputLabel>
          <Select
            value={parametros.top_n}
            label="Top N clientes"
            onChange={(e) => onParametrosChange('top_n', e.target.value)}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
            <MenuItem value={50}>Top 50</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderFiltrosInactivos = () => (
    <Grid container spacing={2}>
      <Grid item size={{xs: 12}}>
        <Typography variant="body2" gutterBottom>
          Días sin comprar: {parametros.dias_sin_comprar}
        </Typography>
        <Slider
          value={parametros.dias_sin_comprar}
          onChange={(e, newValue) => onParametrosChange('dias_sin_comprar', newValue)}
          min={7}
          max={180}
          step={7}
          valueLabelDisplay="auto"
          sx={{ color: colors.primary.main }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">1 semana</Typography>
          <Typography variant="caption">6 meses</Typography>
        </Box>
      </Grid>
    </Grid>
  );

  const renderFiltrosNuevos = () => (
    <Grid container spacing={2}>
      <Grid item size={{xs: 12}}>
        <Typography variant="body2" gutterBottom>
          Días desde registro: {parametros.dias_registro}
        </Typography>
        <Slider
          value={parametros.dias_registro}
          onChange={(e, newValue) => onParametrosChange('dias_registro', newValue)}
          min={1}
          max={90}
          step={1}
          valueLabelDisplay="auto"
          sx={{ color: colors.primary.main }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">1 día</Typography>
          <Typography variant="caption">3 meses</Typography>
        </Box>
      </Grid>
    </Grid>
  );

  const renderFiltrosSegunMetrica = () => {
    switch (tipoMetrica) {
      case 'clientes_vip':
      case 'clientes_frecuentes':
        return renderFiltrosVIP();
      case 'clientes_inactivos':
        return renderFiltrosInactivos();
      case 'clientes_nuevos':
        return renderFiltrosNuevos();
      case 'clientes_por_canal':
        return null; // No necesita filtros
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FilterListIcon sx={{ color: colors.primary.main }} />
        <Typography variant="h6" color={colors.text.primary}>
          Filtros
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Chip 
          icon={<PeopleIcon />}
          label={`${totalClientes} clientes`}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Filtros específicos */}
      {renderFiltrosSegunMetrica()}
    </Box>
  );
};

export default FiltrosMetricas;