// components/BarraBusqueda.jsx
import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box
} from '@mui/material';
import {
  Search,
  Clear
} from '@mui/icons-material';

const BarraBusqueda = ({ placeholder, onSearch, value, sx = {} }) => {
  const [searchValue, setSearchValue] = useState(value || '');

  const handleSearchChange = (event) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <Box sx={{ mb: 3, ...sx }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
            transition: '0.25s ease',
          },
          '& .MuiInputBase-root:hover': {
            boxShadow: '0px 3px 10px rgba(0,0,0,0.12)',
          },
          '& .MuiInputBase-root.Mui-focused': {
            boxShadow: '0px 3px 10px rgba(0,0,0,0.15)',
            backgroundColor: '#fff'
          },
          // colores del borde
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-border, #d0d7de)',
            transition: '0.25s'
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-info, #0088cc)',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#6b7280' }} />
            </InputAdornment>
          ),
          endAdornment: searchValue && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                aria-label="limpiar búsqueda"
                sx={{
                  color: '#9ca3af',
                  '&:hover': {
                    color: '#111827'
                  }
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default BarraBusqueda;
