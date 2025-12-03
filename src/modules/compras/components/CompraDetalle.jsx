import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import comprasService from '../services/compras.service';
import colors from '../../../theme/colores';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Stack } from '@mui/system';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import NumbersIcon from '@mui/icons-material/Numbers';

const CompraDetalle = ({ compraId }) => {
  const [compra, setCompra] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!compraId) return;

    const fetchCompra = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await comprasService.getById(compraId);
        const payload = res?.data?.data ?? res?.data ?? null;
        setCompra(payload);
      } catch (err) {
        console.error('Error al obtener compra:', err);
        setError('No se pudo cargar la compra.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompra();
  }, [compraId]);

  const formatDate = (d) => {
    if (!d) return 'No disponible';
    try {
      return new Date(d).toLocaleString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return d;
    }
  };

  const formatCurrency = (n) => {
    if (n == null) return '—';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!compra) return <Typography>No hay datos.</Typography>;

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 2, bgcolor: colors.background.default, p: 2, borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{compra.folio}</Typography>
      <Typography variant="body2" color="text.secondary">Proveedor: {compra.proveedor?.nombre ?? '—'}</Typography>
      <Typography variant="body2" color="text.secondary">Fecha: {formatDate(compra.fecha_compra ?? compra.created_at)}</Typography>
      <Typography variant="body2" color="text.secondary">Sucursal: {compra.sucursal?.nombre ?? '—'}</Typography>
      <Typography variant="body1" color="text.primary" sx={{ mt: 1, fontWeight: 'bold' }}>Total: {formatCurrency(compra.total_compra)}</Typography>
      </Box>
      

      <Box sx={{ 
  mt: 2, 
  bgcolor: colors.background.paper, 
  p: 2, 
  borderRadius: 2, 
  boxShadow: 2,
  borderLeft: `4px solid ${colors.primary.main}`
}}>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Inventory2Icon sx={{ mr: 1, color: colors.primary.main }} />
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      Detalles 
    </Typography>
  </Box>
  
  {Array.isArray(compra.detalles) && compra.detalles.length > 0 ? (
    <Stack spacing={1.5}>
      {compra.detalles.map((d) => (
        <Paper 
          key={d.id_compra_detalle || d.id} 
          elevation={0}
          sx={{ 
            p: 2, 
            borderRadius: 1,
            border: `1px solid ${colors.divider}`,
            '&:hover': {
              borderColor: colors.primary.light,
              boxShadow: `0 0 0 1px ${colors.primary.light}`
            }
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                {d.insumo?.nombre ?? '—'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <NumbersIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5 }} />
                    Cantidad: {d.cant_presentacion ?? d.cantidad ?? '—'}
                  </Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">•</Typography>
                <Typography variant="caption" color="text.secondary">
                  {d.presentacion ?? 'Sin presentación'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4} sx={{ textAlign: 'right' }}>
              <Typography variant="body1" sx={{ 
                fontWeight: 700,
                color: colors.primary.dark,
                fontSize: '1.1rem'
              }}>
                {formatCurrency(d.subtotal)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Subtotal
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}
      
      {/* Total */}
      {compra.total && (
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: `2px dashed ${colors.divider}`,
          textAlign: 'right'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Total: {formatCurrency(compra.total)}
          </Typography>
        </Box>
      )}
    </Stack>
  ) : (
    <Box sx={{ 
      textAlign: 'center', 
      py: 3,
      bgcolor: 'action.hover',
      borderRadius: 1
    }}>
      <Typography variant="body1" color="text.secondary">
        No se encontraron detalles
      </Typography>
    </Box>
  )}
</Box>
    </Box>
  );
};

export default CompraDetalle;
