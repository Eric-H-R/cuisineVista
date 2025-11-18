import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert
} from '@mui/material';
import {
  Cancel,
  Schedule,
  AccessTime,
  Visibility,
  Info
} from '@mui/icons-material';
import colors, { withAlpha } from '../../../theme/colores';

const DIAS_SEMANA = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' }
];

const FormularioDetallesHorario = ({ 
  open, 
  onClose, 
  horario,
  loading = false 
}) => {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    if (horario && open) {
      // Cargar detalles existentes del horario
      setDetalles(horario.detalles || []);
    } else {
      setDetalles([]);
    }
  }, [horario, open]);

  const getNombreDia = (diaId) => {
    const dia = DIAS_SEMANA.find(d => d.id === diaId);
    return dia ? dia.nombre : `Día ${diaId}`;
  };

  // Ordenar detalles por día de la semana
  const detallesOrdenados = [...detalles].sort((a, b) => a.dia_semana - b.dia_semana);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(88, 129, 87, 0.2)',
          border: `1px solid ${withAlpha(colors.secondary.main, '20')}`,
          maxHeight: '90vh'
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: colors.secondary.main, 
            color: colors.primary.main,
            width: 48,
            height: 48
          }}>
            <Visibility />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold" fontSize="1.25rem">
              Detalles del Horario
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, color: colors.background.paper }}>
              {horario?.nombre} - {horario?.clave}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: colors.background.default }}>
        <Box sx={{ p: 3 }}>
          {/* Información del Horario */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: colors.background.light,
            borderRadius: 2,
            border: `1px solid ${withAlpha(colors.secondary.main, '30')}`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Schedule sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                Información del Horario
              </Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Clave:</strong> {horario?.clave}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Nombre:</strong> {horario?.nombre}
                </Typography>
              </Box>
              <Box>
                <Typography 
                  component="div" 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <strong>Estado:</strong>
                  <Chip label="Activo" size="small" color="success" />
                </Typography>
              </Box>
            </Box>
            {horario?.descripcion && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Descripción:</strong> {horario.descripcion}
              </Typography>
            )}
          </Paper>

          {/* Alerta informativa */}
          <Alert 
            severity="info" 
            icon={<Info />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              Los detalles del horario no se pueden modificar después de creados. 
              Esta vista es solo para consulta.
            </Typography>
          </Alert>

          {/* Lista de detalles existentes */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: colors.background.light,
            borderRadius: 2,
            border: `1px solid ${withAlpha(colors.secondary.main, '30')}`,
            boxShadow: '0 2px 8px rgba(88, 129, 87, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AccessTime sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                Detalles Configurados ({detalles.length})
              </Typography>
            </Box>

            {detalles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <AccessTime sx={{ fontSize: 48, color: colors.text.secondary, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No hay detalles configurados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Este horario no tiene días y horarios configurados
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Día</strong></TableCell>
                      <TableCell><strong>Hora Inicio</strong></TableCell>
                      <TableCell><strong>Hora Fin</strong></TableCell>
                      <TableCell><strong>Tolerancia</strong></TableCell>
                      <TableCell><strong>Turno</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detallesOrdenados.map((detalle, index) => (
                      <TableRow 
                        key={detalle.id_detalle || index}
                        sx={{
                          '&:hover': {
                            backgroundColor: colors.background.default
                          }
                        }}
                      >
                        <TableCell>
                          <Chip 
                            label={getNombreDia(detalle.dia_semana)}
                            size="small"
                            sx={{
                              backgroundColor: withAlpha(colors.primary.main, '10'),
                              color: colors.primary.main,
                              fontWeight: '500'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {detalle.hora_inicio}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {detalle.hora_fin}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${detalle.tolerancia_min} min`}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: colors.accent.main,
                              color: colors.accent.main
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {detalle.turno_idx || 1}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: colors.secondary.main }} />

      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        backgroundColor: colors.background.default
      }}>
        <Button
          startIcon={<Cancel />}
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
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioDetallesHorario;