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
//import PropTypes from 'prop-types';

const BarraBusqueda = () => {
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
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar productos, combos o categorías..."
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

        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          width: isMobile ? '100%' : 'auto'
        }}>
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: isMobile ? '50%' : 180,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }
            }}
          >
            <Select value="todas" displayEmpty>
              <MenuItem value="todas">Todas las categorías</MenuItem>
              <MenuItem value="entradas">Entradas</MenuItem>
              <MenuItem value="platos-fuertes">Platos Fuertes</MenuItem>
              <MenuItem value="postres">Postres</MenuItem>
              <MenuItem value="bebidas">Bebidas</MenuItem>
              <MenuItem value="combos">Combos</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

export default BarraBusqueda;