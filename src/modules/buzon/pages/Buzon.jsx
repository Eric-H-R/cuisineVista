import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import BuzonService from '../services/buzon.service';
import LoadingComponent from '../../../components/Loadings/LoadingComponent';
import { toast } from 'react-toastify';
import colores from '../../../theme/colores';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import colors from '../../../theme/colores';

const formatDateTime = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-MX');
  } catch {
    return iso;
  }
};

const Buzon = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [idFilter, setIdFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const res = await BuzonService.getAll(params);
      const data = res && res.data && (res.data.data || res.data) || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando buzón', err);
      toast.error('Error cargando mensajes del buzón');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load initially without filters
    load();
  }, []);

  const handleFilter = () => {
    const params = {};
    if (idFilter) {
      // include several possible id keys to be defensive with backend naming
      params.id_mejora = idFilter;
      params.cliente_id = idFilter;
      params.id = idFilter;
    }

    // Normalize dates to include full day range and send multiple possible param names
    if (dateFrom) {
      const start = `${dateFrom}T00:00:00`;
      params.fecha_desde = start;
      params.desde = start;
      params.created_from = start;
      params.created_at_from = start;
    }
    if (dateTo) {
      const end = `${dateTo}T23:59:59`;
      params.fecha_hasta = end;
      params.hasta = end;
      params.created_to = end;
      params.created_at_to = end;
    }

    // Debug log to inspect params (can be removed later)
    console.log('[Buzon] filter params', params);

    load(params);
  };

  const handleClear = () => {
    setIdFilter('');
    setDateFrom('');
    setDateTo('');
    load();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>Buzón de mejoras</Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 5 }}>Aquí puedes ver las mejoras y sugerencias enviadas por los clientes.</Typography>

      

      {loading ? (
        <LoadingComponent />
      ) : (
        <Grid container spacing={2}>
          {items.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary">No se encontraron mensajes.</Typography>
            </Grid>
          )}
{items.map((it, idx) => (
  <Grid size={{xs: 12, sm: 6, md: 4}} key={it.id_mejora ?? it.id ?? idx}>
    <Card sx={{ 
      borderRadius: 2, 
      border: '1px solid #E8E0D5',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        borderColor: colors.primary.dark
      }
    }}>
      {/* Header con color degradado */}
      <Box sx={{ 
        p: 2,
        bgcolor: 'primary.50',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Comentario #{it.id_mejora ?? '-'}
            </Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {it.notas?.substring(0, 80) || 'Sin título'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Descripción */}
        <Box sx={{ mb: 2, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Descripción
          </Typography>
          <Typography variant="body2" sx={{ 
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'text.primary'
          }}>
            {it.notas || 'Sin descripción disponible'}
          </Typography>
        </Box>
        
        {/* Información en 2 columnas */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
          mb: 2,
          p: 1.5,
          bgcolor: 'grey.50',
          borderRadius: 1
        }}>
          
          
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Prioridad
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {it.prioridad || 'Media'}
            </Typography>
          </Box>
        </Box>
        
        {/* Fecha y acciones */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pt: 1,
          borderTop: '1px dashed',
          borderColor: 'divider'
        }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Creado
            </Typography>
            <Typography variant="body2">
              {formatDateTime(it.created_at)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grid>
))}
        </Grid>
      )}
    </Container>
  );
};

export default Buzon;