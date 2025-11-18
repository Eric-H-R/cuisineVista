import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';

const BarraBusqueda = ({ 
  placeholder = "Buscar...", 
  onSearch,
  value = ""
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper'
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
          value={value}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 2,
              backgroundColor: 'background.default'
            }
          }}
          sx={{
            flexGrow: 1,
            mr: isMobile ? 0 : 2,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              }
            }
          }}
        />
      </Box>
    </Paper>
  );
};

BarraBusqueda.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  value: PropTypes.string
};

BarraBusqueda.defaultProps = {
  placeholder: "Buscar...",
  value: ""
};

export default BarraBusqueda;