// components/FiltrosDashboard.jsx
import React from 'react';
import {
  Paper,
  Box,
  TextField,
  Typography
} from '@mui/material';
import { DateRange } from '@mui/icons-material';
import colors from '../../../theme/colores';

const FiltrosDashboard = ({ filtros, onFiltrosChange, sucursalId }) => {
  const handleFechaChange = (campo, valor) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    });
  };

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 3, 
      backgroundColor: colors.background.paper,
      border: `1px solid ${colors.border.light}`
    }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {/* Sucursal Actual (solo lectura) */}
        <TextField
          size="small"
          label="Sucursal"
          value={`Sucursal #${sucursalId}`}
          InputProps={{ readOnly: true }}
          sx={{ 
            minWidth: 150,
            '& .MuiInputBase-input': {
              color: colors.primary.main,
              fontWeight: 600
            }
          }}
        />

        {/* Fecha Desde */}
        <TextField
          size="small"
          label="Fecha Desde"
          type="date"
          value={filtros.fecha_desde}
          onChange={(e) => handleFechaChange('fecha_desde', e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: colors.primary.light,
              },
            }
          }}
        />

        {/* Fecha Hasta */}
        <TextField
          size="small"
          label="Fecha Hasta"
          type="date"
          value={filtros.fecha_hasta}
          onChange={(e) => handleFechaChange('fecha_hasta', e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: colors.primary.light,
              },
            }
          }}
        />

        {/* Info de Sucursal */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <DateRange sx={{ color: colors.text.secondary }} />
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Período: {filtros.fecha_desde} a {filtros.fecha_hasta}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default FiltrosDashboard;