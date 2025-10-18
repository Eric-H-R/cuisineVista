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

const BarraBusqueda = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper 
     elevation={0} 
      sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 2,
        mt: 3
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 2,
              backgroundColor: '#EDE0D4',
              borderColor: '#588157',
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
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: isMobile ? '50%' : 140,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#EDE0D4'
              }
            }}
          >
            <Select
              value="todos-los-roles"
              displayEmpty
              inputProps={{ 'aria-label': 'Filtrar por roles' }}
            >
              <MenuItem value="todos-los-roles">Todos los roles</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="usuario">Usuario</MenuItem>
              <MenuItem value="cliente">Cliente</MenuItem>
            </Select>
          </FormControl>

          <FormControl 
            size="small" 
            sx={{ 
              minWidth: isMobile ? '50%' : 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#EDE0D4'
              }
            }}
          >
            <Select
              value="todos"
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