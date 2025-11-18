// components/BarraBusqueda.jsx
import { TextField, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const BarraBusqueda = ({ placeholder, onSearch, value }) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
};

export default BarraBusqueda;