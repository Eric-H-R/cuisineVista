import React, { useEffect, useState } from "react";
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
import { Box, Grid, FormControl, TextField,FormControlLabel,Checkbox,Button, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, signInAnonymously } from 'firebase/auth';
import { messaging } from '../../../../firebase';
import { getToken, onMessage } from "firebase/messaging";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

//API
import authService from '../../services/auth.service'
import { useAuth } from "../../../../context/AuthContext"; 

// Importamos las validaciones
import { loginValidations } from '../../../../utils/Validations';

export default function Login() {
const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  // Validación en tiempo real
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    newErrors[field] = loginValidations[field](value);
    setErrors(newErrors);
  };

  // Validación completa del formulario
  const validateForm = () => {
    const emailError = loginValidations.email(usuario);
    const passwordError = loginValidations.password(password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    return !emailError && !passwordError;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUsuario(value);
    if (value.trim()) {
      validateField('email', value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.trim()) {
      validateField('password', value);
    }
  };

  const { login } = useAuth();
  const navigate = useNavigate();

  const activarMensaje = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VAP_ID_KEY,
      });
      console.log("Token Firebase obtenido:", token);
      return token;
    } catch (error) {
      console.error("Error obteniendo token Firebase:", error);
      return null;
    }
  };

  onMessage(messaging, (payload) => {
    console.log("Mensaje recibido en foreground:", payload);

    // Si quieres mostrar una notificación dentro de la app
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon,
    });
  });
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación final antes de enviar
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      setLoading(false);
      return;
    }

    const pushToken = await activarMensaje();

    const payload = {
      email: usuario,
      password: password,
      plataforma: "web",
      push_token: pushToken,
    };

    try {
      const { data } = await authService.login(payload);
      console.log("Respuesta login:", data);

      toast.success('¡Inicio de sesión exitoso!');

      // Guarda usuario y token
      login(data.access_token, data.user);

      setTimeout(() => {
        navigate("/tiendas");
      }, 1000);

    } catch (error) {
      console.error("Error en login:", error);
      
      let errorMessage = 'Usuario o contraseña incorrectos';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Credenciales inválidas. Verifica tu usuario y contraseña.';
        } else if (error.response.status === 404) {
          errorMessage = 'Usuario no encontrado.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    
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
        <Grid container
        width={{ xs: '100%', sm: '100%',  lg: 1000 }}
        height={{xs: '100%', sm: '100%', lg: 530}}
        sx={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: 5,
          boxShadow: 10,
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* Primera mitad - Logo */}
          <Grid  size={{ xs: 12, md: 8 , lg: 6 }} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundSize: 'cover',
          }}>
            <Box sx={{
              backgroundImage: "url('/img/logos.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}>
            </Box>
          </Grid>

          {/* Segunda mitad - Formulario */}
          <Grid  size={{ xs: 12, md: 8, lg: 6 }} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            
          }}>
            <Box component="form"
              onSubmit={handleLogin}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Grid size={{ xs: 12, md: 8, lg: 8}}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img src="/img/logo_c.png" alt="Logo Pequeño" style={{ width: '65%', maxWidth: 260, height: 'auto' }} />
                </Box>
                <Typography align="center" variant="h4" sx={{ color: '#496e4c', mb: 1, mt:2, fontWeight: 'bold' }}>
                  Inicia Sesión
                </Typography>
                <Typography  align="center" variant="subtitle2" sx={{ color: '#6b8d64', }}>
                  Bienvenido de nuevo, por favor ingresa tus credenciales.
                </Typography>
              <FormControl  fullWidth variant="standard" required>
                <TextField
                  id="name"
                  label="Usuario"
                  variant="standard"
                  required
                  fullWidth
                  multiline
                  value={usuario}
                  onChange={handleEmailChange}
                  onBlur={() => validateField('email', usuario)}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  placeholder="Usuario"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon sx={{ color: errors.email ? 'error.main' : '#99582a', mr:1.2 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb:2,
                    '& .MuiInputBase-input': {
                      color: '#588157',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#588157',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#432818',
                    },
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'green',
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'green',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#432818',
                    },
                    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'red',
                      backgroundColor: '#fddede',
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: errors.email ? 'error.main' : '#432818',
                    },
                    '& .MuiInput-underline:before': {
                      borderBottomColor: errors.email ? 'error.main' : 'rgba(0, 0, 0, 0.42)',
                    },
                  }}
                />
              </FormControl>

              <FormControl fullWidth variant="standard" required>
                <InputLabel 
                  htmlFor="standard-adornment-password"
                  error={!!errors.password}
                >
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => validateField('password', password)}
                  error={!!errors.password}
                  disabled={loading}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        sx={{color: errors.password ? 'error.main' : '#99582a'}}
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {errors.password && (
                  <Typography 
                    variant="caption" 
                    color="error"
                    sx={{ 
                      fontSize: '0.75rem',
                      mt: 0.5,
                      ml: 2
                    }}
                  >
                    {errors.password}
                  </Typography>
                )}
              </FormControl>
              <Button
                fullWidth
                type="submit"
                size='normal'
                variant="outlined"
                disabled={loading || !!errors.email || !!errors.password || !usuario.trim() || !password.trim()}
                sx={{ mb:2,
                      mt:3,
                      width: '100%',
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
                      '&.Mui-disabled': {
                        color: '#a0a0a0',
                        borderColor: '#a0a0a0',
                      },
                    }}
              >
                {loading ? 'Iniciando sesión...' : 'Sign up'}
              </Button>
              </Grid>
          </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}