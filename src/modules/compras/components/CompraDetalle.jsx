import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import comprasService from '../services/compras.service';

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
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{compra.folio}</Typography>
      <Typography variant="body2" color="text.secondary">Proveedor: {compra.proveedor?.nombre ?? '—'}</Typography>
      <Typography variant="body2" color="text.secondary">Fecha: {formatDate(compra.fecha_compra ?? compra.created_at)}</Typography>
      <Typography variant="body2" color="text.secondary">Sucursal: {compra.sucursal?.nombre ?? '—'}</Typography>
      <Typography variant="body2" color="text.primary" sx={{ mt: 1, fontWeight: 'bold' }}>Total: {formatCurrency(compra.total_compra)}</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Detalles</Typography>
        {Array.isArray(compra.detalles) && compra.detalles.length > 0 ? (
          compra.detalles.map((d) => (
            <Box key={d.id_compra_detalle || d.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <Box>
                <Typography variant="body2">{d.insumo?.nombre ?? '—'}</Typography>
                <Typography variant="caption" color="text.secondary">{d.presentacion ?? ''} · {d.insumo?.unidad_medida?.clave ?? ''}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2">{d.cant_presentacion ?? d.cantidad ?? '—'}</Typography>
                <Typography variant="caption" color="text.secondary">{formatCurrency(d.subtotal)}</Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No hay detalles.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default CompraDetalle;
