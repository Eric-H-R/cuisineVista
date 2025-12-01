// sections/SeccionResumen.jsx
import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import {
  Dashboard,
  Star,
  Inventory,
  Restaurant,
  Event,
  AttachMoney
} from '@mui/icons-material';

// Colores
import colors from '../../../theme/colores';

const SeccionResumen = ({ filtros, sucursalId }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Bienvenida */}
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center',
        backgroundColor: colors.primary.main,
        color: colors.primary.contrastText
      }}>
        <Dashboard sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bienvenido al Dashboard
        </Typography>
        <Typography variant="h6">
          Resumen general del desempeño de tu restaurante
        </Typography>
      </Paper>

      {/* Tarjetas de Navegación */}
      <Grid container spacing={3}>
        <Grid size={{xs: 12, sm: 6, md: 4}}>
          <Card sx={{ 
            backgroundColor: colors.background.paper,
            border: `2px solid ${colors.primary.main}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 25px ${colors.primary.main}40`
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Star sx={{ fontSize: 48, color: colors.primary.main, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: colors.primary.main }} gutterBottom>
                Calificaciones
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Revisa las calificaciones de tus clientes y el desempeño de tu equipo
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 4}}>
          <Card sx={{ 
            backgroundColor: colors.background.paper,
            border: `2px solid ${colors.secondary.main}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 25px ${colors.secondary.main}40`
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Inventory sx={{ fontSize: 48, color: colors.secondary.main, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: colors.secondary.main }} gutterBottom>
                Inventario
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Controla tu stock, lotes vencidos y productos por vencer
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 4}}>
          <Card sx={{ 
            backgroundColor: colors.background.paper,
            border: `2px solid ${colors.status.success}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 25px ${colors.status.success}40`
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Restaurant sx={{ fontSize: 48, color: colors.status.success, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: colors.status.success }} gutterBottom>
                Pedidos
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Analiza tendencias de pedidos y productos más populares
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 4}}>
          <Card sx={{ 
            backgroundColor: colors.background.paper,
            border: `2px solid ${colors.accent.main}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 25px ${colors.accent.main}40`
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Event sx={{ fontSize: 48, color: colors.accent.main, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: colors.accent.main }} gutterBottom>
                Reservas
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Monitorea el comportamiento de tus reservas y tasa de no-show
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 4}}>
          <Card sx={{ 
            backgroundColor: colors.background.paper,
            border: `2px solid ${colors.status.info}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 25px ${colors.status.info}40`
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <AttachMoney sx={{ fontSize: 48, color: colors.status.info, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: colors.status.info }} gutterBottom>
                Ventas
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Revisa el desempeño financiero y tendencias de ventas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 4}}>
          <Card sx={{ 
            backgroundColor: colors.background.paper,
            border: `2px solid ${colors.status.warning}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 8px 25px ${colors.status.warning}40`
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Dashboard sx={{ fontSize: 48, color: colors.status.warning, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: colors.status.warning }} gutterBottom>
                Reportes
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Genera reportes detallados y exporta datos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Información del Período */}
      <Paper sx={{ 
        p: 3, 
        backgroundColor: colors.background.paper,
        border: `1px solid ${colors.border.light}`
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: colors.primary.main }}>
          Información del Período Actual
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>Fecha Inicio</Typography>
              <Typography variant="h6" sx={{ color: colors.text.primary }}>{filtros.fecha_desde}</Typography>
            </Box>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>Fecha Fin</Typography>
              <Typography variant="h6" sx={{ color: colors.text.primary }}>{filtros.fecha_hasta}</Typography>
            </Box>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>Sucursal</Typography>
              <Typography variant="h6" sx={{ color: colors.text.primary }}>#{sucursalId}</Typography>
            </Box>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>Días Analizados</Typography>
              <Typography variant="h6" sx={{ color: colors.text.primary }}>
                {Math.ceil((new Date(filtros.fecha_hasta) - new Date(filtros.fecha_desde)) / (1000 * 60 * 60 * 24)) + 1}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SeccionResumen;