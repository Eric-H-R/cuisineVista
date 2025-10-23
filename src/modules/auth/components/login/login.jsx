import React from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Grid, FormControl, TextField,FormControlLabel,Checkbox,Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

  const handleLogin = () => {
    //Solo sirve para redirigir por el momento no se hizo validaciones o rutas protegidas amigo
    navigate("/tiendas");
  };

  return (
 <Box sx={{
  backgroundImage: "url('/img/fondo_2.png')",
  minHeight: '100vh',
  width: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', 
}}>
  <Grid container sx={{
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 5,
    boxShadow: 3,
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'center',
    alignItems: {xs: 'center', md: 'stretch'},
    width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
    maxWidth: 1200,
    overflow: 'hidden',
    
  }}>
    {/* Primera mitad - Logo */}
    <Grid item size={6} xs={12} md={4} sx={{
      display: { xs: 'none', sm: 'flex', md: 'flex' },
      alignItems: 'center',
      justifyContent: 'center',
      backgroundSize: 'cover',
      borderTopLeftRadius: { xs: 0, md: 5 },
      borderBottomLeftRadius: { xs: 0, md: 5 },
      minHeight: { xs: 120, md: 300 },
    }}>
      <Box sx={{
        backgroundImage: "url('/img/logos.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: { xs: '60%', sm: '80%', md: '100%' },
        height: { xs: 120, sm: 250, md: '100%' },
        borderRadius: { xs: 0, md: 5 },
      }}>
      </Box>
    </Grid>

    {/* Segunda mitad - Formulario */}
    <Grid item size={6} xs={12} md={4} sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: { xs: 0, md: 4 },
      
    }}>
      <Box component="form"
        onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: { xs: 2, sm: 3, md: 4 },
          alignItems: 'center',
          width: '100%'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <img src="/img/logo_c.png" alt="Logo Pequeño" style={{ width: '60%', maxWidth: 260, height: 'auto' }} />
          </Box>
          <Typography variant="h3" align="center" sx={{ color: '#496e4c', mb: 2, mt:3, fontWeight: 'bold' }}>
            Inicia Sesión
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: '#6b8d64', mb: 2 }}>
            Bienvenido de nuevo, por favor ingresa tus credenciales.
          </Typography>

        <FormControl sx={{ width: { xs: '100%', sm: '80%', md: '50ch' } }}>
          <TextField
                  id="name"
                  label="Usuario"
                  variant="standard"
                  required
                  fullWidth
                  multiline
                  placeholder="Usuario"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon sx={{ color: '#99582a', mr:1.2 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb:2,
    // Color del texto
    '& .MuiInputBase-input': {
      color: '#588157',
    },
    // Color del label (normal)
    '& .MuiInputLabel-root': {
      color: '#588157',
    },
    // Color del label cuando tiene foco
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#432818',
    },
    // Borde normal
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: 'green',
    },
    // Borde cuando se pasa el mouse (hover)
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'green',
    },
    // Borde cuando tiene foco
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#432818',
    },
    // Color del borde cuando hay un error
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: 'red',
      backgroundColor: '#fddede',
    },
    //Color de la linea cuando da click
    '& .MuiInput-underline:after': {
      borderBottomColor: '#432818',
    },
  }}
          />
        </FormControl>

        <FormControl sx={{ m: 1, width: { xs: '100%', sm: '80%', md: '50ch',

          // Color del texto
    '& .MuiInputBase-input': {
      color: '#588157',
    },
    // Color del label (normal)
    '& .MuiInputLabel-root': {
      color: '#588157',
    },
    // Color del label cuando tiene foco
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#432818',
    },
    // Borde normal
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: 'green',
    },
    // Borde cuando se pasa el mouse (hover)
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'green',
    },
    // Borde cuando tiene foco
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#432818',
    },
    // Color del borde cuando hay un error
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: 'red',
      backgroundColor: '#fddede',
    },
    //Color de la linea cuando da click
    '& .MuiInput-underline:after': {
      borderBottomColor: '#432818',
    },
         } }} variant="standard" required>
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  sx={{color:'#99582a'}}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControlLabel
          control={<Checkbox value="recordarme" defaultChecked color="success"/>}
          label="Remember me"
          sx={{ color: '#746a5e' }}
        />

        <Button
          type="submit"
          size='normal'
          variant="outlined"
          sx={{width: { xs: '100%', sm: '80%', md: '50ch' }, mb:2,
                color: '#463929',
                borderColor: '#463929',
                '&:hover': {
                  borderColor: '#3a5a40',
                  color: '#3a5a40',
                  backgroundColor: 'rgba(58, 90, 64, 0.05)',
                },
                '&:focus': {
                  borderColor: '#588157',
                  color: '#588157',
                },
                '&:active': {
                  borderColor: '#746a5e',
                  color: '#588157',
                },
              }}
        >
          Sign up
        </Button>
      </Box>
    </Grid>
  </Grid>
</Box>
  );
}