import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Box,
  Alert,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  AccessTime as TimeIcon,
  TableRestaurant as TableIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import colors from '../../../theme/colores';

const ModalFormularioReserva = ({ 
  open, 
  onClose, 
  onCrearReserva,
  mesaSeleccionada,
  holdActual,
  reservaData,
  temporizadorActivo
}) => {
  const [formData, setFormData] = useState({
    inicio: '',
    duracion: reservaData?.duracion || 1,
    notas: reservaData?.notas || '',
    tolerancia_min: 15
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorBackend, setErrorBackend] = useState(null);

  // Función para obtener fecha actual en formato datetime-local
  function obtenerFechaActual() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Función para convertir datetime-local a formato yyyy-mm-dd hh:mm:ss
  function convertirFechaFormato(fechaInput) {
    if (!fechaInput) return '';
    
    try {
      const fecha = new Date(fechaInput);
      if (isNaN(fecha.getTime())) return '';
      
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const hours = String(fecha.getHours()).padStart(2, '0');
      const minutes = String(fecha.getMinutes()).padStart(2, '0');
      const seconds = String(fecha.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error convirtiendo fecha:', error);
      return '';
    }
  }

  // Efecto para cerrar automáticamente cuando se acabe el temporizador
  useEffect(() => {
    if (open && !temporizadorActivo) {
      handleCloseAutomatico();
    }
  }, [open, temporizadorActivo]);

  // Limpiar errores del backend cuando se abre el modal
  useEffect(() => {
    if (open) {
      setErrorBackend(null);
      // Inicializar con fecha actual si está vacío
      if (!formData.inicio) {
        setFormData(prev => ({
          ...prev,
          inicio: obtenerFechaActual()
        }));
      }
      
      if (reservaData) {
        setFormData(prev => ({
          ...prev,
          duracion: reservaData.duracion,
          notas: reservaData.notas
        }));
      }
    }
  }, [open, reservaData]);

  const handleCloseAutomatico = () => {
    toast.warning('Tiempo agotado - El formulario se ha cerrado automáticamente');
    limpiarFormulario();
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.inicio) {
      newErrors.inicio = 'La fecha y hora de inicio son requeridas';
    } else {
      const fechaInicio = new Date(formData.inicio);
      if (fechaInicio < new Date()) {
        newErrors.inicio = 'La fecha no puede ser en el pasado';
      }
    }
    
    if (!formData.duracion || formData.duracion <= 0) {
      newErrors.duracion = 'La duración debe ser mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCrearReserva = async () => {
    if (!validateForm()) return;
    if (!holdActual) {
      toast.error('Error: No hay un HOLD activo para esta mesa');
      return;
    }

    // Verificar si el temporizador sigue activo
    if (!temporizadorActivo) {
      toast.error('Tiempo agotado - No se puede crear la reserva');
      handleCloseAutomatico();
      return;
    }

    setLoading(true);
    setErrorBackend(null);

    try {
      // Convertir la fecha del formulario al formato requerido
      const inicioFormateado = convertirFechaFormato(formData.inicio);
      const inicioDate = new Date(formData.inicio);
      const finEstimado = new Date(inicioDate.getTime() + formData.duracion * 60 * 60 * 1000);

      // Formatear fin_estimado al formato requerido
      const formatoFecha = (fecha) => {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const hours = String(fecha.getHours()).padStart(2, '0');
        const minutes = String(fecha.getMinutes()).padStart(2, '0');
        const seconds = String(fecha.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const datosReserva = {
        inicio: inicioFormateado,
        fin_estimado: formatoFecha(finEstimado),
        hold_id: holdActual.id_hold_mesa,
        notas: formData.notas.trim(),
        tolerancia_min: formData.tolerancia_min,
        recepcionista_id: 1
      };

      await onCrearReserva(datosReserva);
      limpiarFormulario();
    } catch (error) {
      console.error('Error creando reserva:', error);
      
      // Manejar errores del backend
      if (error.response?.data) {
        const errorData = error.response.data;
        setErrorBackend({
          mensaje: errorData.error || 'Error al crear la reserva',
          disponibleDesde: errorData.mesa_disponible_desde,
          debeTerminarAntes: errorData.reserva_debe_terminar_antes
        });
        
        toast.error(`${errorData.error || 'Error al crear la reserva'}`);
      } else {
        toast.error('Error al crear la reserva');
      }
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      inicio: obtenerFechaActual(),
      duracion: 1,
      notas: '',
      tolerancia_min: 15
    });
    setErrors({});
    setErrorBackend(null);
  };

  const handleClose = () => {
    limpiarFormulario();
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores del backend cuando el usuario modifica los campos
    if (errorBackend) {
      setErrorBackend(null);
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const calcularFinEstimado = () => {
    if (formData.inicio && formData.duracion) {
      try {
        const inicioDate = new Date(formData.inicio);
        if (isNaN(inicioDate.getTime())) return null;
        
        return new Date(inicioDate.getTime() + formData.duracion * 60 * 60 * 1000);
      } catch (error) {
        console.error('Error calculando fin estimado:', error);
        return null;
      }
    }
    return null;
  };

  const formatearFechaParaMostrar = (fecha) => {
    if (!fecha) return '';
    
    try {
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      
      if (isNaN(fechaObj.getTime())) return '';
      
      return fechaObj.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha para mostrar:', error);
      return '';
    }
  };

  // Función para sugerir una nueva fecha basada en los errores del backend
const obtenerSugerenciaFecha = () => {
  if (!errorBackend || !errorBackend.disponibleDesde) return null;

  const ahora = new Date();
  const [horasDisponible, minutosDisponible] = errorBackend.disponibleDesde.split(':');
  
  // Crear fecha sugerida para hoy
  const sugerenciaHoy = new Date(ahora);
  sugerenciaHoy.setHours(parseInt(horasDisponible), parseInt(minutosDisponible), 0, 0);
  
  // Si la sugerencia de hoy es en el futuro, usarla
  if (sugerenciaHoy > ahora) {
    return sugerenciaHoy.toISOString().slice(0, 16);
  }
  
  // Si no, usar mañana
  const sugerenciaManana = new Date(sugerenciaHoy);
  sugerenciaManana.setDate(sugerenciaManana.getDate() + 1);
  
  return sugerenciaManana.toISOString().slice(0, 16);
};

const aplicarSugerencia = () => {
  const sugerencia = obtenerSugerenciaFecha();
  if (sugerencia) {
    setFormData(prev => ({
      ...prev,
      inicio: sugerencia
    }));
    setErrorBackend(null);
    toast.info('Horario sugerido aplicado');
  }
};

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: colors.background.light
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: temporizadorActivo ? colors.primary.main : colors.status.warning,
        color: colors.primary.contrastText,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TableIcon />
          <Typography variant="h6" component="div" fontWeight="bold">
            Crear Reserva {!temporizadorActivo && ' - TIEMPO AGOTADO'}
          </Typography>
        </Box>
        <IconButton 
          onClick={handleClose}
          sx={{ color: colors.primary.contrastText }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Alerta de error del backend */}
          {errorBackend && (
            <Grid item size={{xs: 12}}>
              <Alert 
                severity="error"
                sx={{ 
                  bgcolor: `${colors.status.error}10`,
                  border: `1px solid ${colors.status.error}`
                }}
                icon={<ErrorIcon />}
              >
                <Typography variant="subtitle2" component="div" fontWeight="bold">
                  {errorBackend.mensaje}
                </Typography>
                
                {errorBackend.disponibleDesde && (
                  <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                    <strong>Mesa disponible a partir:</strong> {errorBackend.disponibleDesde}
                  </Typography>
                )}
                
                
                {obtenerSugerenciaFecha() && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={aplicarSugerencia}
                      sx={{
                        borderColor: colors.primary.main,
                        color: colors.primary.main,
                        '&:hover': {
                          backgroundColor: `${colors.primary.main}10`
                        }
                      }}
                    >
                      Usar horario sugerido
                    </Button>
                  </Box>
                )}
              </Alert>
            </Grid>
          )}

          {/* Alerta de tiempo agotado */}
          {!temporizadorActivo && (
            <Grid item size={{xs: 12}}>
              <Alert 
                severity="error"
                sx={{ 
                  bgcolor: `${colors.status.error}10`,
                  border: `1px solid ${colors.status.error}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon />
                  <Typography variant="body1" component="div" fontWeight="bold">
                    ⏰ TIEMPO AGOTADO
                  </Typography>
                </Box>
                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                  El tiempo para completar la reserva ha expirado. Este formulario se cerrará automáticamente.
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Información de la mesa seleccionada */}
          {mesaSeleccionada && (
            <Grid item size={{xs: 12}}>
              <Alert 
                severity="success"
                sx={{ 
                  bgcolor: `${colors.status.success}10`,
                  border: `1px solid ${colors.status.success}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TableIcon />
                  <Box>
                    <Typography variant="subtitle1" component="div" fontWeight="bold">
                      Mesa {mesaSeleccionada.codigo_mesa}
                    </Typography>
                    <Typography variant="body2" component="div">
                      Capacidad: {mesaSeleccionada.capacidad} personas • Área: {mesaSeleccionada.area_id}
                    </Typography>
                  </Box>
                </Box>
              </Alert>
            </Grid>
          )}

          {/* Información del HOLD */}
          {holdActual && (
            <Grid item size={{xs: 12}}>
              <Box sx={{ 
                p: 2, 
                bgcolor: colors.background.paper,
                borderRadius: 1,
                border: `1px solid ${temporizadorActivo ? colors.primary.light : colors.status.warning}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" component="span" color={colors.text.primary} sx={{ mr: 1 }}>
                    <strong>HOLD Activo:</strong>
                  </Typography>
                  <Chip 
                    label={`ID: ${holdActual.id_hold_mesa}`} 
                    size="small" 
                    color={temporizadorActivo ? "primary" : "warning"}
                  />
                </Box>
                <Typography variant="caption" component="div" color={colors.text.secondary}>
                  {temporizadorActivo 
                    ? `Expira en: ${holdActual.tiempo_restante_segundos} segundos`
                    : 'HOLD expirado - Será cancelado automáticamente'
                  }
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Fecha y Hora de Inicio */}
          <Grid item size={{xs: 12, sm: 6}}>
            <TextField
              label="Fecha y Hora de Inicio *"
              type="datetime-local"
              value={formData.inicio}
              onChange={(e) => handleChange('inicio', e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.inicio}
              helperText={errors.inicio}
              disabled={!temporizadorActivo}
            />
          </Grid>

          {/* Duración */}
          <Grid item size={{xs: 12, sm: 6}}>
            <TextField
              label="Duración (horas) *"
              value={formData.duracion}
              onChange={(e) => handleChange('duracion', e.target.value)}
              fullWidth
              type="number"
              inputProps={{ 
                min: 1, 
                max: 12,
                step: 1
              }}
              error={!!errors.duracion}
              helperText={errors.duracion || "Ej: 1 = 1 hora, 2 = 2 horas"}
              disabled={!temporizadorActivo}
            />
          </Grid>

          {/* Tolerancia */}
          <Grid item size={{xs: 12, sm: 6}}>
            <TextField
              label="Tolerancia (minutos)"
              value={formData.tolerancia_min}
              onChange={(e) => handleChange('tolerancia_min', e.target.value)}
              fullWidth
              type="number"
              inputProps={{ 
                min: 0, 
                max: 60,
                step: 5
              }}
              helperText="Tiempo de espera permitido"
              disabled={!temporizadorActivo}
            />
          </Grid>

          {/* Notas */}
          <Grid item size={{xs: 12}}>
            <TextField
              label="Notas de la reserva (opcional)"
              value={formData.notas}
              onChange={(e) => handleChange('notas', e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Ej: Mesa para cumpleaños, cliente especial, requerimientos específicos..."
              disabled={!temporizadorActivo}
            />
          </Grid>

          {/* Resumen de la reserva */}
          <Grid item size={{xs: 12}}>
            <Alert 
              severity={temporizadorActivo ? "info" : "warning"}
              sx={{ 
                bgcolor: temporizadorActivo ? `${colors.status.info}10` : `${colors.status.warning}10`,
                border: `1px solid ${temporizadorActivo ? colors.status.info : colors.status.warning}`
              }}
            >
              <Typography variant="subtitle2" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                {temporizadorActivo ? "Resumen de la Reserva:" : "RESERVA NO COMPLETADA"}
              </Typography>
              {formData.inicio && formData.duracion && (
                <Box component="div" sx={{ pl: 1 }}>
                  <Typography variant="caption" component="div" display="block">
                    <strong>Inicio:</strong> {formatearFechaParaMostrar(formData.inicio)}
                  </Typography>
                  <Typography variant="caption" component="div" display="block">
                    <strong>Fin estimado:</strong> {formatearFechaParaMostrar(calcularFinEstimado())}
                  </Typography>
                  <Typography variant="caption" component="div" display="block">
                    <strong>Duración total:</strong> {formData.duracion} hora{formData.duracion != 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" component="div" display="block">
                    <strong>Tolerancia:</strong> {formData.tolerancia_min} minutos
                  </Typography>
                </Box>
              )}
              {!temporizadorActivo && (
                <Typography variant="caption" component="div" display="block" sx={{ mt: 1 }}>
                  El tiempo para completar la reserva ha expirado. Los datos ingresados se perderán.
                </Typography>
              )}
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        bgcolor: colors.background.paper,
        borderTop: `1px solid ${colors.border.light}`
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: colors.text.secondary,
            borderColor: colors.border.main,
            '&:hover': {
              borderColor: colors.primary.main,
              color: colors.primary.main
            }
          }}
        >
          {temporizadorActivo ? 'Cancelar' : 'Cerrar'}
        </Button>
        <Button
          onClick={handleCrearReserva}
          variant="contained"
          disabled={loading || !formData.duracion || !temporizadorActivo}
          sx={{
            bgcolor: temporizadorActivo ? colors.primary.main : colors.text.disabled,
            color: colors.primary.contrastText,
            px: 4,
            '&:hover': temporizadorActivo ? {
              bgcolor: colors.primary.dark
            } : {},
            '&:disabled': {
              bgcolor: colors.primary.light
            }
          }}
        >
          {loading ? 'Creando...' : 
           temporizadorActivo ? 'Confirmar Reserva' : 'Tiempo Agotado'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFormularioReserva;