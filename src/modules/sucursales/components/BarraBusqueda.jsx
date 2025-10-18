//import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';

const BarraBusqueda = ({ placeholder = "Buscar..." }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0,
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        {/* Barra de búsqueda */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }
          }}
          sx={{
            flexGrow: 1,
            mr: isMobile ? 0 : 2
          }}
        />

        {/* Filtros */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          width: isMobile ? '100%' : 'auto'
        }}>
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: isMobile ? '50%' : 140,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }
            }}
          >
            <Select
              value="todas"
              displayEmpty
              inputProps={{ 'aria-label': 'Filtrar por estado' }}
            >
              <MenuItem value="todas">Todas</MenuItem>
              <MenuItem value="activas">Activas</MenuItem>
              <MenuItem value="inactivas">Inactivas</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

BarraBusqueda.propTypes = {
  placeholder: PropTypes.string
};

BarraBusqueda.defaultProps = {
  placeholder: "Buscar..."
};

export default BarraBusqueda;