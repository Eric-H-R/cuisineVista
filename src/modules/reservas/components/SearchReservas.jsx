// componente para buscar reservas 
// Buscar por cliente o mesa || y tipo de estatus 

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

import { useState } from 'react';

const SearchReservas = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [estatus, setEstatus] = useState('todos-estatus');

    return (
    <Paper 
      elevation={1} 
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
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
          placeholder="Buscar reservas..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
          sx={{
            flexGrow: 1,
            mr: isMobile ? 0 : 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#EDE0D4',
              // default outline color
              '& fieldset': {
                borderColor: '#6b3e263f',
              },
              // outline when focused / clicked
              '&.Mui-focused fieldset': {
                borderColor: '#1f5f1f3b',
                boxShadow: '0 0 0 4px rgba(41, 59, 40, 0.06)',
              },
            }
          }}
        />

        <Box sx={{ 
          display: 'flex',
          gap: 2,
          width: isMobile ? '100%' : 'auto'
        }}>
            <FormControl
            size='small'
            sx={{
               minWidth: isMobile ? '50%' : 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#EDE0D4',
                // default outline color
                '& fieldset': {
                  borderColor: '#6b3e2628',
                },
                // outline when focused / clicked (applies when Select is focused)
                '&.Mui-focused fieldset': {
                  borderColor: '#1f5f1f3b',
                  boxShadow: '0 0 0 4px rgba(41, 59, 40, 0.06)',
                },
            }}}
            >
                <Select
                    value={estatus}
                    onChange={e => setEstatus(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Filtrar' }}
                    // Customized menu items: green hover / selected instead of default blue
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          // target MenuItem inside the Paper
                          '& .MuiMenuItem-root': {
                            // normal hover color (subtle green)
                            '&:hover': {
                              backgroundColor: 'rgba(46,125,50,0.08)',
                            },
                            // selected state
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(46,125,50,0.12)',
                              color: '#1b5e20',
                            },
                            // selected + hover
                            '&.Mui-selected:hover': {
                              backgroundColor: 'rgba(46,125,50,0.16)',
                            },
                          },
                        },
                      }
                    }}
                >
                <MenuItem value="todos-estatus">Todos estatus</MenuItem>
                <MenuItem value="programada">Programada</MenuItem>
                <MenuItem value="en-curso">En curso</MenuItem>
                <MenuItem value="completada">Completada</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
            </FormControl>

        </Box>
        </Box>
    </Paper>
  );
};
export default SearchReservas;




