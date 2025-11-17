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
import { useState, useEffect } from 'react';

const BarraBusqueda = ({ 
  onSearch, 
  onFilterChange,
  initialFilters = {},
  roles = []
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estado local para los filtros
  const [filters, setFilters] = useState({
    searchTerm: '',
    rol: 'todos-los-roles',
    status: 'todos',
    ...initialFilters
  });

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch?.(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.searchTerm]); // Solo dependemos de searchTerm para el debounce

  // Efecto para cambios inmediatos en filtros
  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters.rol, filters.status]); // Solo rol y status cambian inmediatamente

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      searchTerm: value
    }));
  };

  const handleRolChange = (event) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      rol: value
    }));
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      status: value
    }));
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 2,
        mt: 3,
        backgroundColor: '#EDE0D4',
        border: '1px solid #58815730'
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
          placeholder="Buscar usuarios, roles o clientes..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 2,
              backgroundColor: 'white',
              '&:hover fieldset': {
                borderColor: '#588157',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#588157',
              }
            }
          }}
          sx={{
            flexGrow: 1,
            mr: isMobile ? 0 : 2,
          }}
        />

        {/* Filtros */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          width: isMobile ? '100%' : 'auto'
        }}>
          {/* Filtro por Rol */}
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: isMobile ? '50%' : 140,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                '&:hover fieldset': {
                  borderColor: '#588157',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#588157',
                }
              }
            }}
          >
            <Select
              value={filters.rol}
              onChange={handleRolChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Filtrar por roles' }}
            >
              <MenuItem value="todos-los-roles">Todos los roles</MenuItem>
              {roles.map((rol) => (
                <MenuItem key={rol.id_rol || rol.id} value={rol.nombre}>
                  {rol.nombre}
                </MenuItem>
              ))}
              {roles.length === 0 && [
                <MenuItem key="administrador" value="administrador">Administrador</MenuItem>,
                <MenuItem key="usuario" value="usuario">Usuario</MenuItem>,
                <MenuItem key="cliente" value="cliente">Cliente</MenuItem>
              ]}
            </Select>
          </FormControl>

          {/* Filtro por Estado */}
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: isMobile ? '50%' : 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
                '&:hover fieldset': {
                  borderColor: '#588157',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#588157',
                }
              }
            }}
          >
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Filtrar por estado' }}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="activos">Activos</MenuItem>
              <MenuItem value="inactivos">Inactivos</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

export default BarraBusqueda;