import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import horarioService from '../services/horarios.service';
import { useUsuarios } from '../../../hooks/useUsuarios';
import colors from '../../../theme/colores';

// TOAST: ALERTAS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Función withAlpha como la tienes en tu archivo de colores
const withAlpha = (color, alpha = '20') => {
  return color + alpha;
};

const AsignarHorarioUsuario = ({ horario, open, onClose, onAsignacionExitosa }) => {
  const { usuarios, loading: loadingUsuarios, error: errorUsuarios } = useUsuarios();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setUsuarioSeleccionado('');
      setFechaInicio(null);
      setFechaFin(null);
      setError('');
    }
  }, [open]);

  const handleAsignar = async () => {
    if (!usuarioSeleccionado || !fechaInicio || !fechaFin) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (fechaInicio > fechaFin) {
      setError('La fecha de inicio no puede ser mayor a la fecha fin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const asignacionData = {
        horario_id: horario.id_horario,
        usuario_id: usuarioSeleccionado,
        fecha_inicio: fechaInicio.format('YYYY-MM-DD'),
        fecha_fin: fechaFin.format('YYYY-MM-DD')
      };

      const {data: response} = await horarioService.asignar(asignacionData);
      
      if (response.success) {
        // Mostrar notificación de éxito
        toast.success('Horario asignado correctamente', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        onAsignacionExitosa();
        onClose();
      } else {
        const errorMessage = response.message || 'Error al asignar horario';
        setError(errorMessage);
        // Mostrar notificación de error
        toast.error(`${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error asignando horario:', error);
        let errorMessage;
      if (error.status == 400) {
        errorMessage = 'El usuario ya tiene un horario asignado';
      }else{
         errorMessage = 'Error sistema';
      }
      setError(errorMessage);
      // Mostrar notificación de error
      toast.error(`${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(88, 129, 87, 0.2)',
          border: `1px solid ${withAlpha(colors.primary.main, '20')}`,
          backgroundColor: colors.background.default
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: colors.primary.main, 
        color: colors.primary.contrastText,
        py: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '5%',
          width: '90%',
          height: '2px',
          backgroundColor: colors.secondary.main
        }
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" component="div" fontWeight="bold">
            Asignar Horario
          </Typography>
          <Chip 
            label={horario?.clave} 
            size="small" 
            sx={{
              backgroundColor: colors.secondary.main,
              color: colors.primary.main,
              fontWeight: '600',
              border: `1px solid ${colors.primary.main}`
            }}
          />
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Información del Horario */}
            <Box sx={{ 
              p: 2, 
              mt: 1,
              borderRadius: 2,
              backgroundColor: withAlpha(colors.primary.main, '5'),
              border: `1px solid ${withAlpha(colors.primary.main, '20')}`
            }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Horario seleccionado:
              </Typography>
              <Typography variant="body1" fontWeight="medium" sx={{ color: colors.primary.main }}>
                {horario?.nombre} - {horario?.clave}
              </Typography>
              {horario?.descripcion && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {horario.descripcion}
                </Typography>
              )}
            </Box>

            {/* Selección de Usuario */}
            <FormControl fullWidth disabled={loadingUsuarios}>
              <InputLabel sx={{ color: colors.text.primary }}>
                Usuario a asignar
              </InputLabel>
              <Select
                value={usuarioSeleccionado}
                label="Usuario a asignar"
                onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                renderValue={(selected) => {
                  if (!selected) return '';
                  const usuario = usuarios.find(u => u.id === selected);
                  return usuario ? `${usuario.nombre} ${usuario.apellido}` : '';
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: colors.secondary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary.main,
                    },
                  }
                }}
              >
                {loadingUsuarios ? (
                  <MenuItem disabled>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={20} sx={{ color: colors.primary.main }} />
                      <Typography variant="body2" color="text.secondary">
                        Cargando usuarios...
                      </Typography>
                    </Box>
                  </MenuItem>
                ) : (
                  [
                    <MenuItem key="empty" value="">
                      <em>Seleccione un usuario</em>
                    </MenuItem>,
                    ...usuarios.map((usuario) => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        <Box>
                          <Typography variant="body1" sx={{ color: colors.text.primary }}>
                            {usuario.nombre} {usuario.apellido}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {usuario.email}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ]
                )}
              </Select>
            </FormControl>

            {/* Fechas de vigencia */}
            <Box display="flex" gap={2}>
              <DatePicker
                label="Fecha inicio"
                value={fechaInicio}
                onChange={setFechaInicio}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: colors.secondary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.main,
                        },
                      }
                    }
                  } 
                }}
              />
              <DatePicker
                label="Fecha fin"
                value={fechaFin}
                onChange={setFechaFin}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: colors.secondary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.main,
                        },
                      }
                    }
                  } 
                }}
              />
            </Box>

            {/* Información adicional */}
            <Alert 
              severity="info"
              sx={{
                backgroundColor: withAlpha(colors.status.info, '10'),
                border: `1px solid ${colors.status.info}`,
                color: colors.status.info
              }}
            >
              Al asignar este horario, se desactivarán automáticamente 
              las asignaciones previas del usuario en el mismo período.
            </Alert>
          </Box>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        backgroundColor: colors.background.light
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{
            color: colors.accent.main,
            borderColor: colors.accent.main,
            '&:hover': {
              borderColor: colors.accent.dark,
              backgroundColor: withAlpha(colors.accent.main, '10'),
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleAsignar} 
          variant="contained"
          disabled={!usuarioSeleccionado || !fechaInicio || !fechaFin || loading || loadingUsuarios}
          startIcon={loading && <CircularProgress size={16} sx={{ color: 'white' }} />}
          size="large"
          sx={{
            minWidth: 140,
            backgroundColor: colors.primary.main,
            '&:hover': {
              backgroundColor: colors.primary.dark,
            },
            '&:disabled': {
              backgroundColor: withAlpha(colors.text.disabled, '30'),
              color: colors.text.disabled
            }
          }}
        >
          {loading ? 'Asignando...' : 'Asignar Horario'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignarHorarioUsuario;